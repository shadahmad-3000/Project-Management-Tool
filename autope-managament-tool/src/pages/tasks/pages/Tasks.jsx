import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTask } from "../../../utils/superAdmin";
import dayjs from "dayjs";
import CButton from "../../../components/common/CButton";
import FloatingLabelInput from "../../../components/common/InputText/FloatingLabelInput";
import { EditOutlined } from "@ant-design/icons";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("No token found, please login.");
          return;
        }
        const res = await getTask(token);
        setTasks(res.data?.data || []);
        setFilteredTasks(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        alert(err.response?.data?.message || "Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleSearch = (val) => {
    const value = typeof val === "string" ? val : val.text;
    setSearchValue(value);

    const filtered = tasks.filter(
      (task) =>
        task.taskName?.toLowerCase().includes(value.toLowerCase()) ||
        task.taskId?.toLowerCase().includes(value.toLowerCase()) ||
        task.description?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  return (
    <div className="page-card">
      <div className="page-header">
        <h2 className="page-title">Tasks</h2>

        <div className="page-actions">
          <div className="page-search">
            <FloatingLabelInput
              label="Search Tasks"
              inputValue={searchValue}
              onChangeInputText={handleSearch}
            />
          </div>

          {(userRole === "Super-Admin" || userRole === "Admin") && (
            <CButton onClick={() => navigate("/home/tasks/add")}>
              ＋ New Task
            </CButton>
          )}
        </div>
      </div>

      <div className="page-table">
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Task ID</th>
              <th>Description</th>
              <th>Assignee Emails</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Duration (hrs)</th>
              {(userRole === "Super-Admin" || userRole === "Admin") && (
                <th>Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredTasks.length > 0 ? (
              filteredTasks.map((task) => {
                const start = task.taskDeadline?.startDate
                  ? dayjs(task.taskDeadline.startDate).format(
                      "YYYY-MM-DD HH:mm"
                    )
                  : "-";
                const end = task.taskDeadline?.endDate
                  ? dayjs(task.taskDeadline.endDate).format("YYYY-MM-DD HH:mm")
                  : "-";

                return (
                  <tr key={task._id}>
                    <td>{task.taskName}</td>
                    <td>{task.taskId}</td>
                    <td>{task.description}</td>
                    <td>
                      {task.assigneeEmail?.length
                        ? task.assigneeEmail.join(", ")
                        : "-"}
                    </td>
                    <td>
                      {start} → {end}
                    </td>
                    <td>{task.taskStatus}</td>
                    <td>{task.taskPriority}</td>
                    <td>{task.taskduration}</td>
                    {(userRole === "Super-Admin" || userRole === "Admin") && (
                      <td>
                        <CButton
                          variant="text"
                          onClick={() =>
                            navigate(`/home/tasks/edit/${task.taskId}`)
                          }
                        >
                          <EditOutlined />
                        </CButton>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksPage;
