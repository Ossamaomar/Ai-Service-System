import express from "express";
import { AuthController } from "src/controllers/auth.controller";
import { UserController } from "src/controllers/user.controller";

const router = express.Router();

router.use(AuthController.protectRoute);

router
  .route("/currentUser")
  .get(UserController.getCurrentUser)
  .patch(
    AuthController.authorizeRoute("ADMIN", "CUSTOMER"),
    UserController.updateCurrentUser
  );

router.use(AuthController.authorizeRoute("ADMIN"));

router.route("/").get(UserController.getAll).post(UserController.create);
router.route("/search").get(UserController.get);
router.route("/:id").patch(UserController.update).delete(UserController.delete);

export default router;
