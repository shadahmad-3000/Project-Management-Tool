import React, { useState, useEffect } from "react";
import { createTask, getTaskById, updateTask } from "../../../utils/superAdmin";
import { getTeams } from "../../../utils/team";
import { getUsers } from "../../../utils/User";
import dayjs from "dayjs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";

const AddEditTask = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const navigate = useNavigate();
  const { taskId } = useParams();
  const location = useLocation();
  const isEditMode = location.pathname.includes("edit");

  const [taskName, setTaskName] = useState("");
  const [taskCode, setTaskCode] = useState(taskId || "");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [assigneeEmail, setAssigneeEmail] = useState([]);
  const [taskDeadlineStart, setTaskDeadlineStart] = useState("");
  const [taskDeadlineEnd, setTaskDeadlineEnd] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [taskDuration, setTaskDuration] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await getTeams(token);
        setTeams(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
        alert("Failed to fetch teams");
      }
    };
    fetchTeams();
  }, []);

  useEffect(() => {
    if (isEditMode && taskId) {
      setInitialLoading(true);
      const fetchTask = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await getTaskById(taskId, token);
          const task = res.data?.data;

          setTaskName(task.taskName || "");
          setTaskCode(task.taskId || "");
          setDescription(task.description || "");
          setAssignedTo(task.assignedTo || []);
          setAssigneeEmail(task.assigneeEmail || []);
          setTaskDeadlineStart(
            task.taskDeadline?.startDate
              ? dayjs(task.taskDeadline.startDate).format("YYYY-MM-DDTHH:mm")
              : ""
          );
          setTaskDeadlineEnd(
            task.taskDeadline?.endDate
              ? dayjs(task.taskDeadline.endDate).format("YYYY-MM-DDTHH:mm")
              : ""
          );
          setTaskStatus(task.taskStatus || "");
          setTaskDuration(task.taskDuration || "");
          setTaskPriority(task.taskPriority || "");
        } catch (err) {
          alert("Failed to load task details");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchTask();
    }
  }, [isEditMode, taskId]);

  const handleSubmit = async () => {
    if (!taskName || !taskCode || !description || !taskDuration) {
      setShowErrors(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        taskName,
        taskId: taskCode,
        description,
        assignedTo,
        assigneeEmail,
        taskDeadline: {
          startDate: taskDeadlineStart || null,
          endDate: taskDeadlineEnd || null,
        },
        taskStatus,
        taskDuration,
        taskPriority,
        assignedBy: localStorage.getItem("userId"),
      };

      if (isEditMode) {
        const { taskId: code, ...rest } = payload;
        await updateTask({ taskId: code, updateTask: rest }, token);
        alert("Task updated successfully!");
      } else {
        await createTask(payload, token);
        alert("Task created successfully!");
      }

      navigate("/home/tasks");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-light" role="status"></div>
      </div>
    );
  }

  return (
    <div
      className="card p-4"
      style={{
        backgroundColor: "#1f1f1f",
        color: "#f5f5f5",
        borderRadius: "10px",
      }}
    >
      <CButton onClick={() => navigate(-1)} variant="text">
        <ArrowLeftOutlined style={{ marginRight: 6 }} /> Back
      </CButton>

      <h2 className="my-3">{isEditMode ? "Edit Task" : "Create Task"}</h2>

      <FloatingLabelInput
        label="Task Name"
        inputValue={taskName}
        onChangeInputText={(val) =>
          setTaskName(typeof val === "string" ? val : val.text)
        }
      />
      {!taskName && showErrors && (
        <p className="text-danger">Task name is required</p>
      )}

      <FloatingLabelInput
        label="Task ID"
        inputValue={taskCode}
        disabled={isEditMode}
        onChangeInputText={(val) =>
          setTaskCode(typeof val === "string" ? val : val.text)
        }
      />
      {!taskCode && showErrors && (
        <p className="text-danger">Task ID is required</p>
      )}

      <FloatingLabelInput
        label="Description"
        inputValue={description}
        onChangeInputText={(val) =>
          setDescription(typeof val === "string" ? val : val.text)
        }
      />
      {!description && showErrors && (
        <p className="text-danger">Description is required</p>
      )}

      <div className="mb-3">
        <label className="form-label">Assign To Team</label>
        <select
          multiple
          className="form-select"
          value={assignedTo}
          onChange={(e) =>
            setAssignedTo(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {teams.length > 0 ? (
            teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name} ({team.teamCode})
              </option>
            ))
          ) : (
            <option disabled>No teams available</option>
          )}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Assignee Emails</label>
        <select
          multiple
          className="form-select"
          value={assigneeEmail}
          onChange={(e) =>
            setAssigneeEmail(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {users.map((user) => (
            <option key={user.email} value={user.email}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
      </div>

      <div className="row my-3">
        <div className="col">
          <label className="form-label">Start Date</label>
          <input
            type="datetime-local"
            className="form-control"
            value={taskDeadlineStart}
            onChange={(e) => setTaskDeadlineStart(e.target.value)}
          />
        </div>
        <div className="col">
          <label className="form-label">End Date</label>
          <input
            type="datetime-local"
            className="form-control"
            value={taskDeadlineEnd}
            onChange={(e) => setTaskDeadlineEnd(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Task Status</label>
        <select
          className="form-select"
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="">Select status</option>
          <option value="Not Started">Not Started</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      <FloatingLabelInput
        label="Duration (in hours)"
        inputValue={taskDuration}
        keyboardType="number-pad"
        onChangeInputText={(val) =>
          setTaskDuration(typeof val === "string" ? val : val.text)
        }
      />
      {!taskDuration && showErrors && (
        <p className="text-danger">Task duration is required</p>
      )}

      <div className="mb-3">
        <label className="form-label">Priority</label>
        <select
          className="form-select"
          value={taskPriority}
          onChange={(e) => setTaskPriority(e.target.value)}
        >
          <option value="">Select priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <CButton
        onClick={handleSubmit}
        loading={loading}
        style={{ width: "100%" }}
      >
        {isEditMode ? "Update Task" : "Create Task"}
      </CButton>
    </div>
  );
};

export default AddEditTask;
