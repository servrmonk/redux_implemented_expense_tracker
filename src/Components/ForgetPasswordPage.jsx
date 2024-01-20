import React, { useRef, useState } from "react";

import axios from "axios";
import Loader from "./Loader";

export default function ForgetPassword() {
  const emailRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log(emailRef.current.value);
    let email = emailRef.current.value;
    localStorage.setItem("ForgetPasswordEmail", email);
    setLoader(true);
    const forgetPassword = async (email) => {
      let url =
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyB4n3mxcRsx9p4NlhU9Pawi75LNOUgQkr8";
      const obj = {
        requestType: "PASSWORD_RESET",
        email: email,
      };
      try {
        const response = await axios.post(url, obj, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        // console.log("Response in forgetPassword", response);
        console.log("Response in forgetPassword", response.data);
      } catch (error) {
        console.log("Error in forgetPassword", error);
      } finally {
        setLoader(false);
      }
    };
    await forgetPassword(email);
  };
  return (
    <div className="bg-gradient-to-tl p-32 from-orange-300 to-lime-900 h-screen  max-w-full ">
      <div className="bg-slate-50 bg-opacity-10 shadow-2xl rounded-3xl  p-7  h-30 m-auto w-[500px]">
        <form action="submit" onSubmit={submitHandler}>
          <p className="font-black font-serif text-2xl ">Password Reset</p>
          <label
            htmlFor="email"
            className="mb-2 hover:font-serif hover:text-2xl font-medium"
          >
            Email
          </label>
          <br />
          <input
            className="bg-slate-200 rounded-md    shadow-[inset_-12px_-8px_40px_#46464620] mb-7 w-[85%] h-9"
            type="email"
            id="email"
            required
            ref={emailRef}
          />
          <br />

          <>
            <button
              disabled={loader}
              type="submit"
              className="text-white w-[83%] h-10 shadow-lg bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Login
            </button>
            <br />
            {loader && <Loader />}
          </>
        </form>
      </div>
    </div>
  );
}
