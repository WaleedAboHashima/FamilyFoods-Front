import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import  Cookies  from 'universal-cookie';

const initialState = {
    loading: false,
    state: null,
    error: null,
    status: null,
}

const cookies = new Cookies();


const api = "http://localhost:8000/admin/product/"
// const api = "http://192.168.1.2:8000/admin/product/"


export const fetchUpdateProduct = createAsyncThunk("UpdatedData/fetchUpdateProduct", async (arg) => {
    try {
        
        const response = await axios.put(api + arg._id, arg.formData,
            { headers: { authorization: `Bearer ${cookies.get("token")}` } })
        return response.status
    }
    catch (err) {
        return {
            message: err.response.data.message,
            status : err.response.status
        }
    }
})


const UpdateProductSlice = createSlice({
    name: "UpdatedData",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUpdateProduct.fulfilled, (state, action) => {
            state.loading = true;
            if (action.payload === 201) {
                state.loading = false;
                state.status = action.payload;
                state.state = "Success"
            }
            else if (action.payload.status === 403) {
                state.loading = false;
                state.status = action.payload.status;
                state.error = action.payload.message;
            }
            else {
                state.loading = false;
                state.error = action.payload.message;
                state.status = action.payload.status;
            }
        })

        builder.addCase(fetchUpdateProduct.pending, (state) => {
            state.loading = true;
            state.state = "Pending."
        }) 

        builder.addCase(fetchUpdateProduct.rejected, (state) => {
            state.loading = false;
            state.state = "Rejected.";
            state.status = 500;
        })
    }
})

export default UpdateProductSlice.reducer;
