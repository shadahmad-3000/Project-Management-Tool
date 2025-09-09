const Joi = require("joi");

const createTeamValidation = Joi.object({
    body: Joi.object({
        name: Joi.string()
            .required()
            .messages({
                "string.empty": "Team name is required",
                "string.min": "Team name must be at least 3 characters"
            }),

        teamCode: Joi.string()
            .alphanum()
            .required()
            .messages({
                "string.empty": "Team Code is required",
                "string.alphanum": "Team Code must only contain letters and numbers",
                "string.min": "Team Code must be at least 3 characters"
            }),

        teamMembers: Joi.array()
            .items(Joi.string().hex().length(24).messages({
                "string.length": "Each team member must be a valid 24-character MongoDB ObjectId"
            }))
            .required()
            .messages({
                "array.base": "Team members must be an array",
                "array.min": "At least one team member is required"
            })
    }),

    query: Joi.object({}),
    params: Joi.object({})
});

const updateTeamValidation = Joi.object({
    body: Joi.object({
        teamCode: Joi.string()
            .alphanum()
            .required()
            .messages({
                "string.empty": "Team Code is required",
                "string.alphanum": "Team Code must only contain letters and numbers",
                "string.min": "Team Code must be at least 3 characters"
            }),

        updateData: Joi.object()
            .required()
            .messages({
                "object.base": "Update Data must be an object",
                "object.min": "At least one field is required in updateData"
            })
    }),

    query: Joi.object({}),
    params: Joi.object({})
});

module.exports = {
    createTeamValidation,
    updateTeamValidation
};
