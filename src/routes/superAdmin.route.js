const express = require("express");
const { getPendingUsers, approveUser, declineUser, roleAssign } = require("../controllers/superAdmin.controller");
const router = express.Router();

router.get("/pending-users",getPendingUsers),
router.put("/approve-users/:id",approveUser),
router.delete("/decline-user/:id",declineUser);
router.post("/assign-role",roleAssign);


module.exports = router;