import React from "react";
import { useParams } from "react-router-dom";

const EmailVerificationPage = () => {
  const { emailPrefix } = useParams();

  return (
    <div className="relative flex min-h-screen  justify-center overflow-hidden py-2 sm:py-5 bg-white">
      <div className="max-w-xl px-5 text-center  ">
        <h2 className="mb-2 lg:text-3xl text-2xl font-bold text-gray-800 mt-20">
          Email Verification
        </h2>

        <p className="mb-2 lg:text-lg text-md text-gray-500">
          We've sent a verification link to <span className="font-bold italic">{emailPrefix}@***.com.</span>
        </p>
        <p className="mb-2 lg:text-lg md:text-md text-gray-500">
          Please check your inbox and follow the instructions to verify your
          email address.
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
