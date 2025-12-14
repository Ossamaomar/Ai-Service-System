import jwt from "jsonwebtoken";
import { z, ZodObject } from "zod";
import { ApiError } from "./ApiError";
import { randomBytes } from "crypto";
import { Response } from "express";
import { User } from "generated/prisma/client";

export function signToken(id: string) {
  console.log(process.env.JWT_EXPIRES_IN);
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: `${Number(process.env.JWT_EXPIRES_IN)}H`,
  });
}

export function verifyToken(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.verify(token, process.env.JWT_SECRET) as { id: string };
}

export function generateTicketNumber(prefix = "TI") {
  const year = new Date().getFullYear();

  // Use a random auto-increment style number padded to 4 digits
  const seq = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");

  return `${prefix}-${year}-${seq}`;
}

export function generateDeviceCode(prefix = "DC") {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomPart = "";

  for (let i = 0; i < 11; i++) {
    randomPart += charset[Math.floor(Math.random() * charset.length)];
  }

  return `${prefix}-${randomPart}`;
}

export function validateData<T extends ZodObject<any>>(
  schema: T,
  data: unknown
): z.infer<T> {
  const validatedData = schema.safeParse(data);

  if (!validatedData.success) {
    // Log errors in development
    if (process.env.NODE_ENV === "development") {
      validatedData.error.issues.forEach((err) => {
        console.log(`${err.path.join(".")}: ${err.message}`);
      });
    }

    throw new ApiError(
      400,
      validatedData.error.issues[0]?.message || "Validation failed"
    );
  }

  return validatedData.data;
}

export function createPasswordResetToken() {
  const resetToken = randomBytes(32).toString("hex");

  return resetToken;
}

export function checkPasswordChangedAfterTokenCreated(
  JWTTimeStamp: number,
  user: User
) {
  return Math.floor(user.passwordChangedAt.getTime() / 1000) > JWTTimeStamp;
}

export function createSendToken(user: any, statusCode: number, res: Response) {
  const token = signToken(user.id);
  const cookieOptions = {
    secure: false,
    httpOnly: true,
    expires: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  user.password = undefined;

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: user,
  });
}


export function cleanUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  ) as Partial<T>;
}

export function normalizeNullable<T extends object>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : v])
  );
}
