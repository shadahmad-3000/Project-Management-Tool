import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Signin from "../pages/auth/pages/Signin";
import DashboardLayout from "../pages/dashboard/layout/DashboardLayout";
import Home from "../pages/dashboard/pages/Home";
import Dashboard from "../pages/dashboard/pages/Dashboard";
import ApproveUsers from "../superAdmin/ApproveUsers";
import VerifyOtp from "../pages/auth/pages/VerifyOtp";
import AddEditTeam from "../pages/teams/pages/AddEditTeam";
import ProjectsPage from "../pages/projects/pages/Projects";
import TasksPage from "../pages/tasks/pages/Tasks";
import TeamsPage from "../pages/teams/pages/Teams";
import UsersPage from "../pages/users/pages/Users";
import AddEditUser from "../pages/users/pages/AddEditUser";
import AddEditProject from "../pages/projects/pages/AddEditProject";
import AddEditTask from "../pages/tasks/pages/AddEditTask";
import ChangePassword from "../pages/auth/pages/ChangePassword";
import Navbar from "../components/layout/Navbar";
import ForgotPassword from "../pages/auth/pages/ForgetPassword";
import ResetPassword from "../pages/auth/pages/ResetPassword";

const AppRoutes = () => {
  return (
    <>
      <Navbar />

      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Navigate to="/signin" replace />} />

          <Route path="/signin" element={<Signin />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

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
      </div>
    </>
  );
};

export default AppRoutes;
