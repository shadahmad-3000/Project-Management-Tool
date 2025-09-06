const express = require("express");
const { signIn, signup, LogOut } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/sign-up", signup);
router.post("/sign-in", signIn);
router.post("/log-out",LogOut);

module.exports = router;