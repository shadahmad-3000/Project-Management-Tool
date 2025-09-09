const express = require("express");
const router = express.Router();
const { UserController } = require("../controllers");
const validate = require("../middlewares/validator");
const { userValidation } = require("../validations");
const {verifyToken} = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

router.delete("/delete-user/:empID",verifyToken,authorizeRoles("Super-Admin","Admin"), validate(userValidation.deleteUserValidation),UserController.userDelete);
router.put("/update-user/:empID",verifyToken,authorizeRoles("Super-Admin","Admin"), validate(userValidation.updateUserValidation),UserController.userUpdate);
router.get("/get-user",verifyToken,authorizeRoles("Super-Admin","Admin","HR"), validate(userValidation.getUsersValidation),UserController.userGet);

module.exports = router;