import { NextFunction, Request, Response } from "express";
import { DeviceService } from "src/services/device.service";
import { ApiResponse } from "src/utils/ApiResponse";
import { validateData } from "src/utils/helpers";

export class DeviceController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const device = await DeviceService.createDevice(req.body);

      res
        .status(201)
        .json(new ApiResponse({ status: "success", data: device }));
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const devices = await DeviceService.getAllDevices(req.query);

      res.status(200).json(
        new ApiResponse({
          status: "success",
          results: devices.length,
          data: devices,
        })
      );
    } catch (error) {
      return next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const device = await DeviceService.getDevice(req.params.id!);

      res
        .status(200)
        .json(new ApiResponse({ status: "success", data: device }));
    } catch (error) {
      return next(error);
    }
  }

  static async getBySerialNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const device = await DeviceService.getDeviceBySerialNumber(req.params.serialNumber!);

      res
        .status(200)
        .json(new ApiResponse({ status: "success", data: device }));
    } catch (error) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const device = await DeviceService.updateDevice(req.params.id!, req.body);

      res
        .status(200)
        .json(new ApiResponse({ status: "success", data: device }));
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const device = await DeviceService.deleteDevice(req.params.id!);

      res
        .status(204)
        .json(new ApiResponse({ status: "success", data: device }));
    } catch (error) {
      return next(error);
    }
  }
}
