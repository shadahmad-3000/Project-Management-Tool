const express = require("express");
const { authController } = require("../controllers");
const { authValidation } = require("../validations");
const validate = require("../middlewares/validator");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");

// router.post("/sign-up", validate(authValidation.signUpValidation), authController.signup);
router.post("/sign-in", validate(authValidation.signInValidation), authController.signIn);
router.post("/log-out",verifyToken, validate(authValidation.logoutValidation), authController.LogOut);
router.post("/change-password",verifyToken, validate(authValidation.changePasswordValidation), authController.changePasswordController);
router.post("/forget-password",authController.forgetPasswordController);
router.post("/reset-password",authController.resetPasswordController);

module.exports = router;