const Joi = require("joi");

const deleteUserValidation = Joi.object({
    params: Joi.object({
        empID: Joi.string()
            .alphanum()
            .required()
            .messages({
                "string.empty": "empID is required",
                "string.alphanum": "empID must contain only letters and numbers",
                "any.required": "empID is required"
            }),
    }),
    body: Joi.object({}),
    query: Joi.object({})
});

const updateUserValidation = Joi.object({
    params: Joi.object({
        empID: Joi.string()
            .alphanum()
            .required()
            .messages({
                "string.empty": "empID is required",
                "string.alphanum": "empID must contain only letters and numbers",
                "any.required": "empID is required"
            }),
    }),
    body: Joi.object({
        updateData: Joi.object()
            .required()
            .messages({
                "object.base": "updateData must be an object",
                "object.min": "At least one field is required in updateData"
            })
    }),
    query: Joi.object({})
});

const getUsersValidation = Joi.object({
    params: Joi.object({}),
    body: Joi.object({}),
    query: Joi.object({})
});

module.exports = {
    deleteUserValidation,
    updateUserValidation,
    getUsersValidation
};
