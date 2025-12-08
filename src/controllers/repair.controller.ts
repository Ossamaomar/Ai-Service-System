import { NextFunction, Request, Response } from "express";
import { RepairService } from "src/services/repair.service";
import { ApiError } from "src/utils/ApiError";
import { ApiResponse } from "src/utils/ApiResponse";

export class RepairController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const part = await RepairService.createRepair(req.body);

      res.status(201).json(new ApiResponse({ status: "success", data: part }));
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (Number(req.query.page) <= 0) {
        throw new ApiError(400, "Please provide a valid page number");
      }
      
      const parts = await RepairService.getAllRepairs(req.query);

      res.status(200).json(
        new ApiResponse({
          status: "success",
          results: parts.length,
          data: parts,
        })
      );
    } catch (error) {
      return next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const part = await RepairService.getRepair(req.params.id!);

      res.status(200).json(new ApiResponse({ status: "success", data: part }));
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const part = await RepairService.updateRepair(req.params.id!, req.body);

      res.status(200).json(new ApiResponse({ status: "success", data: part }));
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const part = await RepairService.deleteRepair(req.params.id!);

      res.status(204).json(new ApiResponse({ status: "success", data: part }));
    } catch (error) {
      return next(error);
    }
  }
}
