import { Router } from "express";
import { AuthController } from "src/controllers/auth.controller";
import { PartController } from "src/controllers/part.controller";

const router = Router();

router.use(AuthController.protectRoute);

router
  .route("/")
  .get(AuthController.authorizeRoute("ADMIN", "TECHNICIAN", "RECEPTIONIST", "STORE_MANAGER"), PartController.getAll)
  .post(
    AuthController.authorizeRoute("ADMIN", "STORE_MANAGER", "TECHNICIAN"),
    PartController.create
  );

router
  .route("/:id")
  .get(PartController.get)
  .patch(
    AuthController.authorizeRoute("ADMIN", "STORE_MANAGER", "TECHNICIAN"),
    PartController.update
  )
  .delete(
    AuthController.authorizeRoute("ADMIN", "STORE_MANAGER"),
    PartController.delete
  );

export default router;
