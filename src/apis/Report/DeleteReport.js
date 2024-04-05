import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies  from 'universal-cookie';

const initialState = {
    loading: false,
    state: "",
    status: null,
    error: ""
}

const api = "http://localhost:8000/admin/report/"
// const api = "http://192.168.1.2:8000/admin/report/"

const cookies = new Cookies();


export const fetchDeleteReport = createAsyncThunk("DeleteReportData/fetchDeleteReport", async (arg) => {
    try {
        const response = await axios.delete(api + arg.id, { headers: { authorization: "Bearer " + cookies.get("token") } })
        return response.status
    }
    catch (err) {
        return {
            message: err.response.data.message,
            status: err.response.status
        }
    }
})


const DeleteReportSlice = createSlice({
    name: "DeleteReportData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchDeleteReport.fulfilled, (state, action) => {
            state.loading = true;
            switch (action.payload.status) {
                case 200:
                    state.loading = false;
                    state.state = "Success";
                    state.status = action.payload.status;
                    state.error = ""
                    break;
                case 403:
                    state.loading = false;
                    state.state = "Success With Errors";
                    state.status = action.payload.status;
                    state.error = action.payload.message;
                    break;
                default:
                    state.loading = false;
                    state.state = "Error";
                    state.status = action.payload.status;
                    state.error = action.payload.message;
                    break;
            }
        })
        builder.addCase(fetchDeleteReport.rejected, state => {
            state.loading = false;
            state.state = "Rejected";
            state.error = "Server Rejected Ur Connection";
            state.status = 500;
        })
        builder.addCase(fetchDeleteReport.pending, state => {
            state.loading = true;
            state.state = "Pending..";
            state.error = "";
            state.status = null;
        })
    }
})

export default DeleteReportSlice.reducer;