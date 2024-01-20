import axios from "axios";
import React, { useContext, useRef } from "react";
// import AuthContext from "../Context/AuthContext";
import { Link } from "react-router-dom";

export default function ProfileForm() {
  const nameRef = useRef(null);
  const urlRef = useRef(null);

//   const athCtx = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("ur in submithandler");
    const FullName = nameRef.current.value;
    const picUrl = urlRef.current.value;
    console.log("fullname  ", FullName, " and url is ", picUrl);

    // UPDATE INPUT DATA TO FIREBASE

    const updateProfileToFirebase = async () => {
      let url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyB4n3mxcRsx9p4NlhU9Pawi75LNOUgQkr8`;

      let token = localStorage.getItem('idToken')|| null;
      if (!token) {
        console.error("Token not found");

        return;
      }
      const requestData = {
        idToken: token,
        displayName: FullName,
        photoUrl: picUrl,
        returnSecureToken: true,
      };

      try {
        const response = await axios.post(url, requestData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("response is", response);
        if (response.status === 200) {
          const data = response.data;
          console.log("Data inside try block", data);
        } else {
          let errorMsg = "Authentication Failed";
          throw new Error(errorMsg);
        }
      } catch (error) {
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
    await updateProfileToFirebase();

    nameRef.current.value = "";
    urlRef.current.value = "";

    //GET PROFILE DATA FROM FIREBASE

    const getProfileDataToFirebase = async () => {
      let url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyB4n3mxcRsx9p4NlhU9Pawi75LNOUgQkr8`;
      let token = localStorage.getItem('idToken') || null;
      if (!token) {
        console.error("Token not found");
        return;
      }
      console.log("token in fun", token);
      const obj = {
        idToken: token,
      };
      try {
        const response = await axios.post(url, obj, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const newArrOfObj = response.data.users;
        console.log("newArrOfObj", newArrOfObj);

        newArrOfObj.map((elm) => {
          console.log(elm.displayName, elm.photoUrl);
          nameRef.current.value = elm.displayName;
          urlRef.current.value = elm.photoUrl;
        });
      } catch (error) {
        console.log("Error in getProfileFun", error);
      }
    };
    await getProfileDataToFirebase();
  };
  return (
    <>
      <div className="max-w-[auto] max-h-[auto] flex justify-between bg-slate-400 p-2  shadow-lg shadow-indigo-500/40 ">
        <p className="text-xl font-serif p-2">
          {" "}
          Winners never quite, Quitters never win.
        </p>

        <div className="bg-[#e7dada] max-w-[40%] w-[355px] max-h-[auto] mb-2 h-12  leading-5 italic rounded-lg p-1  text-[13px] font-serif">
          Your profile is 64% completed. A complete Profile has higher chances
          of landing a job.
          <Link className="blue text-blue-600" to="/">
            Complete now
          </Link>{" "}
        </div>
      </div>
      <br /> <br />
      <hr />
      <form action="submit" onSubmit={submitHandler}>
        <div className="h-auto p-4 bg-slate-300 shadow-xl w-[80%] m-auto rounded-xl ">
          <div className="flex justify-between">
            <h1 className="font-medium text-xl">Contact Details</h1>
            {/* <button className="inline-block ">Cancel</button> */}
            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
              Cancel
            </button>
          </div>

          <div>
            <img
              className="h-9 inline-block"
              src="https://www.pofilo.fr/img/SPOF-github/github1600.png"
              alt="github-logo"
            />
            <label
              htmlFor="fullName"
              className="font-medium text-lg mx-2 m-3 my-4 inline-block"
            >
              {" "}
              Full Name:{" "}
            </label>
            <input
              ref={nameRef}
              className="bg-slate-100"
              type="text"
              name="fullName"
              id="fullName"
            />
            <img
              className="h-8 inline-block ml-16"
              src="https://pluspng.com/img-png/website-png-done-for-you-website-package-900.png"
              alt="web-logo"
            />
            <label
              htmlFor="profilePic"
              className="font-medium text-lg ml-1 mr-2 my-4 inline-block"
            >
              {" "}
              Profile Photo URL:
            </label>
            <input
              ref={urlRef}
              className="bg-slate-100"
              type="text"
              name="profilePic"
              id="profilePic"
            />
            <br />
            <button
              type="submit"
              className="bg-blue-500 mt-2 mx-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
