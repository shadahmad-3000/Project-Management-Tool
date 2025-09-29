import React, { useEffect, useState } from "react";
import { getProject } from "../../../utils/superAdmin";
import { useNavigate } from "react-router-dom";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    const fetchProjects = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No token found, please login.");
          return;
        }

        const res = await getProject(token);
        const data = res.data?.data || [];

        setProjects(data);
        setFilteredProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        alert(err.response?.data?.message || "Failed to fetch projects.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSearch = (val) => {
    const value = typeof val === "string" ? val : val.text;
    setSearchValue(value);

    const filtered = projects.filter(
      (project) =>
        project.title?.toLowerCase().includes(value.toLowerCase()) ||
        project.projectCode?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  return (
    <div
      className="card shadow-sm"
      style={{
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        minHeight: "90vh",
        padding: "20px",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0 text-dark">Projects</h2>

        <div className="d-flex align-items-center gap-2">
          <div style={{ width: "250px" }}>
            <FloatingLabelInput
              label="Search Projects"
              inputValue={searchValue}
              onChangeInputText={handleSearch}
            />
          </div>
          {(userRole === "Super-Admin" || userRole === "Admin") && (
            <CButton onClick={() => navigate("/home/projects/add")}>
              <span style={{ marginRight: "8px" }}>＋</span>
              New Project
            </CButton>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Project Title</th>
              <th>Project Code</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Start Date</th>
              <th>End Date</th>
              {(userRole === "Super-Admin" || userRole === "Admin") && (
                <th>Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <tr key={project._id}>
                  <td>{project.title}</td>
                  <td>{project.projectCode}</td>
                  <td>{project.status}</td>
                  <td>{project.priority}</td>
                  <td>
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : "-"}
                  </td>
                  {(userRole === "Super-Admin" || userRole === "Admin") && (
                    <td>
                      <CButton
                        variant="text"
                        onClick={() =>
                          navigate(`/home/projects/edit/${project.projectCode}`)
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
                <td colSpan="7" className="text-center">
                  No projects found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectsPage;
