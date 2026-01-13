import { Router } from "express";
import { AuthController } from "src/controllers/auth.controller";
import { TicketPartController } from "src/controllers/ticketPart.controller";

const router = Router();

router.use(AuthController.protectRoute);

router
  .route("/")
  .get(
    AuthController.authorizeRoute("ADMIN", "TECHNICIAN"),
    TicketPartController.getAll
  )
  .post(
    AuthController.authorizeRoute("ADMIN", "TECHNICIAN"),
    TicketPartController.create
  );

router
  .route("/:id")
  .get(
    AuthController.authorizeRoute(
      "ADMIN",
      "TECHNICIAN",
      "RECEPTIONIST",
      "CUSTOMER"
    ),
    TicketPartController.get
  )
  .patch(
    AuthController.authorizeRoute("ADMIN", "TECHNICIAN"),
    TicketPartController.update
  )
  .delete(
    AuthController.authorizeRoute("ADMIN", "TECHNICIAN"),
    TicketPartController.delete
  );

router
  .route("/:id/parts")
  .get(
    AuthController.authorizeRoute(
      "ADMIN",
      "TECHNICIAN",
      "RECEPTIONIST",
      "CUSTOMER"
    ),
    TicketPartController.getAllPartsOnTicket
  );

export default router;
