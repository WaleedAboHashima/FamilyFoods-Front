import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const api = "http://localhost:8000/admin/product/"
// const api = "http://192.168.1.2:8000/admin/product/";
const initialState = {
  data: {},
  loading: false,
  error: null,
  status: null,
  state: ''
};

export const deleteProduct = createAsyncThunk(
  "deleteProductData/deleteProduct",
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

const deleteProductSlice = createSlice({
  name: "deleteProductData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
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
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.status = action.payload;
      state.state = "rejected";
      state.loading = false;
    });
    builder.addCase(deleteProduct.pending, (state) => {
      state.state = "pending";
      state.loading = true;
    });
  },
});

export default deleteProductSlice.reducer;