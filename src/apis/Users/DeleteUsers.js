import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const api = "http://localhost:8000/admin/user/"
// const api = "http://192.168.1.2:8000/admin/user/";
const initialState = {
  data: {},
  loading: false,
  error: null,
  status: null,
  state: ''
};

export const deleteUser = createAsyncThunk(
  "userInfo/deleteUser",
  async (arg) => {
    try {
      const response = await axios.delete(api + arg._id, {
        headers: { authorization: `Bearer ${cookies.get("token")}` },
      });
      return response.data;
    } catch (err) {
      return err.response;
    }
  }
);

const deleteUserSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 401) {
        console.log("Error");
        state.data = {};
        state.loading = false;
        state.error = action.payload.message;
      } else {
        state.data = action.payload;
        state.status = 200;
        state.loading = false;
      }
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.status = action.payload;
      state.state = "rejected";
      state.loading = false;
    });
    builder.addCase(deleteUser.pending, (state) => {
      state.state = "pending";
      state.loading = true;
    });
  },
});

export default deleteUserSlice.reducer;