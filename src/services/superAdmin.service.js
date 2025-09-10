const ApiError = require("../utils/apiError");
const moment = require("moment");
const { status: httpStatus } = require("http-status");
const { User, Project, Task } = require("../models");
const { required } = require("joi");

const addUsers = async (body) => {
    try {
        const { name, email, password, empID, designation, phoneNo, department } = body;

        const user = await User.create({
            name,
            email,
            password,
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
}
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

const createTask = async (body) => {
    try {
        const { taskName, taskId, description, assignedBy, assignedTo, taskStatus, taskduration, taskPriority } = body;

        const task = await Task.create({
            taskName,
            taskId,
            description,
            assignedBy,
            assignedTo,
            taskStatus,
            taskduration,
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
            return{
                status: httpStatus.NOT_FOUND,
                message:eror?.message || "Task Not Found"
            }
        };
        return{
            status: httpStatus.OK,
            message:"Task Updated Successfully",
            data: task
        }
    } catch (error) {
        console.error(error?.message || error);
        return{
            status: httpStatus.BAD_GATEWAY,
            message: error?.message || "Failed To update task"
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
    createTask,
    updateTask
};
