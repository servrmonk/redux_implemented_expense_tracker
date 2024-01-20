import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuth : localStorage.getItem('idToken') || false
}
const authSlice = createSlice({
    name:"AuthSlice",
    initialState,
    reducers:{
        logoutFun(state){
            localStorage.removeItem('idToken');
            localStorage.removeItem('email');
            state.isAuth = false;
        },
        loginFun(state,action){
            state.isAuth = action.payload
        }
    }
})
export const {logoutFun,loginFun} = authSlice.actions;
export default authSlice.reducer;