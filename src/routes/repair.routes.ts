import { Router } from "express";
import { AuthController } from "src/controllers/auth.controller";
import { RepairController } from "src/controllers/repair.controller";

const router = Router();

router.use(AuthController.protectRoute);

router
  .route("/")
  .get(RepairController.getAll)
  .post(
    AuthController.authorizeRoute("ADMIN", "TECHNICIAN"),
    RepairController.create
  );

router
  .route("/:id")
  .get(RepairController.get)
  .patch(
    AuthController.authorizeRoute("ADMIN", "TECHNICIAN"),
    RepairController.update
  )
  .delete(
    AuthController.authorizeRoute("ADMIN", "TECHNICIAN"),
    RepairController.delete
  );

export default router;
