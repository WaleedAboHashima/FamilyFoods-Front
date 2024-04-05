import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

// const api = "http://192.168.1.2:8000/admin/orders";
const api = "http://localhost:8000/admin/orders"

const initialState = {
  data: {},
  state: "",
  status: null,
  error: null,
  loading: false,
};

export const fetchAllOrders = createAsyncThunk(
  "OrdersData/fetchAllOrders",
  async () => {
    try {
      const response = await axios.get(api, {
        headers: { authorization: `Bearer ${cookies.get("token")}` },
      });
      return {
        data: response.data,
        status: response.status,
      };
    } catch (err) {
      return {
        message: err.response.data.message,
        status: err.response.status,
      };
    }
  }
);

const OrdersSlice = createSlice({
  name: "OrdersData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 200) {
        state.data = action.payload.data;
        state.status = action.payload.status;
        state.state = "Success";
        state.loading = false;
        state.error = "";
      } else {
        state.data = {};
        state.error = action.payload.message;
        state.status = action.payload.status;
        state.loading = false;
        state.state = "Error";
      }
    });
    builder.addCase(fetchAllOrders.pending, (state, action) => {
      state.status = null;
      state.error = null;
      state.state = "Pending";
      state.data = {};
      state.loading = true;
    });
  },
});

export default OrdersSlice.reducer;
