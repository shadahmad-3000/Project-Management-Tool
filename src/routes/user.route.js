const express = require("express");
const router = express.Router();
const { UserController } = require("../controllers");
const validate = require("../middlewares/validator");
const { userValidation } = require("../validations");
const { verifyToken } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const enums = require("../utils/enums");

router.delete("/delete-user/:empID", verifyToken, authorizeRoles(enums.ADMINS), validate(userValidation.deleteUserValidation), UserController.userDelete);
router.put("/update-user/:empID", verifyToken, authorizeRoles(enums.ADMINS), validate(userValidation.updateUserValidation), UserController.userUpdate);
router.get("/get-user", verifyToken, authorizeRoles(enums.MANAGEMENT), validate(userValidation.getUsersValidation), UserController.userGet);

module.exports = router;