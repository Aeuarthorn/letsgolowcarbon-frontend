import { configureStore } from "@reduxjs/toolkit";
import customerDataSlice from './Reducer'

export default configureStore({
    reducer: { customerDataSlice }
})
