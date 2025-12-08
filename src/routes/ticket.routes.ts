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
    AuthController.authorizeRoute("ADMIN", "RECEPTION"),
    TicketController.create
  )
  .get(TicketController.getAll);

router
  .route("/:id")
  .get(TicketController.get)
  .patch(AuthController.authorizeRoute("ADMIN", "RECEPTION", "TECHNICIAN"), TicketController.update)
  .delete(AuthController.authorizeRoute("ADMIN", "RECEPTION"), TicketController.delete);

router.route("/:id/parts").get(TicketPartController.getAllPartsOnTicket);
router.route("/:id/repairs").get(TicketRepairController.getAllRepairsOnTicket);

export default router;
