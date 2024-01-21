import { createSlice } from "@reduxjs/toolkit";

const themeState = {
    isDarkMode:false
}
const themeSlice = createSlice({
    name:"ThemeSlice",
    initialState:themeState,
    reducers:{
        toggleTheme(state){
            state.isDarkMode = !state.isDarkMode
        }
    }
})
export const {toggleTheme} = themeSlice.actions;
export default themeSlice.reducer;
