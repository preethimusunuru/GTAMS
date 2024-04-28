import React, { useState } from "react";
import axiosInstance from '../../Helper/axiosInstance.js';
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const { name, email, message } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    let res = axiosInstance.post('/contact', formData)

    await toast.promise(res, {
      loading: "Sending...",
      success: (data) => {
        console.log('data', data.data);
        return data?.data?.message;
      },
      error: (data) => {
        return data?.data?.message;
      },
    });

    res = await res;
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="mx-auto px-4 py-8 flex justify-center bg-slate-50 ">
    <div className="lg:w-5/12 w-full py-8 lg:px-10 px-6 mx-10 shadow-md bg-white rounded-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
      <form onSubmit={onSubmit} className="max-w-md mx-auto space-y-4">
        <div>
          <label htmlFor="name" className="block text-md font-medium text-gray-800 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-md font-medium text-gray-800 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-md font-medium text-gray-800 mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={onChange}
            required
            rows="5"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
    </div>
  );
};

export default ContactPage;
