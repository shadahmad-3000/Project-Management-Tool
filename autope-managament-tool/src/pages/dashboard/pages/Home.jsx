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
    <div className="home-layout">
      <aside className="home-sidebar">
        <ul className="menu vertical">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={`menu-item ${
                location.pathname === item.key ? "active" : ""
              }`}
              onClick={() => navigate(item.key)}
            >
              {item.icon}
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className="home-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Home;
