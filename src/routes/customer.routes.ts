import express from "express";
import { AuthController } from "src/controllers/auth.controller";
import { CustomerController } from "src/controllers/customer.controller";

const router = express.Router();

router.use(AuthController.protectRoute);

router
  .route("/")
  .get(
    AuthController.authorizeRoute("ADMIN", "RECEPTIONIST", "TECHNICIAN"),
    CustomerController.getAll
  )
  .post(
    AuthController.authorizeRoute("ADMIN", "RECEPTIONIST", "CUSTOMER"),
    CustomerController.create
  );

router
  .route("/search")
  .get(
    AuthController.authorizeRoute(
      "ADMIN",
      "RECEPTIONIST",
      "TECHNICIAN",
      "CUSTOMER"
    ),
    CustomerController.searchCustomer
  );

router
  .route("/customersOverview")
  .get(
    AuthController.authorizeRoute("ADMIN", "RECEPTIONIST"),
    CustomerController.getCustomersOverview
  );

router
  .route("/:id")
  .get(
    AuthController.authorizeRoute("ADMIN", "RECEPTIONIST", "CUSTOMER"),
    CustomerController.getById
  )
  .patch(
    AuthController.authorizeRoute("ADMIN", "RECEPTIONIST"),
    CustomerController.update
  )
  .delete(
    AuthController.authorizeRoute("ADMIN", "RECEPTIONIST"),
    CustomerController.delete
  );

export default router;
