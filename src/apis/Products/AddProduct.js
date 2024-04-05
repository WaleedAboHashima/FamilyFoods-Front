import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const initialState = {
  state: "",
  status: null,
  loading: false,
  error: "",
};

const api = "http://localhost:8000/admin/product";
// const api = "http://192.168.1.2:8000/admin/product";

export const fetchAddProduct = createAsyncThunk(
  "AddProductSlice/fetchAddProduct",
  async (arg) => {
    try {
      const response = await axios.post(api, arg, {
        headers: { authorization: `Bearer ${cookies.get("token")}` },
      });
      return response.status;
    } catch (err) {
      return {
        message: err.response.data.message,
        status: err.response.status,
      };
    }
  }
);

const AddProductSlice = createSlice({
  name: "AddProductSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAddProduct.fulfilled, (state, action) => {
      state.loading = true;
      if (action.payload === 201) {
        state.loading = false;
        state.state = "Success";
        state.status = action.payload;
      } else if (action.payload.status === 403) {
        state.loading = false;
        state.status = action.payload.status;
        state.state = "Success with errors";
        state.error = action.payload.message;
      }
    });
    builder.addCase(fetchAddProduct.rejected, (state, action) => {
      state.loading = false;
      state.state = "Rejected";
      state.status = action.payload.status;
      state.error = action.payload.message;
    });

    builder.addCase(fetchAddProduct.pending, (state) => {
      state.loading = true;
      state.state = "Pending";
      state.status = null;
      state.error = "";
    });
  },
});

export default AddProductSlice.reducer;
