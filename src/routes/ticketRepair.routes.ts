import { Router } from "express";
import { AuthController } from "src/controllers/auth.controller";
import { TicketRepairController } from "src/controllers/ticketRepair.controller";

const router = Router();

router.use(
  AuthController.protectRoute,
  AuthController.authorizeRoute("ADMIN", "TECHNICIAN", "RECEPTIONIST")
);

router
  .route("/")
  .get(TicketRepairController.getAll)
  .post(TicketRepairController.create);

router
  .route("/:id")
  .get(TicketRepairController.get)
  .patch(TicketRepairController.update)
  .delete(TicketRepairController.delete);

export default router;
