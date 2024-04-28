import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../Redux/authSlice";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // function to login
  const handleLogin = async (event) => {
    event.preventDefault();

    // checking the empty fields
    if (!formData.email || !formData.password) {
      toast.error("Please fill all the fields");
      return;
    }

    // calling login action
    const res = await dispatch(login(formData));

    // redirect to home page if true
    if (res?.payload?.success) navigate("/");

    // clearing the login inputs
    setFormData({
      email: "",
      password: "",
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="current-password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-gray-700 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
        <p className="text-gray-700 mt-4 text-center">
          <Link to="/forget-password" className="text-blue-600 hover:underline">
            Forgotten account?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
