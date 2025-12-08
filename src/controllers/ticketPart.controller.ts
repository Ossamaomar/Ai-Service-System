import { NextFunction, Request, Response } from "express";
import { TicketPartService } from "src/services/ticketPart.service";
import { ApiError } from "src/utils/ApiError";
import { ApiResponse } from "src/utils/ApiResponse";

export class TicketPartController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const part = await TicketPartService.createTicketPart(req.body);

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
      const parts = await TicketPartService.getAllTicketParts(req.query);

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
      const part = await TicketPartService.getTicketPart(req.params.id!);

      res.status(200).json(new ApiResponse({ status: "success", data: part }));
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const part = await TicketPartService.updateTicketPart(
        req.params.id!,
        req.body
      );

      res.status(200).json(new ApiResponse({ status: "success", data: part }));
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const part = await TicketPartService.deleteTicketPart(req.params.id!);

      res.status(204).json(new ApiResponse({ status: "success", data: part }));
    } catch (error) {
      return next(error);
    }
  }
}
