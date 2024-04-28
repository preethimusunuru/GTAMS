import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi"; // Import icons from HeroIcons
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { resetPassword } from "../../Redux/authSlice";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const dispatch = useDispatch();
  const resetToken = useParams().resetToken;




  const handleCancel = () => {
    // Go back to the previous page
    navigate(-1);
  };

  const handleSubmit = async () => {
    // Handle submit logic here
    // You can perform further validation here if needed
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    // check the empty field
    if (!data.password || !data.resetToken) {
      toast.error("All fields are mandatory");
      return;
    }

    // password validation using regex
    if (!data.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)) {
      toast.error(
        "Minimum password length should be 8 with Uppercase, Lowercase, Number and Symbol"
      );
      return;
    }

    // calling the api to reset password
    const res = await dispatch(resetPassword(data));

    // redirecting to the login page
    if (res.payload.success) {
      navigate("/login");
    }

  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handlePasswordBlur = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!specialCharacters.test(password)) {
      setPasswordError("Password must contain special characters");
      return;
    }
    const lowercaseLetters = /[a-z]+/;
    if (!lowercaseLetters.test(password)) {
      setPasswordError("Password must contain lowercase letters");
      return;
    }
    const uppercaseLetters = /[A-Z]+/;
    if (!uppercaseLetters.test(password)) {
      setPasswordError("Password must contain uppercase letters");
      return;
    }
    setPasswordError("");
  };

  const handleConfirmPasswordBlur = () => {
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  return (
    <div className="flex justify-center container mx-auto items-center min-h-96 bg-slate-200">
      <div className="lg:m-10 lg:w-1/3 w-full lg:p-7 p-4 m-4 rounded-lg shadow-md bg-white">
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Set New Password
        </h1>
        <hr className="lg:mb-4 mb-3 border-t-1 border-gray-800 font-semibold"></hr>

        <p className="text-sm font-semibold">New Password</p>
        <div className="relative w-full focus:outline-none border border-gray-500 rounded-md px-2 py-2 mt-2">
          <input
            type={passwordVisible ? "text" : "password"}
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handlePasswordBlur}
            autoFocus
            className="focus:outline-none  w-11/12"
          />
          <span
            className="absolute top-3 right-3 text-gray-500"
            onClick={togglePasswordVisibility}
          >
            {passwordVisible ? <HiEyeOff /> : <HiEye />}
          </span>
        </div>
        {passwordError && (
          <span className="text-red-500 text-sm">{passwordError}</span>
        )}

        <p className="text-sm mt-4 font-semibold ">Confirm Password</p>
        <div className="relative w-full focus:outline-none border border-gray-500 rounded-md px-2 py-2 mt-2">
          <input
            type={confirmPasswordVisible ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={handleConfirmPasswordBlur}
            className="focus:outline-none w-11/12"
          />

          <span
            className="absolute top-3 right-3 text-gray-500"
            onClick={toggleConfirmPasswordVisibility}
          >
            {confirmPasswordVisible ? <HiEyeOff /> : <HiEye />}
          </span>
        </div>
        {confirmPasswordError && (
          <span className="text-red-500 text-sm">{confirmPasswordError}</span>
        )}

        <div className="flex justify-end mt-5">
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

export default ResetPassword;
