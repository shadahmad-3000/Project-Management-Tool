const express = require("express");
const router = express.Router();
const { userDelete, userUpdate, userGet} = require("../controllers/user.controller");

router.delete("/delete-user/:empID",userDelete);
router.put("/update-user/:empID",userUpdate);
router.get("/get-user",userGet);

module.exports = router;