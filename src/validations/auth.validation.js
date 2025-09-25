const Joi = require("joi");

// const signUpValidation = Joi.object({
//     body: Joi.object({
//         email: Joi.string().email().optional(),
//         password: Joi.string().min(6).optional(),
//         name: Joi.string().required(),
//         //empID: Joi.string().required(),
//         phoneNo: Joi.string().pattern(/^[0-9]{10}$/).required(),
//         //designation: Joi.string().required(),
//     }),

//     // query: Joi.object({
//     //     referral: Joi.string().optional(), // e.g., ?referral=abc123
//     // }),

//     // params: Joi.object({
//     //     orgId: Joi.string().hex().length(24).required(), // e.g., /signup/:orgId
//     // }),
// });

// Signin validation
const signInValidation = Joi.object({
    body: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Email must be a valid email address"
            }),

        password: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.empty": "Password is required",
                "string.min": "Password must be at least 6 characters"
            }),
    })
});

const changePasswordValidation = Joi.object({
    body: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Email must be a valid email address",
            }),
        oldPassword: Joi.string()
            .min(4)
            .required()
            .messages({
                "string.empty": "Old Password is required",
                "string.min": "Old Password must be at least 4 characters",
            }),
        newPassword: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.empty": "New Password is required",
                "string.min": "New Password must be at least 6 characters",
            }),
    }),
});


const logoutValidation = Joi.object({
    body: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Email must be a valid email address"
            }),
    }), 
});


module.exports = { signInValidation,changePasswordValidation,logoutValidation };