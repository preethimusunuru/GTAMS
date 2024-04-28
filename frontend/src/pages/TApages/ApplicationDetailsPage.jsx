import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";
import {
  FaUser,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaCalendarAlt,
} from "react-icons/fa";

//date format
const formatDate = (dateString) => {
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true, // Use 12-hour format
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Function to convert bytes to kilobytes
const bytesToKB = (bytes) => {
  return (bytes / 1024).toFixed(2); // Convert bytes to KB and round to 2 decimal places
};

const ApplicationDetailsPage = () => {
  const { jobId } = useParams(); // Get jobId from route parameters
  const [application, setApplication] = useState(null);
  const [jobTitle, setJobTitle] = useState("");

  const getApplicationDetails = async () => {
    // console.log("hi hi hui");
    try {
      let res = axiosInstance.post(`/form/getUserFormResponseByJobId/${jobId}`);
      // await toast.promise(res, {
      //   loading: "Loading...",
      //   success: (data) => {
      //     return data?.data?.message;
      //   },
      //   error: (data) => {
      //     return data?.data?.message;
      //   },
      // });

      res = await res;
      console.log("form response", res.data);

      setApplication(res.data.form);
      setJobTitle((await res).data.jobTitle);
    } catch (error) {
      toast.error("Failed to fetch application details");
    }
  };

  // Function to handle accepting the offer
  const handleAccept = async (id) => {
    try {
      let res = axiosInstance.post(`/form/accept-ta`, { id });

      await toast.promise(res, {
        loading: "Accepting...",
        success: (data) => {
          return data?.data?.message;
        },
        error: (data) => {
          return data?.response?.data.message;
        },
      });
      res = await res;
      if ((await res).data.success) {
        getApplicationDetails();
      }
    } catch (error) {
      console.error("Error Accepting", error);
      toast.error("Error Accepting");
    }
  };

  // Function to handle rejecting the offer
  const handleReject = async (id) => {
    try {
      let res = axiosInstance.post(`/form/rejectFromByFormId`, { id });

      await toast.promise(res, {
        loading: "Rejecting...",
        success: (data) => {
          return data?.data?.message;
        },
        error: (data) => {
          return data?.response?.data.message;
        },
      });
      res = await res;
      if ((await res).data.success) {
        getApplicationDetails();
      }
    } catch (error) {
      console.error("Error Rejecting", error);
      toast.error("Error Rejecting");
    }
  };

  useEffect(() => {
    getApplicationDetails();
  }, []);
  if (!application) {
    return <div>Loading...</div>;
  }

  return (
    <div className="md:m-4 m-2">
      <h1 className="text-lg md:text-3xl font-bold px-5 py-3 text-gray-800">
        Application Details
      </h1>
      <div className="p-3 md:p-6">
        {/* Personal Details */}
        <div className="md:mb-4 mb-1 shadow-md rounded-lg p-4 md:p-6  ">
          <div className="flex items-center mb-3">
            <FaUser className="mr-2" size={20} />
            <p className="lg:text-2xl text-lg font-semibold">
              Personal Details
            </p>
          </div>

          <table className="w-full md:text-lg text-base">
            <tbody>
              <tr className="mb-2 sm:mb-1">
                <td className="font-semibold">Applicant Name:</td>
                <td>{application.applicantName}</td>
              </tr>
              <tr className="mb-2 sm:mb-1">
                <td className="font-semibold">Email:</td>
                <td>{application.email}</td>
              </tr>
              <tr className="mb-2 sm:mb-1">
                <td className="font-semibold">Gender:</td>
                <td>{application.gender}</td>
              </tr>
              <tr className="mb-2 sm:mb-1">
                <td className="font-semibold">Contact:</td>
                <td>{application.phone}</td>
              </tr>
              <tr className="mb-2 sm:mb-1">
                <td className="font-semibold align-top">Address:</td>
                <td>{application.address}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Applied Job Details */}
        <div className="md:mb-2 mb-1 shadow-md rounded-lg p-4 md:p-6">
          <div className="flex items-center mb-3">
            <FaBriefcase className="mr-2" size={20} />
            <p className="lg:text-2xl text-lg font-semibold">
              Applied Job Details
            </p>
          </div>

          <table className="w-full md:text-lg text-base">
            <tbody>
              <tr className="mb-2 sm:mb-1">
                <td className="font-semibold">Job ID:</td>
                <td>{jobId}</td>
              </tr>
              <tr className="mb-2 sm:mb-1">
                <td className="font-semibold">Job Title:</td>
                <td>{jobTitle}</td>
              </tr>
              <tr className="mb-2 sm:mb-1">
                <td className="font-semibold">Department:</td>
                <td>{application.department}</td>
              </tr>
              <tr className="mb-2 sm:mb-1">
                <td className="font-semibold">Course ID:</td>
                <td>{application.courseId}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Status and Applied Date */}
        <div className="md:mb-4 mb-2  shadow-md rounded-lg p-4 md:p-6">
          <div className="flex items-center md:mb-3">
            <FaCheckCircle className="mr-2" size={20} />
            <p className="lg:text-2xl text-lg font-semibold">Status</p>
          </div>

          <p
            className={`text-sm sm:text-base font-mono inline-block px-2 rounded-full ${
              application.status === "Offer Pending"
                ? "bg-orange-400 text-white"
                : application.status === "Offer Accepted"
                ? "bg-green-600 text-white"
                : application.status === "TA Assigned"
                ? "bg-green-600 text-white"
                : application.status === "Forwarded"
                ? "bg-yellow-400 text-white"
                : application.status === "Offer Rejected"
                ? "bg-gray-400 text-white"
                : "bg-slate-100 text-gray-700" // This empty string is for cases where job.status doesn't match any condition
            }`}
          >
            {application.status}
          </p>

          <div className="flex items-center mt-3">
            <FaCalendarAlt className="mr-2" size={20} />
            <p className="lg:text-2xl text-lg font-semibold">Applied Date</p>
          </div>
          <p className="p-2">{formatDate(application.appliedDate)}</p>
          {/* Add your applied date here */}
        </div>

        {/* Accept and Reject Buttons */}
        {application.status == "Offer Pending" && (
          <div className="md:mb-4 mb-2  shadow-md rounded-lg p-4 md:p-6">
            <div className="flex items-center mb-3">
              <FaCheckCircle className="mr-2" size={20} />
              <p className="lg:text-2xl text-lg font-semibold">Confirmation</p>
            </div>
            <p className={`text-lg sm:text-base text-gray-600 `}>
              You have been selected. Please confirm your acceptance for the
              above job.
            </p>
            <div className="flex justify-start mt-4  gap-4">
              <button
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                onClick={() => handleAccept(application._id)}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={() => handleReject(application._id)}
              >
                Reject
              </button>
            </div>
          </div>
        )}

        {/* Previous Experience */}
        <div className="md:mb-2 mb-1 shadow-md rounded-lg p-4 md:p-6">
          <div className="flex items-center mb-3">
            <FaBriefcase className="mr-2" size={20} />
            <p className="lg:text-2xl text-lg font-semibold">
              Previous Experience
            </p>
          </div>

          {application.previousExperience.length > 0 ? (
            <div className="rounded-t-lg  overflow-x-auto">
              <table className="w-full md:text-lg text-base border-collapse border rounded-lg">
                <thead>
                  <tr className="bg-gray-600 text-white rounded-lg">
                    <th className="font-semibold p-1 border">Course Name</th>
                    <th className="font-semibold p-1 border">From Date</th>
                    <th className="font-semibold p-1 border">To Date</th>
                  </tr>
                </thead>
                <tbody>
                  {application.previousExperience.map((exp, index) => (
                    <tr
                      key={index}
                      className="mb-1 sm:mb-0 text-center text-md"
                    >
                      <td className="p-1 border">{exp.course}</td>
                      <td className="p-1 border">{formatDate(exp.fromDate)}</td>
                      <td className="p-1 border">{formatDate(exp.toDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="font-semibold">No previous experience.</p>
          )}
        </div>

        {/* Resume */}
        <div className=" mb-2 md:mb-4   shadow-md rounded-lg p-4 md:p-6">
          <div className="flex items-center mb-3">
            <FaFileAlt className="mr-2" size={20} />
            <p className="lg:text-2xl text-lg font-semibold">Resume</p>
          </div>

          <table className="w-full md:text-lg text-base">
            <tbody>
              <tr className="md:mb-2 mb-1">
                <td className="font-semibold">File Name:</td>
                <td>
                  <a
                    href={application.resume.cloudinaryUrl}
                    target="_blank"
                    className="hover:underline text-blue-500"
                  >
                    {application.resume.fileName}
                  </a>
                </td>
              </tr>
              <tr className="md:mb-2 mb-1">
                <td className="font-semibold">Size:</td>
                <td>{bytesToKB(application.resume.size)} KB</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
