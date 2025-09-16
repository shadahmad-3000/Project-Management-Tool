const ApiError = require("../utils/apiError");
const moment = require("moment");
const { status: httpStatus } = require("http-status");
const { User, Project, Task } = require("../models");
const { required } = require("joi");
const bcrypt = require("bcryptjs");

const addUsers = async (body) => {
    try {
        const { name, email, password, empID, designation, phoneNo, department } = body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            empID,
            designation,
            phoneNo,
            department
        });
        console.log("User Created", user);
        if (!user) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "User Not Found"
            }
        };
        return {
            status: httpStatus.OK,
            message: "User Added Successfully"
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error?.message || "Internal Server Error"
        }
    }
};

const getPendingUsers = async () => {
    try {
        const users = await User.find({
            isVerified: true,
            isApproved: false
        });
        if (!users) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Users Not Found"
            }
        }
        return {
            status: httpStatus.OK,
            message: "All Pending Users are-",
            data: users
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error?.message || "Interal server Error"
        }
    }
};

const approveUser = async (userId) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { isApproved: true },
            { new: true }
        );
        if (!updatedUser) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "User Not Found"
            };
        }
        return {
            status: httpStatus.OK,
            message: "User Approved Successfully",
            data: updatedUser
        };
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error?.message || "Internal Server Error"
        };
    }
};

const declineUser = async (userId) => {
    try {
        const deletedUser = await User.findOneAndDelete({ _id: userId });
        if (!deletedUser) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "User Not Found"
            };
        }
        return {
            status: httpStatus.OK,
            message: "User Declined and Removed",
            data: deletedUser
        };
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error?.message || "Internal Server Error"
        };
    }
};

const assignRole = async (body) => {
    try {
        const { email, role } = body;
        const validRole = ["User", "Admin", "Super-Admin", "Manager", "Team-Lead", "HR"];
        if (!validRole.includes(role)) {
            return {
                status: httpStatus.BAD_REQUEST,
                message: "Invalid Role"
            };
        }
        const user = await User.findOneAndUpdate(
            { email: email },
            { $set: { role } },
            { new: true }
        );
        console.log("User Found", user);
        if (!user) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "User Not Found"
            };
        }

        return {
            status: httpStatus.OK,
            message: `Role Updated to ${role}`,
            data: user
        };

    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error?.message || "Internal Server Error"
        };
    }
};

const createProject = async (body) => {
    try {
        const { title, description, projectCode, startDate, endDate, status, priority, createdBy, assignedTo } = body;
        const formattedStartDate = moment(startDate, "YYYY-MM-DD").toDate();
        const formattedEndDate = moment(endDate, "YYYY-MM-DD").toDate();

        const newproject = await Project.create({
            title,
            description,
            projectCode,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            status,
            priority,
            createdBy,
            assignedTo
        });
        return {
            status: httpStatus.OK,
            message: "Project Created Successfully",
            data: newproject
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error?.message || "Internal Server Error"
        }
    }
};

const updateProject = async (body) => {
    try {
        const { projectCode, update } = body;

        const project = await Project.findOneAndUpdate(
            { projectCode: projectCode },
            { $set: update },
            { new: true }
        );
        console.log("Project Updated", project);
        if (!project) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Project Not Found"
            }
        };
        return {
            status: httpStatus.OK,
            message: "Project Updated Successfully",
            data: project
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: error?.message || "Internal Server Error"
        }
    }
};

const getProject = async (params) => {
    try {
        const allProject = await Project.find();
        if (!allProject) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Project's Not Found"
            }
        }
        return {
            status: httpStatus.OK,
            message: "Project Fetch Successfully",
            data: allProject
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_GATEWAY,
            message: error?.message || "Internal Server Error"
        }
    }
};

const getProjectbyId = async (params) => {
    try {
        const allProject = await Project.findOne();
        if (!allProject) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Project Not Found"
            }
        }
        return {
            status: httpStatus.OK,
            message: "Project Fetch Successfully",
            data: allProject
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_GATEWAY,
            message: error?.message || "Internal Server Error"
        }
    }
};

const createTask = async (body) => {
    try {
        const { taskName, taskId, description, assignedBy, assignedTo, assigneeEmail, taskStatus, taskduration, taskDeadline, taskPriority } = body;

        const task = await Task.create({
            taskName,
            taskId,
            description,
            assignedBy,
            assignedTo,
            assigneeEmail,
            taskStatus,
            taskduration,
            taskDeadline,
            taskPriority
        });
        console.log("Task Created", task);
        if (!task) {
            return {
                status: httpStatus.NOT_FOUND,
                message: error?.message || "Task Not Created"
            }
        }
        return {
            status: httpStatus.OK,
            message: "Task Created Successfully",
            data: task
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_GATEWAY,
            message: error?.message || "Internal Server Error"
        }
    }
};

const updateTask = async (body) => {
    try {
        const { taskId, updateTask } = body;

        const task = await Task.findOneAndUpdate(
            { taskId: taskId },
            { $set: { updateTask } },
            { new: true }
        );
        console.log("Task Updated", task);
        if (!task) {
            return {
                status: httpStatus.NOT_FOUND,
                message: eror?.message || "Task Not Found"
            }
        };
        return {
            status: httpStatus.OK,
            message: "Task Updated Successfully",
            data: task
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_GATEWAY,
            message: error?.message || "Failed To update task"
        }
    }
};

const getTask = async () => {
    try {
        const allTask = await Task.find();
        if (!allTask) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Task Not Found"
            }
        };
        return {
            status: httpStatus.OK,
            message: "All Task Fetch Successfully",
            data: allTask
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_GATEWAY,
            message: "Failed to fetch tasks"
        }
    }
};

const getTaskbyId = async () => {
    try {
        const allTask = await Task.findOne();
        if (!allTask) {
            return {
                status: httpStatus.NOT_FOUND,
                message: "Task Not Found"
            }
        };
        return {
            status: httpStatus.OK,
            message: "Task Fetch Successfully",
            data: allTask
        }
    } catch (error) {
        console.error(error?.message || error);
        return {
            status: httpStatus.BAD_GATEWAY,
            message: "Failed to fetch task"
        }
    }
};

module.exports = {
    addUsers,
    getPendingUsers,
    approveUser,
    declineUser,
    assignRole,
    createProject,
    updateProject,
    getProject,
    getProjectbyId,
    createTask,
    updateTask,
    getTask,
    getTaskbyId
};
