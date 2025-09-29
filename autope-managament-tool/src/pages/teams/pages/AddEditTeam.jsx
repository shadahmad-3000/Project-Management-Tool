import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getUsers } from "../../../utils/User";
import { createTeam, updateTeam, getTeamById } from "../../../utils/team";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";

const AddEditTeam = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const [name, setName] = useState("");
  const [teamCodeInput, setTeamCodeInput] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [showErrors, setShowErrors] = useState(false);

  const navigate = useNavigate();
  const { teamCode } = useParams();
  const location = useLocation();
  const isEditMode = location.pathname.includes("edit");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getUsers(token);
        setUsers(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
        alert("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (isEditMode && teamCode) {
      setInitialLoading(true);
      const fetchTeam = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await getTeamById(teamCode, token);
          const team = res.data?.data;

          setName(team.name || "");
          setTeamCodeInput(team.teamCode || "");
          setTeamMembers(
            team.teamMembers?.map((m) => (typeof m === "object" ? m._id : m)) ||
              []
          );
        } catch (err) {
          console.error("Failed to load team details", err);
          alert("Failed to load team details");
        } finally {
          setInitialLoading(false);
        }
      };
      fetchTeam();
    }
  }, [isEditMode, teamCode]);

  const handleSubmit = async () => {
    if (!name || !teamCodeInput || teamMembers.length === 0) {
      setShowErrors(true);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name,
        teamCode: teamCodeInput,
        teamMembers,
      };

      if (isEditMode) {
        await updateTeam({ teamCode, updateData: payload }, token);
        alert("Team updated successfully!");
      } else {
        await createTeam(payload, token);
        alert("Team created successfully!");
      }

      navigate("/home/teams");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save team");
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
        <ArrowLeftOutlined style={{ marginRight: 6 }} />
        Back
      </CButton>

      <h2 className="my-3">{isEditMode ? "Edit Team" : "Create Team"}</h2>

      <FloatingLabelInput
        label="Team Name"
        inputValue={name}
        onChangeInputText={(val) =>
          setName(typeof val === "string" ? val : val.text)
        }
      />
      {!name && showErrors && (
        <p className="text-danger">Team Name is required</p>
      )}

      <FloatingLabelInput
        label="Team Code"
        inputValue={teamCodeInput}
        disabled={isEditMode}
        onChangeInputText={(val) =>
          setTeamCodeInput(typeof val === "string" ? val : val.text)
        }
      />
      {!teamCodeInput && showErrors && (
        <p className="text-danger">Team Code is required</p>
      )}

      <div className="mb-3">
        <label className="form-label">Team Members</label>
        <select
          multiple
          className="form-select"
          value={teamMembers}
          onChange={(e) =>
            setTeamMembers(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
        >
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        {teamMembers.length === 0 && showErrors && (
          <p className="text-danger">Select at least one member</p>
        )}
      </div>

      <CButton
        onClick={handleSubmit}
        loading={loading}
        style={{ width: "100%" }}
      >
        {isEditMode ? "Update Team" : "Create Team"}
      </CButton>
    </div>
  );
};

export default AddEditTeam;
