import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const api = "http://localhost:8000/accountant/SR/order/";

const initialState = {
  data: {},
  loading: false,
  state: "",
  status: null,
  error: null,
};

const cookies = new Cookies();

export const archiveSrOrder = createAsyncThunk(
  "archiveOrderData/archiveOrder",
  async (arg) => {
    try {
      const response = await axios.delete(api + arg._id, {
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

const archiveSrSlice = createSlice({
  name: "archiveSrData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(archiveSrOrder.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload === 200) {
        state.data = action.payload.data;
        state.loading = false;
        state.state = "Success";
        state.status = action.payload.status;
        state.error = "";
      } else {
        state.data = action.payload;
        state.loading = false;
        state.state = "Success";
        state.status = action.payload.status;
        state.error = action.payload.message;
      }
    });
    builder.addCase(archiveSrOrder.rejected, (state, action) => {
      state.state = "Rejected";
      state.status = action.payload;
      state.data = {};
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(archiveSrOrder.pending, (state) => {
      state.loading = true;
      state.state = "Pending";
      state.data = {};
      state.error = null;
      state.status = null;
    });
  },
});

export default archiveSrSlice.reducer;
