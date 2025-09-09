const express = require("express");
const { SuperAdminController } = require("../controllers");
const validate = require("../middlewares/validator");
const { superAdminValidation } = require("../validations");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

router.post("/add-users",verifyToken,authorizeRoles("Super-Admin","Admin"),validate(superAdminValidation.addUserValidation),SuperAdminController.usersAdd);
router.get("/pending-users",verifyToken,authorizeRoles("Super-Admin"), validate(superAdminValidation.getPendingUsersValidation), SuperAdminController.getPendingUsers),
router.put("/approve-users/:id",verifyToken,authorizeRoles("Super-Admin"), validate(superAdminValidation.approveUserValidation), SuperAdminController.approveUser),
router.delete("/decline-user/:id",verifyToken,authorizeRoles("Super-Admin"), validate(superAdminValidation.declineUserValidation), SuperAdminController.declineUser);
router.post("/assign-role",verifyToken,authorizeRoles("Super-Admin"), validate(superAdminValidation.assignRoleValidation), SuperAdminController.roleAssign);
router.post("/create-project",verifyToken,authorizeRoles("Super-Admin","Admin"), validate(superAdminValidation.createProjectValidation), SuperAdminController.projectCreate);
router.post("/update-project",verifyToken,authorizeRoles("Super-Admin","Admin"), validate(superAdminValidation.updateProjectValidation), SuperAdminController.projectUpdate);


module.exports = router;