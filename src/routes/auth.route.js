const express = require("express");
const { AuthController } = require("../controllers");
const { authValidation } = require("../validations");
const validate = require("../middlewares/validator");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware")

router.post("/sign-up", validate(authValidation.signUpValidation), AuthController.signup);
router.post("/sign-in", validate(authValidation.signInValidation), AuthController.signIn);
router.post("/log-out", verifyToken, validate(authValidation.logoutValidation), AuthController.LogOut);

module.exports = router;