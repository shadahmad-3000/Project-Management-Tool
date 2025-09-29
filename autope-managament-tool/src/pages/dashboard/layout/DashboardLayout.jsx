import React from "react";
import {
  HomeOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { userLogout } from "../../../utils/UserLogin";
import { showLogoutConfirm } from "../../auth/components/LogoutConfirmModal";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");

  const topItems = [
    { key: "/home", icon: <HomeOutlined />, label: "Home" },
    { key: "/dashboard", icon: <AppstoreOutlined />, label: "Dashboard" },
  ];

  if (userRole === "Super-Admin" || userRole === "Admin") {
    topItems.push({
      key: "/super-admin/approvals",
      icon: <UserSwitchOutlined />,
      label: "Approvals",
    });
  }

  const handleTopClick = (key) => navigate(key);

  const handleLogout = () => {
    showLogoutConfirm(async () => {
      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("userEmail");
        if (token && email) {
          const res = await userLogout(token, email);
          alert(res.data?.message || "Logged out successfully");
        }
      } catch (err) {
        alert(err.response?.data?.message || "Logout failed");
      } finally {
        localStorage.clear();
        navigate("/signin");
      }
    });
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <ul className="menu vertical">
          {topItems.map((item) => (
            <li
              key={item.key}
              className={`menu-item ${
                location.pathname === item.key ? "active" : ""
              }`}
              onClick={() => handleTopClick(item.key)}
            >
              {item.icon}
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>

        <ul className="menu vertical bottom">
          <li className="menu-item" onClick={handleLogout}>
            <LogoutOutlined />
            <span className="label">Logout</span>
          </li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
