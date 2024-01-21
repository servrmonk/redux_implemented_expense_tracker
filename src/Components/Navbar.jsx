import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutFun } from "../Redux/authSlice";
import ExpensePage from "./ExpensePage";
import { toggleTheme } from "../Redux/themeSlice";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    // logout();
    console.log("Logout call");
    dispatch(logoutFun());
    navigate("/login");
  };

  const verifyEmail = async () => {
    let url =
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyB4n3mxcRsx9p4NlhU9Pawi75LNOUgQkr8";

    let token = localStorage.getItem("idToken") || null;

    if (!token) {
      console.error("Token not found");
      return;
    }
    let obj = {
      requestType: "VERIFY_EMAIL",
      idToken: token,
    };

    try {
      const response = await axios.post(url, obj, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response in verify mail", response);
    } catch (error) {
      console.log("Error in email handling", error);
    }
  };

  const totalPrice = useSelector((state) => state.exp.totalExpense);

  // const currTheme = useSelector((state) => state.theme);

  const toggleThemeStatus = useSelector((state) => state.theme.isDarkMode);

  const toggleHandle = () => {
    dispatch(toggleTheme());
  };

  return (
    <>
      {/* <div className={`max-w-[auto] flex justify-between  bg-slate-300 p-3  shadow-lg shadow-lime-900/40` }> */}
      <div
        className={`max-w-[auto] flex justify-between  shadow-lg  p-3 ${
          toggleThemeStatus ? "bg-gray-900 text-white " : "bg-slate-300"
        }  shadow-lime-900/40`}
      >
        {/* {`max-w-[auto] flex justify-between bg-slate-300 p-3 shadow-lg ${toggleThemeStatus ? 'shadow-indigo-500/40' : 'shadow-indigo-500/40'}` */}

        <p className="text-2xl font-serif"> Welcome to Expense Tracker</p>

        <div className="flex mx-1">
          {/* //toggle button for dark mode */}
          {totalPrice >= 10000 && (
            <label className="relative mt-2 mr-1 items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div
                onClick={toggleHandle}
                className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
              
            </label>
          )}

          <div
            className={`${
              toggleThemeStatus ? `bg-orange-400` : `bg-[#e7dada]`
            }  h-10 max-h-[auto] italic rounded-lg p-1 text-[13px] font-medium mx-2 `}
          >
            Your profile is incomplete.{" "}
            <Link className="blue text-blue-600" to="/completeProfile">
              Complete now
            </Link>
          </div>
          <button
            onClick={verifyEmail}
            type="button"
            className=" text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Verify Your Email
          </button>
          <button
            onClick={logoutHandler}
            type="button"
            className=" text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Logout
          </button>
        </div>
      </div>
      <ExpensePage />
    </>
  );
}

export default Navbar;
