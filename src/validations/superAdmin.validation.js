const Joi = require("joi");

const addUserValidation = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name should have at least 3 characters",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
    }),

  empID: Joi.string()
    .alphanum()
    .required()
    .messages({
      "string.empty": "Employee ID is required",
      "string.alphanum": "Employee ID must be alphanumeric",
    }),

  designation: Joi.string()
    .required()
    .messages({
      "string.empty": "Designation is required",
    }),

  phoneNo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be 10 digits",
    }),

  department: Joi.string()
    .required()
    .messages({
      "string.empty": "Department is required",
    }),
});

const getPendingUsersValidation = Joi.object({
    body: Joi.object({}),
    query: Joi.object({}),
    params: Joi.object({})
});

const approveUserValidation = Joi.object({
    body: Joi.object({}),
    query: Joi.object({}),
    params: Joi.object({
        id: Joi.string()
            .hex()
            .length(24) // MongoDB ObjectId
            .required()
            .messages({
                "string.empty": "User ID is required",
                "string.length": "User ID must be a valid 24 character ObjectId"
            })
    })
});

const declineUserValidation = Joi.object({
    body: Joi.object({}),
    query: Joi.object({}),
    params: Joi.object({
        id: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                "string.empty": "User ID is required",
                "string.length": "User ID must be a valid 24 character ObjectId"
            })
    })
});


const assignRoleValidation = Joi.object({
    body: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                "string.empty": "Email is required",
                "string.email": "Email must be valid"
            }),

        role: Joi.string()
            .valid("User", "Admin", "Super-Admin", "Manager", "Team-Lead", "HR")
            .required()
            .messages({
                "any.only": "Role must be one of User, Admin, Super-Admin, Manager, Team-Lead, HR",
                "string.empty": "Role is required"
            })
    }),

    query: Joi.object({}),
    params: Joi.object({})
});

const createProjectValidation = Joi.object({
    body: Joi.object({
        title: Joi.string().required().messages({ "string.empty": "Title is required" }),
        description: Joi.string().allow("", null),
        projectCode: Joi.string().required().messages({ "string.empty": "Project Code is required" }),
        startDate: Joi.date().iso().required().messages({ "date.base": "Start Date must be valid ISO date" }),
        endDate: Joi.date().iso().greater(Joi.ref("startDate")).messages({ "date.greater": "End Date must be after Start Date" }),
        status: Joi.string().valid("Not Started", "In Progress", "Completed", "On Hold").optional(),
        priority: Joi.string().valid("Low", "Medium", "High", "Critical").optional(),
        createdBy: Joi.string().required().messages({ "string.empty": "CreatedBy is required" }),
        assignedTo: Joi.array().items(Joi.string())
    }),

    query: Joi.object({}),
    params: Joi.object({})
});

const updateProjectValidation = Joi.object({
    body: Joi.object({
        projectCode: Joi.string().required().messages({ "string.empty": "Project Code is required" }),
        update: Joi.object().min(1).required().messages({
            "object.base": "Update must be an object",
            "object.min": "At least one field is required to update"
        })
    }),

    query: Joi.object({}),
    params: Joi.object({})
});

module.exports = {
    addUserValidation,
    getPendingUsersValidation,
    approveUserValidation,
    declineUserValidation,
    assignRoleValidation,
    createProjectValidation,
    updateProjectValidation
};
