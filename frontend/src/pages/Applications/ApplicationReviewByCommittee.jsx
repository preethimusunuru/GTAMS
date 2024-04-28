import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiExternalLink } from "react-icons/fi";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import "./ApplicationReview.css";
import toast from "react-hot-toast";
import axiosInstance from "../../Helper/axiosInstance";

const ApplicationReviewByCommittee = () => {
  const { jobId } = useParams();

  const [forms, setForms] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructors, setInstructors] = useState([]);

  const navigate = useNavigate();
  const getForm = async () => {
    try {
      let res = axiosInstance.post(`form/getAllFormResponseByJobId/${jobId}`);

      // await toast.promise(res, {
      //   loading: "Loading responses...",
      //   success: (data) => {
      //     return data?.data?.message;
      //   },
      //   error: (data) => {
      //     return data?.response?.data.message;
      //   },
      // });
      res = await res;

      console.log("received from data", res.data);
      setForms(res.data.forms.filter((form) => form.status === "Forwarded"));
    } catch (error) {
      console.error("Error Fetching from.", error);
      toast.error("Error Fetching from.");
    }
  };

  const getInstructorList = async () => {
    try {
      let res = axiosInstance.post(`user/getInstructorList`);

      // await toast.promise(res, {
      //   loading: "Loading...",
      //   success: (data) => {
      //     return data?.data?.message;
      //   },
      //   error: (data) => {
      //     return data?.response?.data.message;
      //   },
      // });
      res = await res;

      console.log("received INS data", res.data);
      if ((await res).data.success) {
        setInstructors((await res).data.instructors);
      }
    } catch (error) {
      console.error("Error Fetching from.", error);
      toast.error("Error Fetching from.");
    }
  };

  const [selectedApplicantIndex, setSelectedApplicantIndex] = useState(0);

  const handleNextClick = () => {
    setSelectedApplicantIndex((prevIndex) =>
      prevIndex === null || prevIndex === forms.length - 1 ? 0 : prevIndex + 1
    );
    setSelectedInstructor(null);
  };

  const handleBackClick = () => {
    setSelectedApplicantIndex((prevIndex) =>
      prevIndex === null || prevIndex === 0 ? forms.length - 1 : prevIndex - 1
    );
    setSelectedInstructor(null);
  };

  const handleAccept = async (id) => {
    try {
      let res = axiosInstance.post(`/form/accept`, {
        id,
        instructor: selectedInstructor,
      });

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
        getForm();
        setSelectedInstructor(null);
      }
    } catch (error) {
      console.error("Error Accepting response", error);
      toast.error("Error Accepting response");
    }
  };

  const handleRejection = async (id) => {
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
        getForm();
        setSelectedInstructor(null);
      }
    } catch (error) {
      console.error("Error Rejecting response", error);
      toast.error("Error Rejecting response");
    }
  };

  const selectedApplicant =
    selectedApplicantIndex !== null ? forms[selectedApplicantIndex] : null;

  //date format
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "short", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    getForm();
    getInstructorList();
  }, [setForms]);

  return (
    <div className="p-2 items-center min-h-screen md:m-2 shadow-md rounded-sm border mt-4 ">
      <div className="flex justify-between font-semibold md:p-1 text-xs md:text-lg">
        <h1>
          Applications For Job id:{" "}
          <span className="bg-slate-200 px-2 rounded-md md:text-sm ">
            {jobId}
          </span>
        </h1>
        <h1>
          Total Recommended Applications:{" "}
          <span className="bg-slate-200 px-2 rounded-md  md:text-sm ">
            {forms.length}
          </span>
        </h1>
      </div>

      {/**main content to display begins here */}
      <div className="m-1 flex flex-col md:flex-row space-y-2 md:space-y-0 justify-center border rounded-md min-h-screen">
        {/* Section 1: Applicant Details */}
        <section className="w-full md:w-3/5">
          <h2 className="mt-2 font-semibold font-sans text-lg md:text-2xl text-center">
            Applicant Details
          </h2>
          {selectedApplicant ? (
            <div className="text-xs md:text-md overflow-x-auto overflow-y-auto mx-0.5 md:mx-2 px-1 md:px-2 min-h-screen scroll-smooth ">
              {/**below div will be hidden on small screens VISIBLE ON LARGE SCREEN */}
              <div className="md:block hidden mt-2 rounded-md shadow-md overflow-auto ">
                <table className="w-full rounded">
                  <thead>
                    <tr className="bg-gray-500 text-white">
                      <th className="p-0.5 md:p-2">Application ID</th>
                      <th className="p-0.5 md:p-2">Name</th>
                      <th className="p-0.5 md:p-2">Email</th>
                      <th className="p-0.5 md:p-2">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center">
                      <td className="p-0.5 md:p-2">
                        {selectedApplicant.formId}
                      </td>
                      <td className="p-0.5 md:p-2">
                        {selectedApplicant.applicantName}
                      </td>
                      <td className="p-0.5 md:p-2">
                        {selectedApplicant.email}
                      </td>
                      <td className="p-0.5 md:p-2">
                        {selectedApplicant.phone}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/**below div will be hidden on medium and larrge screens ....visible on SMALL SCREENS */}
              <div className="block md:hidden mt-2 rounded-md shadow-md overflow-auto md:max-h-56 min-h-28 max-h-56">
                <table className="w-full rounded">
                  <thead className="sticky top-0 bg-gray-500 text-white">
                    <tr>
                      <th className="p-0.5 md:p-3">Sr. No.</th>
                      <th className="p-0.5 md:p-3">Application ID</th>
                      <th className="p-0.5 md:p-3">Name</th>
                      <th className="p-0.5 md:p-3">Email</th>
                      <th className="p-0.5 md:p-3">Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forms.map((application, index) => (
                      <tr
                        key={index+1}
                        onClick={() => setSelectedApplicantIndex(index)}
                        className={`cursor-pointer hover:bg-gray-200 hover:text-blue-700  text-center ${
                          selectedApplicantIndex === index
                            ? "bg-gray-200 text-blue-700"
                            : ""
                        }`}
                      >
                        <td className="p-0.5 md:p-2">{index + 1}</td>
                        <td className="p-0.5 md:p-2">
                          {selectedApplicant.formId}
                        </td>
                        <td className="p-0.5 md:p-2">
                          {selectedApplicant.applicantName}
                        </td>
                        <td className="p-0.5 md:p-2">
                          {selectedApplicant.email}
                        </td>
                        <td className="p-0.5 md:p-2">
                          {selectedApplicant.phone}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/**show here previous experience if Any  */}

              <h2 className="mt-2 font-semibold font-sans text-lg md:text-2xl text-center">
                Previous Experience
              </h2>
              {selectedApplicant.previousExperience.length > 0 ? (
                <div className=" mt-2 rounded-md shadow-md overflow-auto md:max-h-56 min-h-28 max-h-56">
                  <table className="w-full rounded">
                    <thead className="sticky top-0 bg-gray-500 text-white">
                      <tr>
                        <th className="p-0.5 md:p-3">Sr. No.</th>
                        <th className="p-0.5 md:p-3">Course</th>
                        <th className="p-0.5 md:p-3">From </th>
                        <th className="p-0.5 md:p-3">To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedApplicant.previousExperience.map(
                        (exp, index) => (
                          <tr key={index} className={`  text-center `}>
                            <td className="p-0.5 md:p-2">{index + 1}</td>
                            <td className="p-0.5 md:p-2">{exp.course}</td>
                            <td className="p-0.5 md:p-2">
                              {formatDate(exp.fromDate)}
                            </td>
                            <td className="p-0.5 md:p-2">
                              {formatDate(exp.toDate)}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <h1 className="text-md p-2 md:text-lg font-semibold ">
                  No Previous Experience
                </h1>
              )}

              {/**back and next button on small screens */}
              <div className=" md:hidden flex justify-center  items-center my-4 gap-4">
                <button
                  onClick={handleBackClick}
                  className="bg-gray-200 text-gray-700 hover:text-white hover:bg-gray-500 font-semibold py-2 px-4 rounded-md"
                >
                  <GrFormPrevious />
                </button>
                {/**show current index of selected application */}
                <span className="">{`${selectedApplicantIndex + 1}/${
                  forms.length
                }`}</span>
                <button
                  onClick={handleNextClick}
                  className="bg-gray-200 text-gray-700 hover:text-white hover:bg-gray-500 py-2 px-4 rounded-md"
                >
                  <GrFormNext />
                </button>
              </div>

              {/**resume section */}
              <div className="flex flex-col justify-center  mt-4">
                <h2 className="flex justify-between font-semibold font-sans text-xl text-center mb-2">
                  Resume
                  <button
                    className="text-right text-blue-500 text-sm hover:bg-slate-200 rounded-md px-2 hover:underline"
                    onClick={() =>
                      window.open(
                        selectedApplicant.resume.cloudinaryUrl,
                        "_blank"
                      )
                    }
                  >
                    View in New Tab
                    <span className="ml-0.5 inline-block">
                      <FiExternalLink />
                    </span>
                  </button>
                </h2>
                <div className="text-center min-h-full border w-full mb-2 rounded-md shadow-md">
                  <iframe
                    title="Resume"
                    src={selectedApplicant.resume.cloudinaryUrl}
                    className="w-full h-52 md:h-96 cursor-move"
                  ></iframe>
                </div>
              </div>

              {/**visible on Small Screens only  */}
              {selectedApplicant && (
                <div className="mt-4 md:hidden">
                  <h1 className="text-lg mb-3 font-semibold">
                    Assign Instructor
                  </h1>
                  <div className="flex mb-4">
                    <div className="relative">
                      <select
                        value={selectedInstructor}
                        onChange={(e) => setSelectedInstructor(e.target.value)}
                        disabled={false}
                        className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                      >
                        <option value="">Select Instructor</option>
                        {instructors.map((ins) => (
                          <option key={ins._id} value={ins._id}>
                            {ins.fullName}({ins.department})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path
                          fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* buttons for rejection and recommendation */}
              <div className="flex justify-between md:mb-2 my-3 md:my-3 md:justify-end">
                {/**this back button will be visible on Small Screen */}
                <button
                  className=" md:hidden text-sm md:text-lg px-4 md:px-7 py-1 border  bg-slate-600  rounded-md hover:bg-slate-700 text-white border-none shadow-md cursor-pointer"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>

                <div className="flex justify-start  gap-4 ">
                  <button
                    className=" text-sm md:text-lg px-4 md:px-7 py-1 border  bg-green-500  rounded-md hover:bg-green-600 text-white border-none shadow-md cursor-pointer"
                    onClick={() => handleAccept(selectedApplicant._id)}
                    disabled={!selectedApplicant || !selectedInstructor}
                  >
                    Select
                  </button>

                  <button
                    className=" text-sm md:text-lg px-4 md:px-7 py-1 border bg-red-500 rounded-md hover:bg-red-600 text-white border-none shadow-md cursor-pointer"
                    onClick={() => handleRejection(selectedApplicant._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <h1 className="text-center text-3xl font-semibold my-5">
              No Application selected Yet!
            </h1>
          )}
        </section>

        {/* Section 2: Application List */}
        <section className="w-full md:w-2/5 bg-white md:block hidden px-4   relative">
          <div className="">
            <h2 className="m-2 font-semibold font-sans text-center text-lg md:text-2xl">
              Application List
            </h2>
            <div className="overflow-x-auto  rounded-md shadow-md min-h-full max-h-full mb-5 text-xs md:text-md">
              <table className="w-full ">
                <thead className="bg-gray-500 text-white sticky top-0">
                  <tr>
                    <th className="p-3 w-1/5">Sr. No.</th>
                    <th className="p-3 w-2/5">Applicant Name</th>
                    <th className="p-3 w-2/5">Application ID</th>
                  </tr>
                </thead>
              </table>
              <div className="shadow-md overflow-x-auto overflow-y-auto max-h-96 scroll-smooth scrollBar text-xs md:text-md">
                <table className="w-full ">
                  <tbody>
                    {forms.map((form, index) => (
                      <tr
                        key={form.formId}
                        onClick={() => setSelectedApplicantIndex(index)}
                        className={`text-center  cursor-pointer hover:bg-gray-200 hover:text-blue-700 font-semibold  ${
                          selectedApplicantIndex === index
                            ? "bg-gray-200 text-blue-700"
                            : ""
                        }`}
                      >
                        <td className="p-3 text-center  w-1/5">{index + 1}</td>
                        <td className="p-3 w-2/5">{form.applicantName}</td>
                        <td className="p-3 w-2/5">{form.formId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/**visible on medium and large screens ..dropdown to select teacher */}
          {/**got teacher objects having information dept, their name, courseid they teach...now filter based on dept */}

          {/**here comes two drop downs side by side one is for selecting courses and other for selecting instructors */}
          {/* Dropdowns for course and instructor */}
          {selectedApplicant && (
            <div className="mt-16">
              <h1 className="text-xl mb-2 font-semibold">Assign Instructor</h1>
              <div className="flex">
                <div className="relative">
                  <select
                    value={selectedInstructor}
                    onChange={(e) => setSelectedInstructor(e.target.value)}
                    disabled={false}
                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map((ins) => (
                      <option key={ins._id} value={ins._id}>
                        {ins.fullName} ({ins.department}) 
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* buttons for BACK */}
          <div className=" absolute bottom-2 right-4">
            <button
              className=" text-sm md:text-lg px-4 md:px-7 py-1 border  bg-slate-600  rounded-md hover:bg-slate-700 text-white border-none shadow-md cursor-pointer"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApplicationReviewByCommittee;
