import express from "express";
import { AuthController } from "src/controllers/auth.controller";
import { TicketController } from "src/controllers/ticket.controller";

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

export default router;
