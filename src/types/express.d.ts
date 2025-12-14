import "express";
import { User } from "generated/prisma/client";

declare module "express" {
  export interface Request {
    user?: User; // you can replace 'any' with your User type
  }
}
