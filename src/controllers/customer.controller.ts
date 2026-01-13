import { NextFunction, Request, Response } from "express";
import { CustomerService } from "src/services/customer.service";
import { CustomerCreateInputs } from "src/types";
import { ApiError } from "src/utils/ApiError";
import { APIFeatures } from "src/utils/ApiFeatures";
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
      const customers = await CustomerService.getAll(req.query);

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

  static async searchCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      let customer: any = null;

      if (req.query.name) {
        customer = await CustomerService.getByName(req.query.name!);
      } else if (req.query.phone) {
        customer = await CustomerService.getByPhone(req.query.phone!);
      } else if (req.query.email) {
        customer = await CustomerService.getByEmail(req.query.email!);
      } else {
        throw new ApiError(400, "Provide a field to search the customer with");
      }

      res
        .status(200)
        .json(new ApiResponse({ status: "success", data: customer }));
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

  static async getCustomersOverview(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (Number(req.query.page) <= 0) {
        throw new ApiError(400, "Please provide a valid page number");
      }
      const customers = await CustomerService.getCustomersOverview(req.query);

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
}
