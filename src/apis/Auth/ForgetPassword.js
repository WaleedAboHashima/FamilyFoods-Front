import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  state: "",
  status: null,
  error: null,
};

const api = "http://localhost:8000/auth/forget_password?type=email"
// const api = "http://192.168.1.2:8000/main/user/forget_password";

export const AdminForget = createAsyncThunk(
  "ForgetSlice/AdminForget",
  async (arg) => {
    try {
      const response = await axios.post(api, {
        email: arg.email,
      });
      return {
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        message: error.response.data.message,
        status: error.response.status
      }
    }
  }
);

const ForgetPasswordSlice = createSlice({
  name: "ForgetSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AdminForget.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 403) {
        console.log(action)
        state.loading = false;
        state.status = action.payload.status;
        state.state = "Success But With Errors";
        state.error = action.payload.message;
      } else if (action.payload.status === 200) {
        state.loading = false;
        state.state = "Success";
        state.status = 200;
        state.error = null;
      } else {
        state.loading = false;
        state.state = "Error";
        state.status = action.payload.status;
        state.error = action.payload.message;
      }
    });
    builder.addCase(AdminForget.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.state = "Pending";
      state.status = null;
    });
    builder.addCase(AdminForget.rejected, (state, action) => {
      state.loading = false;
      state.state = "Rejected";
      state.status = action.payload.status;
      state.error = action.payload.error;
    });
  },
});

export default ForgetPasswordSlice.reducer;