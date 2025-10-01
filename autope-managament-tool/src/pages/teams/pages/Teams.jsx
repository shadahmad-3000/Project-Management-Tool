import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { getTeams } from "../../../store/slices/teamSlice";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    setLoading(true);

    dispatch(getTeams())
      .unwrap()
      .then((data) => {
        setTeams(data || []);
        setFilteredTeams(data || []);
      })
      .catch((err) => {
        console.error("Error fetching teams:", err);
        alert(err || "Failed to fetch teams.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  const handleSearch = (val) => {
    const value = typeof val === "string" ? val : val.text;
    setSearchValue(value);

    const filtered = teams.filter(
      (team) =>
        team.name?.toLowerCase().includes(value.toLowerCase()) ||
        team.teamCode?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTeams(filtered);
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <h2 className="page-title">Teams</h2>

        <div className="page-actions">
          <div className="page-search">
            <FloatingLabelInput
              label="Search Teams"
              inputValue={searchValue}
              onChangeInputText={handleSearch}
            />
          </div>

          {(userRole === "Super-Admin" || userRole === "Admin") && (
            <CButton onClick={() => navigate("/home/teams/add")}>
              ＋ New Team
            </CButton>
          )}
        </div>
      </div>

      <div className="page-table">
        <table>
          <thead>
            <tr>
              <th>Team Name</th>
              <th>Team Code</th>
              <th>Members</th>
              <th>Created At</th>
              {(userRole === "Super-Admin" || userRole === "Admin") && (
                <th>Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <tr key={team._id}>
                  <td>{team.name}</td>
                  <td>{team.teamCode}</td>
                  <td>{team.teamMembers?.length || 0}</td>
                  <td>
                    {team.createdAt
                      ? new Date(team.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  {(userRole === "Super-Admin" || userRole === "Admin") && (
                    <td>
                      <CButton
                        variant="text"
                        onClick={() =>
                          navigate(`/home/teams/edit/${team.teamCode}`)
                        }
                      >
                        <EditOutlined />
                      </CButton>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No teams found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeamsPage;
