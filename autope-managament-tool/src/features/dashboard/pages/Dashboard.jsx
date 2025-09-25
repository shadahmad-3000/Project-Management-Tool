import React from "react";
import { Card, Button, List } from "antd";

const Dashboard = () => {
  const tasks = [
    { title: "Bug Fixes", status: "Completed" },
    { title: "MJQR topup popup", status: "In Progress" },
    { title: "Autope Management tool Dashboard", status: "Pending" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 text-gray-800 p-8">
      <h1 className="text-3xl font-extrabold mb-8 text-blue-700">
        Welcome to Dashboard!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          className="shadow-lg border border-gray-200 rounded-xl"
          styles={{ body: { padding: "16px" } }}
        >
          <p className="text-lg text-gray-600">Total Tasks Assigned:</p>
          <p className="text-3xl font-bold text-blue-600">9</p>
        </Card>
        <Card
          className="shadow-lg border border-gray-200 rounded-xl"
          styles={{ body: { padding: "16px" } }}
        >
          <p className="text-lg text-gray-600">Pending Tasks:</p>
          <p className="text-3xl font-bold text-yellow-600">4</p>
        </Card>
        <Card
          className="shadow-lg border border-gray-200 rounded-xl"
          styles={{ body: { padding: "16px" } }}
        >
          <p className="text-lg text-gray-600">Tasks Completed:</p>
          <p className="text-3xl font-bold text-green-600">5</p>
        </Card>
      </div>

      {/* Recent Tasks */}
      <Card
        title={
          <span className="text-blue-700 font-semibold">Recent Tasks</span>
        }
        className="shadow-lg border border-gray-200 rounded-xl"
        extra={
          <Button
            type="primary"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-500 rounded-lg shadow-md"
          >
            + New Task
          </Button>
        }
      >
        <List
          dataSource={tasks}
          renderItem={(item) => (
            <List.Item className="border-b border-gray-200 last:border-none px-4 py-3">
              <div>
                <p className="text-lg font-semibold text-gray-800">
                  {item.title}
                </p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={
                      item.status === "Completed"
                        ? "text-green-600 font-medium"
                        : item.status === "In Progress"
                        ? "text-yellow-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {item.status}
                  </span>
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
