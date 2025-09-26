import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../pages/auth/authSlice";
import taskReducer from "../pages/tasks/taskSlice";
import projectReducer from "../pages/projects/projectSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    projects: projectReducer,
  },
});

export default store;
