import { Layout, Menu } from "antd";
import {
  ProjectOutlined,
  ScheduleOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      {/* Fixed Sidebar */}
      <Sider
        width={200}
        theme="dark"
        style={{ height: "100vh", position: "fixed" }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(e) => navigate(e.key)}
        >
          <Menu.Item key="/home/projects" icon={<ProjectOutlined />}>
            Projects
          </Menu.Item>
          <Menu.Item key="/home/tasks" icon={<ScheduleOutlined />}>
            Tasks
          </Menu.Item>
          <Menu.Item key="/home/teams" icon={<TeamOutlined />}>
            Teams
          </Menu.Item>
          <Menu.Item key="/home/users" icon={<UserOutlined />}>
            Users
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Content shifted right */}
      <Layout style={{ marginLeft: 200, height: "100vh" }}>
        <Content
          style={{
            padding: "20px",
            background: "#000",
            height: "100%",
            overflowY: "auto", // 👈 only this scrolls
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
