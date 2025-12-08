import { Router } from "express";
import { AuthController } from "src/controllers/auth.controller";
import { TicketPartController } from "src/controllers/ticketPart.controller";

const router = Router();

router.use(AuthController.protectRoute);

router
  .route("/")
  .get(TicketPartController.getAll)
  .post(TicketPartController.create);

router
  .route("/:id")
  .get(TicketPartController.get)
  .patch(TicketPartController.update)
  .delete(TicketPartController.delete);

router.route("/:id/parts").get(TicketPartController.getAllPartsOnTicket);

export default router;
