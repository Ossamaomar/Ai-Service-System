import { Router } from "express";
import { AuthController } from "src/controllers/auth.controller";
import { DeviceController } from "src/controllers/device.controller";

const router = Router();

router.use(AuthController.protectRoute);

router
  .route("/")
  .get(DeviceController.getAll)
  .post(
    AuthController.authorizeRoute("ADMIN", "RECEPTIONIST"),
    DeviceController.create
  );

router
  .route("/:id")
  .get(DeviceController.getById)
  .patch(DeviceController.update)
  .delete(DeviceController.delete);

router
  .route("/serialNumber/:serialNumber")
  .get(DeviceController.getBySerialNumber);
export default router;
