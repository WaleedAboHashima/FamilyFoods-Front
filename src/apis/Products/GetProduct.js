import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import  Cookies  from 'universal-cookie';
const cookie = new Cookies();
const initialState = {
    data: {},
    state: "",
    status: null,
    error: null,
    loading: false,
}

const api = "http://localhost:8000/user/products/";
// const api = "http://192.168.1.2:8000/user/products/";


export const fetchGetProduct = createAsyncThunk("GetProductData/fetchGetProduct", async (arg) => {
    try {
        const response = await axios.get(api + arg._id, { headers: { authorization: `Bearer ${cookie.get("token")}` } })
        return {
            data: response.data,
            status: response.status
        }
    }
    catch (error) {
        return {
            message: error.response.data.message,
            status: error.response.status
        }
    }
})


const GetProductSlice = createSlice({
    name: "GetProductData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchGetProduct.fulfilled, (state, action) => {
            state.loading = true;
            if (action.payload.status === 200) {
                state.data = action.payload.data;
                state.state = "Success";
                state.status = action.payload.status;
                state.error = null;
                state.loading = false;
            }
            else if (action.payload.status === 403) {
                state.data = {};
                state.loading = false;
                state.state = "Error";
                state.status = action.payload.status;
                state.error = action.payload.message;
            }
            else {
                state.data = {};
                state.loading = false;
                state.state = "Error";
                state.status = action.payload.status;
                state.error = action.payload.message
            }
        })
        builder.addCase(fetchGetProduct.pending, (state) => {
            state.loading = true;
            state.state = "Pending";
            state.data = {};
            state.error = null;
            state.status = null;
        })
        builder.addCase(fetchGetProduct.rejected, (state) => {
            state.loading = false;
            state.state = "Rejected";
            state.status = 500;
            state.error = "Server Error";
            state.data = {};
        })
    }
})

export default GetProductSlice.reducer;