import express from "express";
import { AuthController } from "src/controllers/auth.controller";
import { UserController } from "src/controllers/user.controller";

const router = express.Router();

router.use(AuthController.protectRoute);

router
  .route("/currentUser")
  .get(UserController.getCurrentUser)
  .patch(
    // AuthController.authorizeRoute("ADMIN", "CUSTOMER"),
    UserController.updateCurrentUser
  );

router
  .route("/")
  .get(
    AuthController.authorizeRoute("ADMIN", "RECEPTIONIST", "TECHNICIAN"),
    UserController.getAll
  )
  .post(AuthController.authorizeRoute("ADMIN"), UserController.create);


router.route("/techniciansOverview").get(AuthController.authorizeRoute("ADMIN", "RECEPTIONIST"), UserController.getTechniciansOverview)

router.use(AuthController.authorizeRoute("ADMIN"));

router.route("/search").get(UserController.get);
router.route("/:id").patch(UserController.update).delete(UserController.delete);

export default router;
