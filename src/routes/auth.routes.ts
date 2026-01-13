import express from "express";
import { AuthController } from "src/controllers/auth.controller";

const router = express.Router();

router.route("/signup").post(AuthController.signup);
router.route("/login").post(AuthController.login);
router.route("/logout").get(AuthController.logout);
router.route("/forgetPassword").post(AuthController.forgetPassword);
router.route("/resetPassword/:token").patch(AuthController.resetPassword);
router.route("/verifyOtp").post(AuthController.verifyOTP);
router.route("/resendOtp").post(AuthController.resendOTP);
router.route("/current").get(AuthController.protectRoute, AuthController.current);

router
  .route("/updatePassword")
  .patch(
    AuthController.protectRoute,
    // AuthController.authorizeRoute("ADMIN", "CUSTOMER"),
    AuthController.updatePassword
  );

export default router;
