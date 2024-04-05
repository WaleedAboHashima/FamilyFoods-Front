import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import  Cookies  from 'universal-cookie';
import axios from 'axios';


const api = "http://localhost:8000/admin/user"
// const api = "http://192.168.1.2:8000/admin/user"
const cookie = new Cookies();
const initialState = {
    state: null,
    status: null,
    loading: false,
    error: null
}


export const fetchAddUser = createAsyncThunk("AddUserState/fetchAddUser", async (arg) => {
    try {
        const response = await axios.post(api, {
            username: arg.username,
            phone: arg.phone,
            email: arg.email,
            password: arg.password,
            type: arg.permission,
        }, { headers: { authorization: `Bearer ${cookie.get("token")}` } })
        return response.status
    }
    catch (err) {
        return {
            message: err.response.data.message,
            status: err.response.status
        }
    }
})


const AddUserSlice = createSlice({
    name: "AddUserState",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAddUser.fulfilled, (state, action) => {
            state.loading = true;
            if (action.payload === 201) {
                state.loading = false;
                state.state = "Success";
                state.status = action.payload;
            }
            else if (action.payload.status === 403) {
                state.loading = false;
                state.state = "Error";
                state.status = action.payload.status;
                state.error = action.payload.message;
            }
            else {
                state.loading = false;
                state.state = "Error";
                state.error = action.payload.message;
                state.status = action.payload.status;
            }
        })
        builder.addCase(fetchAddUser.rejected, (state, action) => {
            state.loading = false;
            state.state = "Rejected";
            state.status = action.payload.status;
            state.error = action.payload.message;
        })
        builder.addCase(fetchAddUser.pending, (state) => {
            state.loading = true;
            state.state = "Pending";
        })
    }
})


export default AddUserSlice.reducer;