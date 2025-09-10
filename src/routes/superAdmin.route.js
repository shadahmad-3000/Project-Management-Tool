const express = require("express");
const { SuperAdminController } = require("../controllers");
const validate = require("../middlewares/validator");
const { superAdminValidation } = require("../validations");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const enums = require("../utils/enums");

router.post("/add-users", verifyToken, authorizeRoles(enums.ADMINS), validate(superAdminValidation.addUserValidation), SuperAdminController.usersAdd);
router.get("/pending-users", verifyToken, authorizeRoles(enums.ACCESS), validate(superAdminValidation.getPendingUsersValidation), SuperAdminController.getPendingUsers),
router.put("/approve-users/:id", verifyToken, authorizeRoles(enums.ACCESS), validate(superAdminValidation.approveUserValidation), SuperAdminController.approveUser),
router.delete("/decline-user/:id", verifyToken, authorizeRoles(enums.ACCESS), validate(superAdminValidation.declineUserValidation), SuperAdminController.declineUser);
router.post("/assign-role", verifyToken, authorizeRoles(enums.ACCESS), validate(superAdminValidation.assignRoleValidation), SuperAdminController.roleAssign);
router.post("/create-project", verifyToken, authorizeRoles(enums.ADMINS), validate(superAdminValidation.createProjectValidation), SuperAdminController.projectCreate);
router.post("/update-project", verifyToken, authorizeRoles(enums.ADMINS), validate(superAdminValidation.updateProjectValidation), SuperAdminController.projectUpdate);

router.post("/create-task", verifyToken, authorizeRoles(enums.ADMINS), validate(superAdminValidation.createTaskValidation), SuperAdminController.taskcreate);
router.post("/update-task", verifyToken, authorizeRoles(enums.ADMINS), validate(superAdminValidation.updateTaskValidation), SuperAdminController.taskUpdate);


module.exports = router;