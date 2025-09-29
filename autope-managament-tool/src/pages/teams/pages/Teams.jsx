import React, { useEffect, useState } from "react";
import { getTeams } from "../../../utils/team";
import { useNavigate } from "react-router-dom";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    const fetchTeams = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No token found, please login.");
          return;
        }

        const res = await getTeams(token);
        setTeams(res.data?.data || []);
        setFilteredTeams(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
        alert(err.response?.data?.message || "Failed to fetch teams.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

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
    <div
      className="card shadow-sm"
      style={{
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "20px",
        minHeight: "90vh",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Teams</h2>

        <div className="d-flex align-items-center gap-2">
          <div style={{ width: "250px" }}>
            <FloatingLabelInput
              label="Search Teams"
              inputValue={searchValue}
              onChangeInputText={handleSearch}
            />
          </div>

          {(userRole === "Super-Admin" || userRole === "Admin") && (
            <CButton onClick={() => navigate("/home/teams/add")}>
              <span style={{ marginRight: "8px" }}>＋</span>
              New Team
            </CButton>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
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
                        ✏️
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
