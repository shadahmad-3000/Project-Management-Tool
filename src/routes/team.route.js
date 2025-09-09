const express = require("express");
const { TeamController } = require("../controllers");
const { teamValidation } = require("../validations");
const validate = require("../middlewares/validator");
const router = express.Router();

router.post("/create-team",validate(teamValidation.createTeamValidation),TeamController.teamCreate);
router.post("/update-team",validate(teamValidation.updateTeamValidation),TeamController.teamUpdate);


module.exports = router;