import { Router } from "express";
import { AuthController } from "src/controllers/auth.controller";
import { TicketRepairController } from "src/controllers/ticketRepair.controller";

const router = Router();

router.use(AuthController.protectRoute);

router
  .route("/")
  .get(TicketRepairController.getAll)
  .post(AuthController.authorizeRoute("ADMIN", "TECHNICIAN", "RECEPTION"), TicketRepairController.create);
  
router
  .route("/:id")
  .get(TicketRepairController.get)
  .patch(AuthController.authorizeRoute("ADMIN", "TECHNICIAN", "RECEPTION"), TicketRepairController.update)
  .delete(AuthController.authorizeRoute("ADMIN", "TECHNICIAN", "RECEPTION"), TicketRepairController.delete);

export default router;