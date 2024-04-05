import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const api = "http://localhost:8000/accountant/SR";


const cookies = new Cookies();
const initialState = {
  data: {},
  loading: false,
  error: null,
  status: null,
  state: "",
};

export const fetchAllSr = createAsyncThunk(
  "SrData/fetchAllSr",
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

const SrSlice = createSlice({
  name: "SrData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllSr.fulfilled, (state, action) => {
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
    builder.addCase(fetchAllSr.pending, (state) => {
      state.state = "pending";
      state.loading = true;
      state.data = {};
      state.status = "";
    });
    builder.addCase(fetchAllSr.rejected, (state) => {
      state.loading = false;
      state.data = {};
      state.status = 500;
      state.state = "Rejected";
    });
  },
});

export default SrSlice.reducer;
