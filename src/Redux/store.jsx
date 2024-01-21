import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./authSlice";
import expenseSliceReducer from "./expenseSlice";
import themeSliceReducer from "./themeSlice";

const store = configureStore({
    reducer:{
        auth:authSliceReducer,exp:expenseSliceReducer,theme:themeSliceReducer
    }
})
export default store;