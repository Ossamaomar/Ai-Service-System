import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { Prisma } from "generated/prisma/client.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: any = undefined;

  // Custom API Error
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Prisma Known Request Errors (Database errors)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;

    switch (err.code) {
      case "P2002":
        // Unique constraint violation
        const target = err.meta?.target as string[] | undefined;
        const field = target?.join(", ") || "field";
        message = `A record with this ${field} already exists`;
        break;

      case "P2025":
        // Record not found
        statusCode = 404;
        message = "Record not found";
        break;

      case "P2003":
        // Foreign key constraint failed
        const fieldName = err.meta?.field_name as string | undefined;
        message = fieldName
          ? `Invalid reference to ${fieldName}`
          : "Related record not found";
        break;

      case "P2014":
        // Invalid ID
        message = "Invalid ID provided";
        break;

      case "P2016":
        // Query interpretation error
        message = "Query error occurred";
        break;

      case "P2021":
        // Table does not exist
        message = "Database table not found";
        break;

      case "P2022":
        // Column does not exist
        message = "Database column not found";
        break;

      default:
        message = "Database operation failed";
    }

    errors = {
      code: err.code,
      ...(err.meta && { meta: err.meta }),
    };
  }
  // Prisma Validation Errors (Missing required fields, wrong types, etc.)
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Validation failed";

    // Extract meaningful validation info from the error message
    const missingFieldMatch = err.message.match(/Argument `(\w+)` is missing/);
    const invalidTypeMatch = err.message.match(/Argument `(\w+)`.*Expected (\w+)/);

    if (missingFieldMatch) {
      message = `Missing required field: ${missingFieldMatch[1]}`;
      errors = {
        field: missingFieldMatch[1],
        type: "required",
      };
    } else if (invalidTypeMatch) {
      message = `Invalid type for field: ${invalidTypeMatch[1]}`;
      errors = {
        field: invalidTypeMatch[1],
        expected: invalidTypeMatch[2],
        type: "invalid_type",
      };
    } else {
      errors = {
        details: err.message,
      };
    }
  }
  // Prisma Initialization Errors (Connection issues, etc.)
  else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 503;
    message = "Database connection failed";
    errors = {
      code: err.errorCode,
    };
  }
  // Prisma Rust Panic Errors (Serious internal errors)
  else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    message = "Database engine error occurred";
  }
  // JWT Errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Login session expired. Please login again";
  } else if (err.name === "NotBeforeError") {
    statusCode = 401;
    message = "Token not yet valid";
  }
  // Validation Errors (e.g., from Zod, express-validator)
  else if (err.name === "ZodError") {
    statusCode = 400;
    message = "Validation failed";
    errors = (err as any).errors;
  }
  // Multer Errors (File upload errors)
  else if (err.name === "MulterError") {
    statusCode = 400;
    const multerErr = err as any;
    
    switch (multerErr.code) {
      case "LIMIT_FILE_SIZE":
        message = "File size exceeds the maximum limit";
        break;
      case "LIMIT_FILE_COUNT":
        message = "Too many files uploaded";
        break;
      case "LIMIT_UNEXPECTED_FILE":
        message = "Unexpected file field";
        break;
      default:
        message = "File upload error";
    }
  }
  // Syntax Errors
  else if (err instanceof SyntaxError && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON format";
  }
  // Cast Errors (Invalid data type)
  else if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid data format";
  }
  // Generic Error
  else {
    message = err.message || "Internal Server Error";
  }

  // Log error for debugging (only in development or to logging service)
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      ...(errors && { errors }),
    });
  }

  // Send response
  res.status(statusCode).json({
    status: "fail",
    message,
    ...(process.env.NODE_ENV === "development" && { 
      ...(errors && { errors }),
      stack: err.stack,
      errorName: err.name,
    }),
  });
};

// 404 handler for undefined routes
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    success: false,
    status: "fail",
    message: `Cannot find ${req.method} ${req.originalUrl} on this server`,
  });
};

// Async error handler wrapper (to avoid try-catch in every controller)
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};