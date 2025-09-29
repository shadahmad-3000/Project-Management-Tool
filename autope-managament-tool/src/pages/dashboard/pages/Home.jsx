import React from "react";
import {
  ProjectOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: "/home/projects", icon: <ProjectOutlined />, label: "Projects" },
    { key: "/home/tasks", icon: <ScheduleOutlined />, label: "Tasks" },
    { key: "/home/teams", icon: <TeamOutlined />, label: "Teams" },
    { key: "/home/users", icon: <UserOutlined />, label: "Users" },
  ];

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <div
        className="bg-dark text-white d-flex flex-column"
        style={{
          width: "200px",
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={`nav-item py-3 px-3 d-flex align-items-center ${
                location.pathname === item.key ? "bg-secondary" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(item.key)}
            >
              {item.icon}
              <span style={{ marginLeft: "10px" }}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div
        style={{
          marginLeft: "200px",
          flex: 1,
          padding: "20px",
          background: "#000",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
