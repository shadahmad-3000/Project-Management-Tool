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

  const bottomItems = [
    { key: "logout", icon: <LogoutOutlined />, label: "Logout" },
  ];

  const handleTopClick = (key) => {
    navigate(key);
  };

  const handleBottomClick = (key) => {
    if (key === "logout") {
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
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("userRole");
          navigate("/signin");
        }
      });
    }
  };

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
      <div
        className="d-flex flex-column justify-content-between bg-dark text-white"
        style={{
          width: "70px",
          position: "fixed",
          top: "80px",
          bottom: 0,
          left: 0,
        }}
      >
        <ul className="nav flex-column text-center">
          {topItems.map((item) => (
            <li
              key={item.key}
              className={`nav-item py-3 ${
                location.pathname === item.key ? "bg-secondary" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => handleTopClick(item.key)}
            >
              {item.icon}
              <div style={{ fontSize: "10px" }}>{item.label}</div>
            </li>
          ))}
        </ul>

        <ul className="nav flex-column text-center border-top">
          {bottomItems.map((item) => (
            <li
              key={item.key}
              className="nav-item py-3"
              style={{ cursor: "pointer" }}
              onClick={() => handleBottomClick(item.key)}
            >
              {item.icon}
              <div style={{ fontSize: "10px" }}>{item.label}</div>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginLeft: "70px", flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
