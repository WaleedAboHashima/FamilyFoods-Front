import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import  Cookies  from 'universal-cookie';

const api = "http://localhost:8000/admin/order/"
// const api = "http://192.168.1.2:8000/admin/order/"
const initialState = {
    data: {},
    loading: false,
    state: '',
    status: null,
    error : null
}

const cookies = new Cookies();

export const archiveOrder = createAsyncThunk("archiveOrderData/archiveOrder", async (arg) => {
    try {
        const response = await axios.delete(api + arg._id, {
            headers: { authorization: `Bearer ${cookies.get("token")}` }
        })
        return response.data
    }
    catch (error) {
        return error.response.status
    }
});

const archiveSlice = createSlice({
    name: "archiveOrderData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(archiveOrder.fulfilled, (state, action) => {
            state.loading = true;
            if (action.payload === 403) {
                state.data = {};
                state.loading = false;
                state.state = "Success but with errors";
                state.status = action.payload;
                state.error = action.payload;
            }
            else {
                state.data = action.payload;
                state.loading = false;
                state.state = "Success";
                state.status = 200;
                state.error = null;
            }
        })
        builder.addCase(archiveOrder.rejected, (state, action) => {
            state.state = "Rejected";
            state.status = action.payload;
            state.data = {};
            state.error = action.payload;
            state.loading = false;
        })
        builder.addCase(archiveOrder.pending, (state) => {
            state.loading = true;
            state.state = "Pending";
            state.data = {};
            state.error = null;
            state.status = null;
        })
    }
})

export default archiveSlice.reducer;