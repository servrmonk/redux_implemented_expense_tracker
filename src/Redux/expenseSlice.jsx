import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialStateForExpense = {
  tempExp: [],
  expFromDB: [],
};
const expenseSlice = createSlice({
  name: "ExpenseSlice",
  initialState: initialStateForExpense,
  reducers: {
    setExpense(state, action) {
      state.tempExp.push(action.payload);
    },
    getExpense(state, action) {
      state.expFromDB = action.payload;
    },
  },
});

export const { setExpense, getExpense } = expenseSlice.actions;
export default expenseSlice.reducer;

export const postDataOnFirebase = (action) => {
  return async function postDataOnFb(dispatch) {
    let url = `https://expense-tracker-b82dc-default-rtdb.firebaseio.com/.json`;

    try {
      const response = await axios.post(url, action);
      const data = await response.data;

      dispatch(setExpense(data)); //action call
    } catch (error) {
      console.log("Error in postData", error);

      if (error.response) {
        console.log("Server responded with a non-2xx status");
        console.log("Response data:", error.response.data);
        console.log("HTTP status code:", error.response.status);
        console.log("Headers:", error.response.headers);
      } else if (error.request) {
        console.log("Request was made but no response was received");
        console.log("Request:", error.request);
      } else {
        console.log("Error during request setup:", error.message);
      }
      console.log("Error config:", error.config);
    }
  };
};

export const getDataFromFirebase = () => {
  return async function getData(dispatch) {
    let url = `https://expense-tracker-b82dc-default-rtdb.firebaseio.com/.json`;
    try {
      const response = await axios.get(url);
      let respObj = response.data;

      const newArrayOfValue = [];
      for (const key in respObj) {
        const value = respObj[key];
        newArrayOfValue.push({ ...value, firebaseId: key });
      }

      dispatch(getExpense(newArrayOfValue));
    } catch (error) {
      console.log("Error in GetData", error);
    }
  };
};
export const deleteDataFromFirebase = (action) => {
  return async function delHandler() {
    const url = `https://expense-tracker-b82dc-default-rtdb.firebaseio.com/${action}.json`;
    try {
      const responseInDeleteHandler = await axios.delete(url);
    } catch (error) {
      console.log("Error ", error);
    }
  };
};
export const editDataInFirebase = (action) => {
  
  
  return async function editHandler(dispatch) {
  

    let url = `https://expense-tracker-b82dc-default-rtdb.firebaseio.com/${action.firebaseId}.json`;
    // console.log("value of object before put request ", obj);
    try {
      const response = await axios.put(url, action);
      console.log("Response in editDataInFirebase ", response);
    } catch (error) {
      console.log("Error in editDataInFirebase", error);
    }
  };
};
