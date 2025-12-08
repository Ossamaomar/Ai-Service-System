import type { Request, Response, NextFunction } from "express";
import { UserRole } from "generated/prisma/enums";
import { UserModel } from "src/models/user.model";
import { AuthService } from "src/services/auth.service";
import { ApiError } from "src/utils/ApiError";
import { ApiResponse } from "src/utils/ApiResponse";
import { signToken, verifyToken } from "src/utils/helpers";

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.password || !req.body.passwordConfirm) {
        throw new ApiError(
          400,
          "Please provide both password and password confirm"
        );
      }

      const user = await AuthService.signup(req.body);
      const token = signToken(user.id);

      res
        .status(201)
        .json(new ApiResponse({ status: "success", token: token, data: user }));
    } catch (error) {
      return next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.email || !req.body.password) {
        throw new ApiError(400, "Please provide your email and password");
      }

      const user = await AuthService.login(req.body);
      const token = signToken(user.id);

      res
        .status(200)
        .json(new ApiResponse({ status: "success", token: token, data: user }));
    } catch (error) {
      return next(error);
    }
  }

  static async protectRoute(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log(req.headers.authorization);
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer")
      ) {
        throw new ApiError(401, "Please login first to do this action");
      }

      const decoded = verifyToken(
        req.headers.authorization.split("Bearer ")[1]!
      );

      const user = await UserModel.findById(decoded.id);

      req.user = user;
      next();
    } catch (error) {
      return next(error);
    }
  }

  static authorizeRoute(...roles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new ApiError(403, "You are not allowed to perform this action")
        );
      }

      next();
    };
  }
}
