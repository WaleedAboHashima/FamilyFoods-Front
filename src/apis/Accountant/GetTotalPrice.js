import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "universal-cookie";

const initialState = {
  data: [],
  state: "",
  status: "",
  loading: false,
  error: "",
};

const cookies = new Cookies();

const api = "http://localhost:8000/accountant/totalPrice";

export const fetchTotalPrice = createAsyncThunk(
  "TotalPriceData/fetchTotalPrice",
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

const TotalPriceSlice = createSlice({
    name: "TotalPriceData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchTotalPrice.fulfilled, (state, action) => {
            state.loading = true;
            if (action.payload.status === 200) {
                state.data = action.payload.data;
                state.error = "";
                state.status = action.payload.status;
                state.loading = false;
                state.state = "Success";
            }
            else {
                state.loading = false;
                state.data = {};
                state.error = action.payload.message;
                state.status = action.payload.status;
                state.state = "Error";
            }
        })
        builder.addCase(fetchTotalPrice.pending, state => {
            state.loading = true;
            state.data = {};
            state.error = "";
            state.state = "";
            state.status = "";
        })
        builder.addCase(fetchTotalPrice.rejected, (state) => {
            state.loading = true;
            state.data = {};
            state.state = "Rejected";
            state.error = "Server Rejected the connection";
            state.status = 500;
        })
    }
})

export default TotalPriceSlice.reducer;
