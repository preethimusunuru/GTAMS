import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../../Redux/authSlice";

const ForgetPassword = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const handleCancel = () => {
    // Go back to the previous page
    navigate(-1);
    // window.history.back();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // checking for the empty field
    if (!email) {
      toast.error("All fields are mandatory");
      return;
    }

    // email validation using regex
    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      toast.error("Invalid email id");
      return;
    }

    // calling the api from auth slice
    const res = await dispatch(forgetPassword(email));

    // clearing the input fields
    setEmail("");
  };

  return (
    <div className="flex justify-center container mx-auto items-center min-h-96 bg-slate-200">
      <div className="lg:m-10 lg:w-1/3 w-full lg:p-7 p-3 m-2 rounded-lg shadow-md bg-white">
        <h1 className="text-xl font-bold text-gray-800 mb-3">
          Find Your Account
        </h1>
        <hr className="lg:mb-5 border-t-1 border-gray-800 font-semibold"></hr>

        <p className="text-md mb-1">
          Please enter your registered email address.
        </p>
        <input
          type="email"
          placeholder="Email address"
          className="sm:w-full w-4/5 focus:outline-none border border-gray-500 rounded-md px-2 py-2 mt-2 "
          autoFocus
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        ></input>
        <div className="flex justify-end mt-4">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold lg:py-1 lg:px-4 py-1 px-3 rounded mr-2"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold lg:py-1 lg:px-4 py-1 px-3 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
