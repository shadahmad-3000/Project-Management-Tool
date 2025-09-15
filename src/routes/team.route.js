const express = require("express");
const { TeamController } = require("../controllers");
const { teamValidation } = require("../validations");
const validate = require("../middlewares/validator");
const { verifyToken } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");
const router = express.Router();
const enums = require("../utils/enums");

router.post("/create-team",verifyToken,authorizeRoles(enums.ADMINS), validate(teamValidation.createTeamValidation),TeamController.teamCreate);
router.post("/update-team",verifyToken,authorizeRoles(enums.ADMINS),validate(teamValidation.updateTeamValidation),TeamController.teamUpdate);
router.get("/get-teams",verifyToken,authorizeRoles(enums.MANAGEMENT),TeamController.teamGet);
router.get("/getteamsbyId",verifyToken,authorizeRoles(enums.MANAGEMENT),TeamController.getTeambyIdController)

module.exports = router;