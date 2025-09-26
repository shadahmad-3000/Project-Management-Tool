import React from "react";
import { Card, Button, List } from "antd";

const Dashboard = () => {
  const tasks = [
    { title: "Bug Fixes", status: "Completed" },
    { title: "MJQR topup popup", status: "In Progress" },
    { title: "Autope Management tool Dashboard", status: "Pending" },
  ];

  return (
    <div>
      <h1>Welcome to Dashboard!</h1>

      <div>
        <Card styles={{ body: { padding: "16px" } }}>
          <p>Total Tasks Assigned:</p>
          <p>9</p>
        </Card>
        <Card styles={{ body: { padding: "16px" } }}>
          <p>Pending Tasks:</p>
          <p>4</p>
        </Card>
        <Card styles={{ body: { padding: "16px" } }}>
          <p>Tasks Completed:</p>
          <p>5</p>
        </Card>
      </div>

      <Card
        title={<span>Recent Tasks</span>}
        extra={<Button type="primary">+ New Task</Button>}
      >
        <List
          dataSource={tasks}
          renderItem={(item) => (
            <List.Item>
              <div>
                <p>{item.title}</p>
                <p>
                  Status: <span>{item.status}</span>
                </p>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default Dashboard;
