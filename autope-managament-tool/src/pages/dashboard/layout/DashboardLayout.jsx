import React from "react";
import {
  HomeOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { showLogoutConfirm } from "../../auth/components/LogoutConfirmModal";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/slices/authSlice";

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    showLogoutConfirm(() => {
      const email = localStorage.getItem("userEmail");

      if (email) {
        dispatch(logout({ email }))
          .unwrap()
          .then((response) => {
            alert(response?.message || "Logged out successfully");
            localStorage.clear();
            navigate("/signin");
          })
          .catch((err) => {
            if (err.includes("Unauthorized") || err.includes("invalid token")) {
              // Token is already bad → clear and force logout
              localStorage.clear();
              navigate("/signin");
            } else {
              // Some other error (server down, timeout, etc.)
              alert(err || "Logout failed. Please try again.");
            }
          });
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
