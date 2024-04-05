import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import  Cookies  from 'universal-cookie';

const initialState = {
    data : {},
    loading: false,
    state: null,
    status: null,
    error : null
}

const cookies = new Cookies();

const api = "http://localhost:8000/accountant/SR/orders"

export const fetchSrOrders = createAsyncThunk("SrOrdersData/fetchSrOrder", async () => {
    try {
        const response = await axios.get(api, { headers: { authorization: `Bearer ${cookies.get("token")}` } })
        return {
            data: response.data,
            status: response.status
        }
    }
    catch (err) {
        return {
            message: err.response.data.message,
            status : err.response.status
        }
    }
})

const GetSrOrdersSlice = createSlice({
    name: "SrOrdersData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSrOrders.fulfilled, (state, action) => {
            state.loading = true;
            switch (action.payload.status) {
                case 200:
                    state.data = action.payload.data;
                    state.state = "Success";
                    state.status = action.payload.status;
                    state.error = null;
                    state.loading = false;
                    break;
                case 403:
                    state.data = {};
                    state.state = "Success but with Error";
                    state.status = action.payload.status;
                    state.error = action.payload.message;
                    state.loading = false;
                    break;
                default:
                    state.data = {};
                    state.state = "Error";
                    state.status = action.payload.status;
                    state.error = action.payload.message;
                    state.loading = false;
            }
        })
        builder.addCase(fetchSrOrders.rejected, state => {
            state.loading = false;
            state.data = {};
            state.status = 500;
            state.error = "Server Rejected The Connection";
            state.state = "Rejected";
        })
        builder.addCase(fetchSrOrders.pending, state => {
            state.loading = true;
            state.data = {};
            state.status = null;
            state.state = "Pending.";
            state.error = null;
        })
    }
})

export default GetSrOrdersSlice.reducer;