import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = "http://localhost:8000/auth/login";
// const api = "http://192.168.1.2:8000/main/user/login";

const initialState = {
  data: {},
  state: "",
  error: null,
  status: null,
  loading: false,
};

export const AdminLogin = createAsyncThunk(
  "LoginData/AdminLogin",
  async (arg) => {
    try {
      const response = await axios.post(api, {
        email: arg.email,
        password: arg.password,
        phone: arg.phone,
      });
      return {
        data: response.data,
        status: response.status
      }
    } catch (error) {
      return {
        message: error.response.data.message,
        status : error.response.status
      }
    }
  }
);

const LoginSlice = createSlice({
  name: "LoginData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(AdminLogin.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 200) {
        state.data = action.payload.data;
        state.loading = false;
        state.status = action.payload.status;
        state.state = "Success";
        state.error = "";
      } else {
        state.data = {};
        state.loading = false;
        state.state = "Error";
        state.error = action.payload.message;
        state.status = action.payload.status;
      }
    });
    builder.addCase(AdminLogin.pending, (state) => {
      state.loading = true;
      state.data = {};
      state.state = "Pending";
      state.status = null;
      state.error = null;
    });
    builder.addCase(AdminLogin.rejected, (state) => {
      state.error = "Server Rejected The Connection";
      state.state = "Rejected";
      state.data = {};
      state.status = 500;
      state.loading = false;
    });
  },
});

export default LoginSlice.reducer;