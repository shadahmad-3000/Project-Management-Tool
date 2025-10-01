import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";
import { EditOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { getProject } from "../../../store/slices/SuperAdminSlice";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    setLoading(true);

    dispatch(getProject())
      .unwrap()
      .then((data) => {
        setProjects(data || []);
        setFilteredProjects(data || []);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        alert(err || "Failed to fetch projects.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

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
    <div className="page-card">
      <div className="page-header">
        <h2 className="page-title">Projects</h2>

        <div className="page-actions">
          <div className="page-search">
            <FloatingLabelInput
              label="Search Projects"
              inputValue={searchValue}
              onChangeInputText={handleSearch}
            />
          </div>
          {(userRole === "Super-Admin" || userRole === "Admin") && (
            <CButton onClick={() => navigate("/home/projects/add")}>
              ＋ New Project
            </CButton>
          )}
        </div>
      </div>

      <div className="page-table">
        <table>
          <thead>
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
                        <EditOutlined />
                        Edit
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
