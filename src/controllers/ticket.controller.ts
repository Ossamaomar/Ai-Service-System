import { NextFunction, Request, Response } from "express";
import { TicketService } from "src/services/ticket.service";
import { ApiError } from "src/utils/ApiError";
import { ApiResponse } from "src/utils/ApiResponse";

export class TicketController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new ApiError(403, "You are not authorized to do this action")
      }
      const ticket = await TicketService.createTicket(req.body, req.user);

      res
        .status(201)
        .json(new ApiResponse({ status: "success", data: ticket }));
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      if (Number(req.query.page) <= 0) {
        throw new ApiError(400, "Please provide a valid page number");
      }

      const tickets = await TicketService.getAllTickets(req.query);

      res.status(200).json(
        new ApiResponse({
          status: "success",
          results: tickets.length,
          data: tickets,
        })
      );
    } catch (error) {
      return next(error);
    }
  }
  
  static async getAllForCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (Number(req.query.page) <= 0) {
        throw new ApiError(400, "Please provide a valid page number");
      }
    
      const tickets = await TicketService.getAllTickets(req.query, req.user?.id);

      res.status(200).json(
        new ApiResponse({
          status: "success",
          results: tickets.length,
          data: tickets,
        })
      );
    } catch (error) {
      return next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await TicketService.getTicket(req.params.id!);

      res
        .status(200)
        .json(new ApiResponse({ status: "success", data: ticket }));
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.body)
      const ticket = await TicketService.updateTicket(req.params.id!, req.body, req.user!);

      res
        .status(200)
        .json(new ApiResponse({ status: "success", data: ticket }));
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await TicketService.deleteTicket(req.params.id!);

      res
        .status(204)
        .json(new ApiResponse({ status: "success", data: ticket }));
    } catch (error) {
      return next(error);
    }
  }
}
