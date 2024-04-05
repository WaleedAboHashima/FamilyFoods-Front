import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const initialState = {
  data: {},
  loading: false,
  status: null,
  error: null,
  state: "",
};
const api = "http://localhost:8000/admin/top3";
export const fetchTop3 = createAsyncThunk(
  "Top3Data/fetchTop3",
  async () => {
    try {
      const response = await axios.get(api, {
        headers: { authorization: `Bearer ${cookies.get("token")}` },
      });
      return { data: response.data, status: response.status };
    } catch (err) {
      return {
        message: err.response.data.message,
        status: err.response.status,
      };
    }
  }
);

const Top3Slice = createSlice({
  name: "Top3Data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTop3.fulfilled, (state, action) => {
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
    builder.addCase(fetchTop3.pending, (state) => {
      state.state = "pending";
      state.loading = true;
      state.data = {};
      state.status = "";
    });
    builder.addCase(fetchTop3.rejected, (state) => {
      state.loading = false;
      state.data = {};
      state.status = 500;
      state.state = "Rejected";
    });
  },
});

export default Top3Slice.reducer;
