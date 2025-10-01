import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { getUsers } from "../../../store/slices/userSlice";
import {
  createTeam,
  updateTeam,
  getTeamById,
} from "../../../store/slices/teamSlice";
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
  const dispatch = useDispatch();

  const isEditMode = location.pathname.includes("edit");

  useEffect(() => {
    dispatch(getUsers())
      .unwrap()
      .then((data) => {
        setUsers(data || []);
      })
      .catch(() => {
        alert("Failed to fetch users");
      });
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && teamCode) {
      setInitialLoading(true);

      dispatch(getTeamById(teamCode))
        .unwrap()
        .then((team) => {
          setName(team.name || "");
          setTeamCodeInput(team.teamCode || "");
          setTeamMembers(
            team.teamMembers?.map((m) => (typeof m === "object" ? m._id : m)) ||
              []
          );
        })
        .catch(() => {
          alert("Failed to load team details");
        })
        .finally(() => {
          setInitialLoading(false);
        });
    }
  }, [isEditMode, teamCode, dispatch]);

  const handleSubmit = () => {
    if (!name || !teamCodeInput || teamMembers.length === 0) {
      setShowErrors(true);
      return;
    }

    setLoading(true);

    const payload = {
      name,
      teamCode: teamCodeInput,
      teamMembers,
    };

    const action = isEditMode
      ? updateTeam({ teamCode, updateData: payload })
      : createTeam(payload);

    dispatch(action)
      .unwrap()
      .then(() => {
        alert(
          isEditMode
            ? "Team updated successfully!"
            : "Team created successfully!"
        );
        navigate("/home/teams");
      })
      .catch(() => {
        alert("Failed to save team");
      })
      .finally(() => {
        setLoading(false);
      });
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
          {isEditMode ? "Edit Team" : "Create Team"}
        </h2>
      </div>

      <div className="form-group">
        <FloatingLabelInput
          label="Team Name"
          inputValue={name}
          onChangeInputText={(val) =>
            setName(typeof val === "string" ? val : val.text)
          }
        />
        {!name && showErrors && (
          <p className="form-error">Team Name is required</p>
        )}
      </div>

      <div className="form-group">
        <FloatingLabelInput
          label="Team Code"
          inputValue={teamCodeInput}
          disabled={isEditMode}
          onChangeInputText={(val) =>
            setTeamCodeInput(typeof val === "string" ? val : val.text)
          }
        />
        {!teamCodeInput && showErrors && (
          <p className="form-error">Team Code is required</p>
        )}
      </div>

      <div className="form-group">
        <label>Team Members</label>
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
          <p className="form-error">Select at least one member</p>
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
