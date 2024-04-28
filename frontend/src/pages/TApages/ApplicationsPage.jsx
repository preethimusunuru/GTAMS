import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";

const formatDate = (mongoTimestamp) => {
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Use 12-hour format
  };
  return new Date(mongoTimestamp).toLocaleDateString("en-US", options);
};

// const handleAccept = (jobId) => {
//   console.log("Accepted Offer for jobid", jobId);
// };

// const handleReject = (jobId) => {
//   console.log("Rejected Offer for jobid", jobId);
// };

const ApplicationsPage = () => {
  const userData = useSelector((state) => state?.auth?.data);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [activeTab, setActiveTab] = useState("submitted");

  const [jobs, setJobs] = useState([]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const getAllJobs = async () => {
    try {
      let res = axiosInstance.post("/application/getAllJobsByUserId");

      // await toast.promise(res, {
      //   loading: "Loading...",
      //   success: (data) => {
      //     console.log('data applicationpage', data.data);
      //     return data?.data?.message;
      //   },
      //   error: (data) => {
      //     return data?.data?.message;
      //   },
      // });

      res = await res;
      setJobs(res?.data?.applications);
      console.log("data received", res?.data?.applications);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  const [submitted, setSubmitted] = useState([]);
  const [archived, setArchived] = useState([]);

  useEffect(() => {
    setSubmitted(jobs.filter((job) => job.status === "Pending"));
    // console.log("submitted", submitted);
    setArchived(jobs.filter((job) => job.status !== "Pending"));
    // console.log("archived", archived);
  }, [jobs]);

  const handleViewApplication = (jobId) => {
    // Navigate to the new route with jobId as route parameter
    navigate(`/applications/${jobId}`);
  };

  return (
    <div className="md:m-8 m-2">
      <h1 className="text-3xl font-bold px-5 py-3  text-gray-800">
        Hello, {userData.fullName.toUpperCase()}!{" "}
      </h1>
      <section className="m-6 p-4 pb-20 rounded-xl border-gray-300 shadow-md">
        <h1 className="text-2xl font-semibold font-sans text-gray-800">
          Help Us Get to Know You
        </h1>

        <p className="text-gray-700 mt-3 ">
          Your profile not only helps you apply to jobs quickly but also helps
          our team know what type of jobs you are looking for.
        </p>
        <NavLink
          to="/profile"
          className="mt-4 inline-block px-6 py-2 bg-green-500 text-white font-semibold rounded-md shadow-sm hover:bg-green-600 transition duration-300"
        >
          View Your Profile
        </NavLink>
      </section>
      <section className="m-6 p-4 pb-20 rounded-xl border-gray-300 shadow-md">
        <h1 className="mt-2 text-2xl font-semibold text-gray-800">
          Applications
        </h1>
        <div className="flex mt-4">
          <button
            className={`mr-2 px-4 py-2  ${
              activeTab === "submitted"
                ? "bg-blue-500 text-white font-semibold "
                : "bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition duration-100"
            }`}
            onClick={() => handleTabChange("submitted")}
          >
            Submitted <span>({submitted.length})</span>
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "archived"
                ? "bg-blue-500 text-white font-semibold"
                : "bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition duration-100"
            }`}
            onClick={() => handleTabChange("archived")}
          >
            Archived <span>({archived.length})</span>
          </button>
        </div>
        <hr className="my-1 border-gray-400" /> {/* Horizontal line */}
        {/* Render content based on activeTab */}
        {activeTab === "submitted" && (
          <div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2">
              {submitted.length > 0 ? (
                submitted.map((job) => {
                  return (
                    <div
                      className="m-4 p-4 border  border-gray-100 rounded-lg text-gray-700 shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                      key={job.formId}
                    >
                      <h1 className="font-semibold text-xl">{job.title}</h1>
                      <h3>Job Id : {job.jobId}</h3>
                      <h3>
                        Applied on:{" "}
                        <span className="ml-2">
                          {formatDate(job.appliedDate)}
                        </span>
                      </h3>
                      <h3>
                        Status:{" "}
                        <span
                          className={`rounded-lg text-sm px-2 py-0.5 font-mono font-semibold ${
                            job.status === "Pending"
                              ? "bg-slate-100 text-gray-700"
                              : job.status === "Accepted"
                              ? "bg-green-600 text-white"
                              : job.status === "Forwarded"
                              ? "bg-yellow-400 text-white"
                              : ""
                          }`}
                        >
                          {job.status}
                        </span>
                      </h3>

                      <button
                        className="mt-10 text-blue-600 font-semibold text-sm hover:bg-slate-100 px-3 py-2 rounded-md"
                        onClick={() => handleViewApplication(job.jobId)} // Call handleViewApplication with jobId
                      >
                        View application
                      </button>
                    </div>
                  );
                })
              ) : (
                <div>No application to show.</div>
              )}
            </div>
          </div>
        )}
        {/*****ARCHIVED SECTIONS OF APPLICATIONS */}
        {activeTab === "archived" && (
          <div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2">
              {archived.length > 0 ? (
                archived.map((job) => {
                  return (
                    <div
                    className="m-4 p-4 border  border-gray-100 rounded-lg text-gray-700 shadow-md transition duration-300 ease-in-out transform hover:scale-105"

                      key={job.formId}
                    >
                      <h1 className="font-semibold text-xl">{job.title}</h1>
                      <h3>Job Id : {job.jobId}</h3>
                      <h3>
                        Applied on:{" "}
                        <span className="ml-2">
                          {formatDate(job.appliedDate)}
                        </span>
                      </h3>
                      <h3>
                        Status:{" "}
                        <span
                          className={`rounded-lg text-sm px-2 py-0.5 font-mono font-semibold ${
                            job.status === "Offer Pending"
                              ? "bg-orange-400 text-white"
                              : job.status === "Offer Accepted"
                              ? "bg-green-600 text-white"
                              : job.status === "TA Assigned"
                              ? "bg-green-600 text-white"
                              : job.status === "Forwarded"
                              ? "bg-yellow-400 text-white"
                              : job.status === "Offer Rejected"
                              ? "bg-gray-400 text-white"
                              : "bg-slate-100 text-gray-700" // This empty string is for cases where job.status doesn't match any condition
                          }`}
                        >
                          {job.status}
                        </span>
                      </h3>

                      <button
                        className="mt-10 text-blue-600 font-semibold text-sm hover:bg-slate-100 px-3 py-2 rounded-md"
                        onClick={() => handleViewApplication(job.jobId)} // Call handleViewApplication with jobId
                      >
                        View application
                      </button>
                    </div>
                  );
                })
              ) : (
                <div>No application to show.</div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default ApplicationsPage;
