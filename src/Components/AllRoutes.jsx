import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";

import LoginPage from "./LoginPage";
import ProfileForm from "./ProfileForm";
import { useSelector } from "react-redux";
import ForgetPassword from "./ForgetPasswordPage";

export default function AllRoutes() {
  //   const isLoggedIn = authCtx.isLoggedIn;
  const {isAuth: data} = useSelector((state) => state.auth) ;
//   console.log("Data hai ya nai ", data);
  return (
    <Routes>
      {data && (
        <>
          <Route path="/homepage" element={<Navbar />} />
          <Route path="/completeProfile" element={<ProfileForm />} />
        </>
      )}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );
}
