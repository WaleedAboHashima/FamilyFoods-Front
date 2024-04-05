import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import  Cookies  from 'universal-cookie';

const initialState = {
    loading: false,
    state: "",
    status: null,
    error: ""
};

const cookies = new Cookies()

// const api = "http://localhost:8000/main/user/";
const api = "http://localhost:8000/main/user/";


export const ChangeSettings = createAsyncThunk("SettingsSlice/ChangeSettings", async (arg) => {
    try {

        const response = await axios.put(`${api}${cookies.get("_auth_id")}?${arg.username ? "username" : arg.email ? "email" : "phone" }=${arg.username || arg.email || arg.phone}`, null, {
            headers: { authorization: `Bearer ${cookies.get("token")}` },
          })
        return response.status;
    }
    catch (e) {
        return {
            status: e.response.status,
            message: e.response.message
        }
    }
})


const SettingsSlice = createSlice({
    name: "SettingsSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(ChangeSettings.fulfilled, (state, action) => {
            state.loading = true;
            if (action.payload === 200) {
                state.state = "Success";
                state.status = action.payload;
                state.loading = false;
            }
            else if (action.payload.status === 403) {
                state.state = "Error";
                state.status = action.payload.status;
                state.loading = false;
                state.error = action.payload.message;
            }
        })
        builder.addCase(ChangeSettings.rejected, (state) => {
            state.state = "Rejected";
            state.error = "Server Rejected Ur Connection."
        })

        builder.addCase(ChangeSettings.pending, (state) => {
            state.loading = true;
            state.state = "Pending";
        })
    }
})


export default SettingsSlice.reducer;