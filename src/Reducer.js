import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {

}

const customerDataSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        addCustomer: (state, action) => {
            state.data = action.payload
            console.log(current(state))
        },
        addAddress: (state, action) => {
            state.data = action.payload
        }
    }
})

export const { addCustomer } = customerDataSlice.actions
export default customerDataSlice.reducer