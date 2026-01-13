import express from "express";
import { AuthController } from "src/controllers/auth.controller";
import { TicketController } from "src/controllers/ticket.controller";
import { TicketPartController } from "src/controllers/ticketPart.controller";
import { TicketRepairController } from "src/controllers/ticketRepair.controller";

const router = express.Router();
router.use(AuthController.protectRoute);

router
  .route("/")
  .post(
    AuthController.authorizeRoute("ADMIN", "RECEPTIONIST"),
    TicketController.create
  )
  .get(
    AuthController.authorizeRoute(
      "ADMIN",
      "RECEPTIONIST",
      "TECHNICIAN",
      "CUSTOMER"
    ),
    TicketController.getAll
  );

router
  .route("/currentUser")
  .get(AuthController.authorizeRoute("CUSTOMER"), TicketController.getAllForCurrentUser);
  
router
  .route("/currentTechnician")
  .get(AuthController.authorizeRoute("TECHNICIAN"), TicketController.getAllForCurrentTechnician);
  
router
  .route("/currentTechnician/:id")
  .patch(AuthController.authorizeRoute("TECHNICIAN"), TicketController.assignForCurrentTechnician);

router
  .route("/:id")
  .get(TicketController.get)
  .patch(
    AuthController.authorizeRoute("ADMIN", "RECEPTIONIST", "TECHNICIAN"),
    TicketController.update
  )
  .delete(
    AuthController.authorizeRoute("ADMIN", "RECEPTIONIST"),
    TicketController.delete
  );

router.route("/:id/parts").get(TicketPartController.getAllPartsOnTicket);
router.route("/:id/repairs").get(TicketRepairController.getAllRepairsOnTicket);

export default router;
