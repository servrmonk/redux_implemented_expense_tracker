import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./authSlice";
import expenseSliceReducer from "./expenseSlice";

const store = configureStore({
    reducer:{
        auth:authSliceReducer,exp:expenseSliceReducer
    }
})
export default store;