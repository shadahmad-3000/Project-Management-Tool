import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Signin from "../features/auth/pages/Signin";
import Signup from "../features/auth/pages/Signup";
import DashboardLayout from "../features/dashboard/layout/DashboardLayout";
import Home from "../features/dashboard/pages/Home";
import Dashboard from "../features/dashboard/pages/Dashboard";
import ApproveUsers from "../superAdmin/ApproveUsers";
import VerifyOtp from "../features/auth/pages/VerifyOtp";
import AddEditTeam from "../features/teams/pages/AddEditTeam";
import ProjectsPage from "../features/projects/pages/Projects";
import TasksPage from "../features/tasks/pages/Tasks";
import TeamsPage from "../features/teams/pages/Teams";
import UsersPage from "../features/users/pages/Users";
import AddEditUser from "../features/users/pages/AddEditUser";
import AddEditProject from "../features/projects/pages/AddEditProject";
import AddEditTask from "../features/tasks/pages/AddEditTask";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" replace />} />

      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route element={<DashboardLayout />}>
        <Route path="/home" element={<Home />}>
          <Route
            index
            element={
              <h2 style={{ color: "#f5f5f5" }}>
                Welcome to Home! Select an option from the sidebar.
              </h2>
            }
          />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/add" element={<AddEditProject />} />
          <Route
            path="projects/edit/:projectCode"
            element={<AddEditProject />}
          />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="tasks/add" element={<AddEditTask />} />
          <Route path="tasks/edit/:taskId" element={<AddEditTask />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="teams/add" element={<AddEditTeam />} />
          <Route path="teams/edit/:teamCode" element={<AddEditTeam />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="users/add" element={<AddEditUser />} />
          <Route path="users/edit/:empID" element={<AddEditUser />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/super-admin/approvals" element={<ApproveUsers />} />
      </Route>

      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
};

export default AppRoutes;
