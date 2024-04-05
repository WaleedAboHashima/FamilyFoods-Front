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
const api = "http://localhost:8000/user/products";
// const api = "http://192.168.1.2:8000/main/products";
export const fetchAllProducts = createAsyncThunk(
  "ProductsData/fetchAllProducts",
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

const ProductsSlice = createSlice({
  name: "ProductsData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
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
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.state = "pending";
      state.loading = true;
      state.data = {};
      state.status = "";
    });
    builder.addCase(fetchAllProducts.rejected, (state) => {
      state.loading = false;
      state.data = {};
      state.status = 500;
      state.state = "Rejected";
    });
  },
});

export default ProductsSlice.reducer;
