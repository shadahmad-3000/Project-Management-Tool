const Joi = require("joi");

const addUserValidation = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "string.empty": "Name is required",
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
    status: Joi.string().valid("Not Started", "Pending" ,"In Progress", "Completed", "On Hold").optional(),
    priority: Joi.string().valid("Low", "Medium", "High").optional(),
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

const createTaskValidation = Joi.object({
  body: Joi.object({
    taskName: Joi.string().required().messages({ "string.empty": "Task Name is required" }),
    taskId: Joi.string().required().messages({ "string.empty": "Task ID is required" }),
    description: Joi.string().required().messages({ "string.empty": "Description is required" }),
    assignedBy: Joi.string().required().messages({ "string.empty": "AssignedBy is required" }),
    assignedTo: Joi.array()
      .items(Joi.string().required())
      .min(1)
      .required()
      .messages({ "array.min": "At least one AssignedTo is required" }),
    assigneeEmail: Joi.array()
      .items(
        Joi.string()
          .email()
          .required()
          .messages({ "string.email": "Invalid email format", "string.empty": "Email cannot be empty" })
      )
      .min(1)
      .required()
      .messages({ "array.min": "At least one assignee email is required" }),
    taskStatus: Joi.string()
      .valid("Not Started", "Pending", "In Progress", "Completed", "On Hold")
      .required()
      .messages({ "any.only": "Invalid Task Status" }),
    taskduration: Joi.string().required().messages({ "string.empty": "Task Duration is required" }),
    taskDeadline: Joi.object({
      startDate: Joi.date()
        .min("now")
        .required()
        .messages({
          "date.base": "Start Date must be a valid date",
          "date.min": "Start Date cannot be in the past",
          "any.required": "Start Date is required"
        }),
      endDate: Joi.date()
        .greater(Joi.ref('startDate'))
        .required()
        .messages({
          "date.base": "End Date must be a valid date",
          "date.greater": "End Date must be after Start Date",
          "any.required": "End Date is required"
        })
    }).required()
      .messages({ "any.required": "Task Deadline is required" }),
    taskPriority: Joi.string()
      .valid("Low", "Medium", "High")
      .required()
      .messages({ "any.only": "Invalid Task Priority" }),
  }),

  query: Joi.object({}),
  params: Joi.object({}),
});

const updateTaskValidation = Joi.object({
  body: Joi.object({
    taskId: Joi.string().required().messages({ "string.empty": "Task ID is required" }),
    updateTask: Joi.object({
      taskName: Joi.string().optional(),
      description: Joi.string().optional(),
      assignedBy: Joi.string().optional(),
      assignedTo: Joi.array().items(Joi.string()).optional(),
      assigneeEmail: Joi.array()
        .items(Joi.string().email().messages({ "string.email": "Invalid email format" }))
        .optional(),
      taskStatus: Joi.string().valid("Not Started", "Pending", "In Progress", "Completed", "On Hold").optional(),
      taskduration: Joi.number().optional(),
        taskDeadline: Joi.object({
        startDate: Joi.date().optional(),
        endDate: Joi.date().min(Joi.ref("startDate")).optional(),
      }).optional(),
      taskPriority: Joi.string().valid("Low", "Medium", "High").optional(),
    }).required().messages({ "object.base": "updateTask must be an object with valid fields" }),
  }),
  query: Joi.object({}),
  params: Joi.object({}),
});

module.exports = {
  addUserValidation,
  getPendingUsersValidation,
  approveUserValidation,
  declineUserValidation,
  assignRoleValidation,
  createProjectValidation,
  updateProjectValidation,
  createTaskValidation,
  updateTaskValidation
};
