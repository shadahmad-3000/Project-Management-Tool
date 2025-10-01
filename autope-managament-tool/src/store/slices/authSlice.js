import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest } from "../../utils/api";
// import API_PATHS from "../../utils/apiPaths";
import { apiPaths } from "../../utils/apiPaths";
import { ACCESS_TOKEN } from "../../utils/constants";

export const signin = createAsyncThunk(
  "auth/signin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await postRequest(apiPaths.userSignin, credentials);
      console.log("response", response);
      console.log("response.data?.token", response.data?.token);

      if (response.data?.token) {
        localStorage.setItem(ACCESS_TOKEN, response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Signin failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async ({ email }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await postRequest(
        apiPaths.userLogout,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem(ACCESS_TOKEN);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await postRequest(apiPaths.userChangePassword, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Change password failed"
      );
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (body, { rejectWithValue }) => {
    try {
      const response = await postRequest(apiPaths.forgetPassword, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Forget password failed"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (body, { rejectWithValue }) => {
    try {
      const response = await postRequest(apiPaths.resetPassword, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Reset password failed"
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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(forgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // 🔹 Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
