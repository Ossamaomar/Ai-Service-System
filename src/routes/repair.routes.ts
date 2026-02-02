import { Router } from "express";
import { AuthController } from "src/controllers/auth.controller";
import { RepairController } from "src/controllers/repair.controller";

const router = Router();

router.use(AuthController.protectRoute);

router
  .route("/")
  .get(RepairController.getAll)
  .post(
    AuthController.authorizeRoute("ADMIN", "STORE_MANAGER"),
    RepairController.create
  );

router
  .route("/:id")
  .get(RepairController.get)
  .patch(
    AuthController.authorizeRoute("ADMIN", "STORE_MANAGER"),
    RepairController.update
  )
  .delete(
    AuthController.authorizeRoute("ADMIN"),
    RepairController.delete
  );

export default router;
