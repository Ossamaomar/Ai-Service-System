import { NextFunction, Request, Response } from "express";
import { UserService } from "src/services/user.service";
import { ApiError } from "src/utils/ApiError";
import { ApiResponse } from "src/utils/ApiResponse";

export class UserController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.createUser(req.body);

      res.status(201).json(new ApiResponse({ status: "success", data: user }));
    } catch (error) {
      return next(error);
    }
  }

  static async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      throw new ApiError(403, "You are not authorized to do this action")
    }
    const {
      password: _pw,
      passwordConfirm: _pc,
      passwordResetToken: _t,
      passwordResetExpires: _r,
      ...userFiltered
    } = req.user;
    res.status(200).json({ status: "success", data: userFiltered });
  }

  static async updateCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserService.updateCurrentUser(req.user?.id!, req.body);

      res.status(200).json(new ApiResponse({ status: "success", data: user }));
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (Number(req.query.page) <= 0) {
        throw new ApiError(400, "Please provide a valid page number");
      }
      const users = await UserService.getAllUsers(req.query);

      res.status(200).json(
        new ApiResponse({
          status: "success",
          results: users.length,
          data: users,
        })
      );
    } catch (error) {
      return next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      let user: any = {};

      if (req.query.id) {
        user = await UserService.getUser(req.query.id);
      } else if (req.query.email) {
        user = await UserService.getUserByEmail(req.query.email);
      } else if (req.query.phone) {
        user = await UserService.getUserByPhone(req.query.phone);
      } else {
        throw new ApiError(400, "Please provide a parameter to search with");
      }

      res.status(200).json(
        new ApiResponse({
          status: "success",
          data: user,
        })
      );
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateUser(req.params.id!, req.body);

      res.status(200).json(new ApiResponse({ status: "success", data: user }));
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.deleteUser(req.params.id!);

      res.status(204).json(new ApiResponse({ status: "success", data: user }));
    } catch (error) {
      return next(error);
    }
  }
}
