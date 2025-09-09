const Joi = require("joi");

const sentOTPValidation = Joi.object({
    body: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Email must be valid"
            }),
    }),
});

const resendOTPValidation = Joi.object({
    body: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Email must be valid"
            }),
    }),
});

const verifyOTPValidation = Joi.object({
    body: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Email must be valid"
            }),

        otp: Joi.string()
            .pattern(/^[0-9]{6}$/) 
            .required()
            .messages({
                "string.empty": "OTP is required",
                "string.pattern.base": "OTP must be a 6-digit number"
            }),
    }),
});

module.exports = {
    sentOTPValidation,
    resendOTPValidation,
    verifyOTPValidation
};
