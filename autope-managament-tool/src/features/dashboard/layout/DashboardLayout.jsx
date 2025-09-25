import { Layout as AntLayout, Menu, message } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { userLogout } from "../../../utils/UserLogin";
import { showLogoutConfirm } from "../../auth/components/LogoutConfirmModal";

const { Sider, Content } = AntLayout;

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userRole = localStorage.getItem("userRole");
  console.log("userRole", userRole);

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

  const handleTopClick = ({ key }) => {
    navigate(key);
  };

  const handleBottomClick = ({ key }) => {
    if (key === "logout") {
      showLogoutConfirm(async () => {
        try {
          const token = localStorage.getItem("token");
          const email = localStorage.getItem("userEmail");
          if (token && email) {
            const res = await userLogout(token, email);
            message.success(res.data?.message || "Logged out successfully");
          }
        } catch (err) {
          message.error(err.response?.data?.message || "Logout failed");
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
    <AntLayout style={{ height: "100vh", overflow: "hidden" }}>
      {/* Fixed Sidebar */}
      <Sider
        theme="dark"
        width={70}
        collapsed
        collapsedWidth={70}
        trigger={null}
        style={{ height: "100vh", position: "fixed", left: 0, top: 0 }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            onClick={handleTopClick}
            items={topItems}
            style={{ flex: 1, borderRight: 0 }}
          />
          <Menu
            mode="inline"
            selectable={false}
            onClick={handleBottomClick}
            items={bottomItems}
          />
        </div>
      </Sider>

      <AntLayout style={{ marginLeft: 70, height: "100vh" }}>
        <Content
          style={{
            padding: 20,
            height: "100%",
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default DashboardLayout;
