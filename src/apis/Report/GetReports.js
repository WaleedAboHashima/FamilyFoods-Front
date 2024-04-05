import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const initialState = {
  data: {},
  state: "",
  error: "",
  status: null,
  loading: false,
};

const api = "http://localhost:8000/admin/reports";
// const api = "http://192.168.1.2:8000/admin/reports"

const cookies = new Cookies();

export const fetchGetReports = createAsyncThunk(
  "GetReportsData/fetchGetReports",
  async () => {
    try {
      const response = await axios.get(api, {
        headers: { authorization: `Bearer ${cookies.get("token")}` },
      });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      return {
        message: error.response.data.message,
        status: error.response.status,
      };
    }
  }
);

const GetReportSlice = createSlice({
  name: "GetReportsData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchGetReports.fulfilled, (state, action) => {
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
    builder.addCase(fetchGetReports.pending, (state) => {
      state.state = "pending";
      state.loading = true;
      state.data = {};
      state.status = "";
    });
    builder.addCase(fetchGetReports.rejected, (state) => {
      state.loading = false;
      state.data = {};
      state.status = 500;
      state.state = "Rejected";
    });
  },
});

export default GetReportSlice.reducer;
