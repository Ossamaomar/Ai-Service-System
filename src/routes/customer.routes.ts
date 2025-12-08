import express from "express";
import { AuthController } from "src/controllers/auth.controller";
import { CustomerController } from "src/controllers/customer.controller";

const router = express.Router();

router.use(AuthController.protectRoute, AuthController.authorizeRoute("ADMIN", "RECEPTION"));

router
  .route("/")
  .post(CustomerController.create)
  .get(CustomerController.getAll);

router
  .route("/:id")
  .get(CustomerController.getById)
  .patch(CustomerController.update)
  .delete(CustomerController.delete);

router
  .route("/getByPhone/:phone")
  .get(CustomerController.getByPhone);

router
  .route("/getByName/:name")
  .get(CustomerController.getByName);

router
  .route("/getByEmail/:email")
  .get(CustomerController.getByEmail);

export default router;
