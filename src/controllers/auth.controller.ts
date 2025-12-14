import type { Request, Response, NextFunction } from "express";
import { UserRole } from "generated/prisma/enums";
import { UserModel } from "src/models/user.model";
import { AuthService } from "src/services/auth.service";
import { ApiError } from "src/utils/ApiError";
import { ApiResponse } from "src/utils/ApiResponse";
import {
  checkPasswordChangedAfterTokenCreated,
  createSendToken,
  signToken,
  verifyToken,
} from "src/utils/helpers";

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body.password || !req.body.passwordConfirm) {
        throw new ApiError(
          400,
          "Please provide both password and password confirm"
        );
      }

      if (req.body.role) {
        throw new ApiError(400, "You can not provide a role in signup");
      }

      const user = await AuthService.signup(req.body);

      // createSendToken(user, 201, res);
      res.status(201).json(
        new ApiResponse({
          status: "success",
          data: user,
          message: "Signup successful. OTP sent to your phone.",
        })
      );
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
      createSendToken(user, 200, res);
    } catch (error) {
      return next(error);
    }
  }

  static async protectRoute(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Check if token is provided in the request
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer")
      ) {
        throw new ApiError(401, "Please login first to do this action");
      }

      // 2. Verify token didn't expire
      const decoded: any = verifyToken(
        req.headers.authorization.split("Bearer ")[1]!
      );

      // 3. Check if user still exists
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        throw new ApiError(401, "User belonging to this token no longer exist");
      }

      // 4. Check if password changed after token
      const isChangedAfter = checkPasswordChangedAfterTokenCreated(
        decoded.iat,
        user
      );

      if (isChangedAfter) {
        throw new ApiError(401, "Please login again after password changed");
      }

      req.user = user;
      next();
    } catch (error) {
      return next(error);
    }
  }

  static authorizeRoute(...roles: UserRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return next(
          new ApiError(403, "You are not allowed to perform this action")
        );
      }

      next();
    };
  }

  static async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.forgetPassword(req.body);

      res.status(200).json(
        new ApiResponse({
          status: "success",
          message: "Email successfully sent",
        })
      );
    } catch (error) {
      return next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.resetPassword(req.params.token!, req.body);

      res.status(200).json(
        new ApiResponse({
          status: "success",
          message: "Your password has successfully updated",
        })
      );
    } catch (error) {
      return next(error);
    }
  }

  static async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.updatePassword(req.user!, req.body);

      createSendToken(user, 200, res);
    } catch (error) {
      return next(error);
    }
  }

  static async verifyOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, otp } = req.body;
      const user = await AuthService.verifyOTP(phone, otp);

      createSendToken(user, 200, res);
    } catch (error) {
      return next(error);
    }
  }

  static async resendOTP(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body;
      const result = await AuthService.resendOTP(phone);

      res.status(200).json(
        new ApiResponse({
          status: "success",
          data: result,
          message: "OTP resent successfully",
        })
      );
    } catch (error) {
      return next(error);
    }
  }
}
