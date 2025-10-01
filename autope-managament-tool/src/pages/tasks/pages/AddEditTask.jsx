import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";
import { useDispatch } from "react-redux";
import {
  getTaskById,
  updateTask,
  createTask,
} from "../../../store/slices/SuperAdminSlice";
import { getTeams } from "../../../store/slices/teamSlice";
import { getUsers } from "../../../store/slices/userSlice";

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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers())
      .unwrap()
      .then((data) => setUsers(data || []))
      .catch(() => alert("Failed to fetch users"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTeams())
      .unwrap()
      .then((data) => setTeams(data || []))
      .catch(() => alert("Failed to fetch teams"));
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && taskId) {
      setInitialLoading(true);

      dispatch(getTaskById(taskId))
        .unwrap()
        .then((task) => {
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
        })
        .catch(() => alert("Failed to load task details"))
        .finally(() => setInitialLoading(false));
    }
  }, [isEditMode, taskId, dispatch]);

  const handleSubmit = () => {
    if (!taskName || !taskCode || !description || !taskDuration) {
      setShowErrors(true);
      return;
    }

    setLoading(true);

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

      dispatch(updateTask({ taskId: code, updateTask: rest }))
        .unwrap()
        .then(() => {
          alert("Task updated successfully!");
          navigate("/home/tasks");
        })
        .catch(() => alert("Failed to update task"))
        .finally(() => setLoading(false));
    } else {
      dispatch(createTask(payload))
        .unwrap()
        .then(() => {
          alert("Task created successfully!");
          navigate("/home/tasks");
        })
        .catch(() => alert("Failed to create task"))
        .finally(() => setLoading(false));
    }
  };

  if (initialLoading) {
    return <div className="form-card">Loading...</div>;
  }

  return (
    <div className="form-card">
      <div className="form-header">
        <CButton onClick={() => navigate(-1)} variant="text">
          <ArrowLeftOutlined style={{ marginRight: 6 }} /> Back
        </CButton>
        <h2 className="form-title">
          {isEditMode ? "Edit Task" : "Create Task"}
        </h2>
      </div>

      <div className="form-group">
        <FloatingLabelInput
          label="Task Name"
          inputValue={taskName}
          onChangeInputText={(val) =>
            setTaskName(typeof val === "string" ? val : val.text)
          }
        />
        {!taskName && showErrors && (
          <p className="form-error">Task name is required</p>
        )}
      </div>

      <div className="form-group">
        <FloatingLabelInput
          label="Task ID"
          inputValue={taskCode}
          disabled={isEditMode}
          onChangeInputText={(val) =>
            setTaskCode(typeof val === "string" ? val : val.text)
          }
        />
        {!taskCode && showErrors && (
          <p className="form-error">Task ID is required</p>
        )}
      </div>

      <div className="form-group">
        <FloatingLabelInput
          label="Description"
          inputValue={description}
          onChangeInputText={(val) =>
            setDescription(typeof val === "string" ? val : val.text)
          }
        />
        {!description && showErrors && (
          <p className="form-error">Description is required</p>
        )}
      </div>

      <div className="form-group">
        <label>Assign To Team</label>
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

      <div className="form-group">
        <label>Assignee Emails</label>
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

      <div className="form-row">
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="datetime-local"
            className="form-input"
            value={taskDeadlineStart}
            onChange={(e) => setTaskDeadlineStart(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input
            type="datetime-local"
            className="form-input"
            value={taskDeadlineEnd}
            onChange={(e) => setTaskDeadlineEnd(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Task Status</label>
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

      <div className="form-group">
        <FloatingLabelInput
          label="Duration (in hours)"
          inputValue={taskDuration}
          keyboardType="number-pad"
          onChangeInputText={(val) =>
            setTaskDuration(typeof val === "string" ? val : val.text)
          }
        />
        {!taskDuration && showErrors && (
          <p className="form-error">Task duration is required</p>
        )}
      </div>

      <div className="form-group">
        <label>Priority</label>
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
