import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  putRequest,
  deleteRequest,
} from "../../utils/api";
import { apiPaths } from "../../utils/apiPaths";
import { ACCESS_TOKEN } from "../../utils/constants";

export const addUsers = createAsyncThunk(
  "SuperAdmin/addUsers",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postRequest(apiPaths.addUsers, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add user"
      );
    }
  }
);

export const getPendingUsers = createAsyncThunk(
  "SuperAdmin/getPendingUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(apiPaths.getPendingUsers);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending users"
      );
    }
  }
);

export const approveUserById = createAsyncThunk(
  "SuperAdmin/approveUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await putRequest(apiPaths.approveUserById(id));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve user"
      );
    }
  }
);

export const declineUserById = createAsyncThunk(
  "SuperAdmin/declineUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteRequest(apiPaths.declineUserById(id));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to decline user"
      );
    }
  }
);

export const assignRoleToUser = createAsyncThunk(
  "SuperAdmin/assignRoleToUser",
  async ({ email, role }, { rejectWithValue }) => {
    try {
      const response = await postRequest(apiPaths.assignRoletoUser, {
        email,
        role,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign role"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "SuperAdmin/createProject",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postRequest(apiPaths.createProject, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "SuperAdmin/updateProject",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequest(apiPaths.updateProject, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project"
      );
    }
  }
);

export const getProject = createAsyncThunk(
  "SuperAdmin/getProject",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(apiPaths.getProject);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects"
      );
    }
  }
);

export const getProjectById = createAsyncThunk(
  "SuperAdmin/getProjectById",
  async (projectCode, { rejectWithValue }) => {
    try {
      const response = await getRequest(apiPaths.getProjectById(projectCode));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project"
      );
    }
  }
);

export const createTask = createAsyncThunk(
  "SuperAdmin/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await postRequest(apiPaths.createTask, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "SuperAdmin/updateTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await postRequest(apiPaths.updateTask, taskData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

export const getTask = createAsyncThunk(
  "SuperAdmin/getTask",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(apiPaths.getTask);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tasks"
      );
    }
  }
);

export const getTaskById = createAsyncThunk(
  "SuperAdmin/getTaskById",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await getRequest(apiPaths.getTaskById(taskId));
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch task"
      );
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem(ACCESS_TOKEN) || null,
};

const SuperAdminSlice = createSlice({
  name: "SuperAdmin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getPendingUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getPendingUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(approveUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveUserById.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(approveUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(declineUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(declineUserById.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(declineUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(assignRoleToUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignRoleToUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(assignRoleToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = [action.payload];
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = [action.payload];
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = SuperAdminSlice.actions;
export default SuperAdminSlice.reducer;
