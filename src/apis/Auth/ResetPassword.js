import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import  Cookies  from 'universal-cookie';

const api = "http://localhost:8000/auth/reset_password?type=email"
// const api = "http://192.168.1.2:8000/main/user/reset_password"
const cookies = new Cookies();
const initialState = {
    data: {},
    state: "",
    status: null,
    error: "",
    loading: false,
}

export const AdminReset = createAsyncThunk("ResetSlice/AdminReset", async (arg) => {
    try {
        const response = await axios.post(api, {
            OTP: arg.Otp,
            email: cookies.get('email'),
        })
        return {
            data: response.data,
            status: response.status
        }
    }
    catch (err) {
        return {
            status: err.response.status,
            message: err.response.data.message,
        }
    }
})

const ResetSlice = createSlice({
    name: "ResetSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(AdminReset.fulfilled, (state, action) => {
            state.loading = true;
            if (action.payload.status === 200) {
                state.loading = false;
                state.data = action.payload.data;
                state.state = "Success";
                state.status = action.payload.status;
                state.error = "";
            }
            else if (action.payload.status === 403) {
                state.loading = false;
                state.data = {}
                state.state = "Success with Errors";
                state.status = action.payload.status;
                state.error = action.payload.message;
            }
            else { 
                state.loading = false;
                state.data = {};
                state.state = "Error";
                state.status = action.payload.status;
                state.error = action.payload.message;
            }
        })
        builder.addCase(AdminReset.pending, (state) => {
            state.loading = true;
            state.data = {};
            state.state = "Pending";
            state.status = "";
            state.error = "";
        })
        builder.addCase(AdminReset.rejected, (state, action) => {
            state.loading = false;
            state.data = {};
            state.state = "Rejected";
            state.status = action.payload.status;
            state.error = action.payload.message;
        })
    }
})

export default ResetSlice.reducer;