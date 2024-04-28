import React from "react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">About Us</h1>
        <div className="space-y-6 text-gray-600">
          <p>
            Welcome to the Graduate Teaching Assistant Management System (GTAMS),
            a platform designed to streamline the management of teaching
            assistant positions in educational institutions.
          </p>
          <p>
            GTAMS aims to simplify the process of hiring, assigning, and managing
            teaching assistant roles across various departments and courses.
          </p>
          <p>
            Developed by Florida Atlantic University, GTAMS leverages cutting-edge
            technology to optimize the efficiency and effectiveness of teaching
            assistant programs.
          </p>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              About Florida Atlantic University
            </h2>
            <p>
              Florida Atlantic University is a leading institution dedicated to
              innovation and excellence in education. With a commitment to
              fostering academic growth and research, Florida Atlantic University
              prepares students for success in their chosen fields.
            </p>
            <p className="mt-4">
              Located in the heart of Boca Raton, FAU offers a
              diverse range of programs and resources to support student learning
              and development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;