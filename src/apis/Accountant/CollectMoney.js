import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const api = "http://localhost:8000/accountant/SR/order/";

const cookies = new Cookies();
const initialState = {
  data: {},
  loading: false,
  error: null,
  status: null,
  state: "",
};

export const CollectHandler = createAsyncThunk(
  "CollectData/CollectHandler",
  async (arg) => {
    try {
      const response = await axios.put(
        api + arg.orderId + '/' + arg.srId,
        {
          price: parseInt(arg.price),
        },
        {
          headers: { authorization: `Bearer ${cookies.get("token")}` },
        }
      );
      return { data: response.data, status: response.status };
    } catch (err) {
      return {
        message: err.response.data.message,
        status: err.response.status,
      };
    }
  }
);

const CollectSlice = createSlice({
  name: "CollectData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CollectHandler.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload.status === 201) {
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
    builder.addCase(CollectHandler.pending, (state) => {
      state.state = "pending";
      state.loading = true;
      state.data = {};
      state.status = "";
    });
    builder.addCase(CollectHandler.rejected, (state) => {
      state.loading = false;
      state.data = {};
      state.status = 500;
      state.state = "Rejected";
    });
  },
});

export default CollectSlice.reducer;
