import { NextFunction, Request, Response } from "express";
import { CustomerService } from "src/services/customer.service";
import { CustomerCreateInputs } from "src/types";
import { ApiError } from "src/utils/ApiError";
import { ApiResponse } from "src/utils/ApiResponse";

export class CustomerController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.create(req.body);

      res
        .status(201)
        .json(new ApiResponse({ status: "success", data: customer }));
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const customers = await CustomerService.getAll();

      res.status(200).json(
        new ApiResponse({
          status: "success",
          results: customers.length,
          data: customers,
        })
      );
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.getById(req.params.id!);

      res
        .status(200)
        .json(new ApiResponse({ status: "success", data: customer }));
    } catch (error) {
      return next(error);
    }
  }

  static async getByPhone(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.getByPhone(req.params.phone!);

      res
        .status(200)
        .json(new ApiResponse({ status: "success", data: customer }));
    } catch (error) {
      return next(error);
    }
  }

  static async getByName(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.getByName(req.params.name!);

      res
        .status(200)
        .json(new ApiResponse({ status: "success", data: customer }));
    } catch (error) {
      return next(error);
    }
  }

  static async getByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.getByEmail(req.params.email!);

      res
        .status(200)
        .json(new ApiResponse({ status: "success", data: customer }));
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.edit(req.params.id!, req.body);

      res
        .status(200)
        .json(new ApiResponse({ status: "success", data: customer }));
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const customer = await CustomerService.delete(req.params.id!);

      res
        .status(200)
        .json(new ApiResponse({ status: "success", data: customer }));
    } catch (error) {
      return next(error);
    }
  }
}
