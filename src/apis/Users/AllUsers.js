import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const api = "http://localhost:8000/admin/users";
// const api = "http://192.168.1.2:8000/admin/users";
const cookies = new Cookies();
const initialState = {
  data: {},
  loading: false,
  error: null,
  status: null,
  state: "",
};

export const fetchallUsers = createAsyncThunk(
  "UsersData/fetchallUsers",
  async () => {
    try {
      const response = await axios.get(api, {
        headers: { authorization: `Bearer ${cookies.get("token")}` },
      });
      return {data:  response.data, status : response.status };
    } catch (err) {
      return {
        message: err.response.data.message,
        status: err.response.status
      };
    }
  }
);

const UsersSlice = createSlice({
  name: "UsersData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchallUsers.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 200) {
        state.data = action.payload.data;
        state.status = action.payload.status;
        state.error = action.payload;
        state.loading = false;
      } else {
        state.data = {};
        state.status = action.payload.status;
        state.error = null;
        state.loading = false;
      }
    });
    builder.addCase(fetchallUsers.pending, (state) => {
      state.state = "pending";
      state.loading = true;
      state.data = {};
      state.status = "";
    });
    builder.addCase(fetchallUsers.rejected, (state) => {
      state.loading = false;
      state.data = {};
      state.status = 500;
      state.state = "Rejected";
    });
  },
});

export default UsersSlice.reducer;
