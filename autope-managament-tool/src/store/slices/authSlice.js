import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { postRequest } from "../../utils/api";
// import API_PATHS from "../../utils/apiPaths";
import { apiPaths } from "../../utils/apiPaths";
export const sendOtp = createAsyncThunk(
  "auth/sendOtp",
  async ({ mobileNumber }, { rejectWithValue }) => {
    try {
      const response = await postRequest(apiPaths.updateUser, {
        mobileNumber,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send OTP"
      );
    }
  }
);

// export const verifyOtp = createAsyncThunk(
//   "auth/verifyOtp",
//   async ({ mobileNumber, otp }, { rejectWithValue }) => {
//     try {
//       const params = {
//         mobileNumber,
//         otp: parseInt(otp, 10),
//         deviceModel: "msite",
//         lat: 0,
//         long: 0,
//       };
//       const response = await postRequest(API_PATHS.verifyOtp, params);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Invalid OTP");
//     }
//   }
// );

// export const resendOtp = createAsyncThunk(
//   "auth/resendOtp",
//   async ({ mobileNumber }, { rejectWithValue }) => {
//     try {
//       const response = await postRequest(API_PATHS.resendOtp, { mobileNumber });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || "Failed to resend OTP"
//       );
//     }
//   }
// );

const initialState = {
  loading: false,
  error: null,
  isAuthenticated: false,
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    // // Verify OTP
    // .addCase(verifyOtp.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(verifyOtp.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.isAuthenticated = true;
    //   state.user = action.payload.user;
    //   state.accessToken = action.payload.accessToken;
    // })
    // .addCase(verifyOtp.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // })
    // // Resend OTP
    // .addCase(resendOtp.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(resendOtp.fulfilled, (state) => {
    //   state.loading = false;
    // })
    // .addCase(resendOtp.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // });
  },
});

export default authSlice.reducer;
