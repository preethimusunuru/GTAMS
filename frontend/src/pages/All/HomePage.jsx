import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const HomePage = () => {
  const isLoggedIn = useSelector((state) => state?.auth?.isLoggedIn);
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto flex justify-center items-center px-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Graduate Teaching Assistant Management System
          </h1>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <section className="text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Streamline TA Application and Assignment Processes
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Welcome to the Graduate Teaching Assistant Management System. Our
              platform simplifies the process of managing TA applications,
              course assignments, and performance evaluations.
            </p>
            {!isLoggedIn && (
              <Link
                to="/login"
                className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
              >
                Get Started
              </Link>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
