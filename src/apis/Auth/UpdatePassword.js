import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'universal-cookie';


const cookies = new Cookies();

const initialState = {
    loading: false,
    state: "",
    error: "",
    status: null,
}

const api = "http://localhost:8000/auth/update_password/";
// const api = "http://192.168.1.2:8000/main/user/update_password"

export const AdminUpdate = createAsyncThunk("UpdateSlice/AdminUpdate", async (arg) => {
    try {
        const response = await axios.post(api + cookies.get("userId"), {
            newPassword: arg.newPassword,
            confirmNewPassword: arg.confirmNewPassword
        })
        return response.status
    }
    catch (err) {
        return {
            status: err.response.status,
            message: err.response.data.message
        }
    }
})


const UpdateSlice = createSlice({
    name: "UpdateSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(AdminUpdate.fulfilled, (state, action) => {
            state.loading = true;
            if (action.payload === 200) {
                state.loading = false;
                state.status = action.payload;
                state.state = "Success";
                state.error = ""
            }
            else if (action.payload.status === 403) {
                state.loading = false;
                state.status = action.payload.status;
                state.state = "Success But With Errors";
                state.error = action.payload.message;
            }
        })
        builder.addCase(AdminUpdate.pending, (state) => {
            state.loading = true;
            state.status = null;
            state.state = "Pending";
            state.error = "";
        })
        builder.addCase(AdminUpdate.rejected, (state) => {
            state.loading = false;
            state.status = 500;
            state.state = "Rejected";
            state.error = "Server Error";
        })
    }
})

export default UpdateSlice.reducer;