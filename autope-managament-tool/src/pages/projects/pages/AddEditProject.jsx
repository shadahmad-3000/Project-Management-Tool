import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";
import { useDispatch } from "react-redux";
import {
  getProjectById,
  updateProject,
  createProject,
} from "../../../store/slices/SuperAdminSlice";
import { getTeams } from "../../../store/slices/teamSlice";

const AddEditProject = () => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const navigate = useNavigate();
  const { projectCode } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const isEditMode = location.pathname.includes("edit");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectCodeInput, setProjectCodeInput] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    dispatch(getTeams())
      .unwrap()
      .then((data) => {
        setTeams(data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch teams:", err);
      });
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && projectCode) {
      setInitialLoading(true);

      dispatch(getProjectById(projectCode))
        .unwrap()
        .then((project) => {
          setTitle(project.title || "");
          setDescription(project.description || "");
          setProjectCodeInput(project.projectCode || "");
          setStartDate(
            project.startDate
              ? dayjs(project.startDate).format("YYYY-MM-DD")
              : ""
          );
          setEndDate(
            project.endDate ? dayjs(project.endDate).format("YYYY-MM-DD") : ""
          );
          setStatus(project.status || "");
          setPriority(project.priority || "");
          setAssignedTo(project.assignedTo || []);
        })
        .catch((err) => {
          console.error("Failed to load project details:", err);
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  }, [isEditMode, projectCode, dispatch]);

  const handleSubmit = () => {
    if (!title || !projectCodeInput) {
      setShowErrors(true);
      return;
    }

    setLoading(true);

    if (isEditMode) {
      const updateData = {
        ...(title && { title }),
        ...(description && { description }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(assignedTo.length && { assignedTo }),
      };

      const payload = { projectCode, update: updateData };

      dispatch(updateProject(payload))
        .unwrap()
        .then(() => {
          alert("Project updated successfully!");
          navigate("/home/projects");
        })
        .catch(() => {
          alert("Failed to update project");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      const payload = {
        title,
        description,
        projectCode: projectCodeInput,
        startDate: startDate || null,
        endDate: endDate || null,
        status: status || "Not Started",
        priority: priority || "Medium",
        assignedTo,
        createdBy: localStorage.getItem("userId"),
      };

      dispatch(createProject(payload))
        .unwrap()
        .then(() => {
          alert("Project created successfully!");
          navigate("/home/projects");
        })
        .catch(() => {
          alert("Failed to create project");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  if (initialLoading) {
    return (
      <div className="form-card">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="form-card">
      <div className="form-header">
        <CButton onClick={() => navigate(-1)} variant="text">
          <ArrowLeftOutlined style={{ marginRight: 6 }} /> Back
        </CButton>
        <h2 className="form-title">
          {isEditMode ? "Edit Project" : "Create Project"}
        </h2>
      </div>

      <div className="form-group">
        <FloatingLabelInput
          label="Title"
          inputValue={title}
          onChangeInputText={(val) =>
            setTitle(typeof val === "string" ? val : val.text)
          }
        />
        {!title && showErrors && (
          <p className="form-error">Title is required</p>
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
      </div>

      <div className="form-group">
        <FloatingLabelInput
          label="Project Code"
          inputValue={projectCodeInput}
          onChangeInputText={(val) =>
            setProjectCodeInput(typeof val === "string" ? val : val.text)
          }
        />
        {!projectCodeInput && showErrors && (
          <p className="form-error">Code is required</p>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            className="form-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            className="form-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Status</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">Select status</option>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      <div className="form-group">
        <label>Priority</label>
        <select
          className="form-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Select priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
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

      <CButton
        onClick={handleSubmit}
        loading={loading}
        style={{ width: "100%" }}
      >
        {isEditMode ? "Update Project" : "Create Project"}
      </CButton>
    </div>
  );
};

export default AddEditProject;
