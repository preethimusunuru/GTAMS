import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Helper/axiosInstance.js";

const JobDetailPage = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();

  const [job, setJob] = useState();

  const getApplicationByJobId = async () => {
    let res = axiosInstance.post(`/application/getApplicationById/${jobId}`);
    console.log(res.data);

    // await toast.promise(res, {
    //   loading: "Loading...",
    //   success: (data) => {
    //     console.log("data", data.data);
    //     return data?.data?.message;
    //   },
    //   error: (data) => {
    //     return data?.data?.message;
    //   },
    // });

    res = await res;

    if (res.data.success) {
      setJob(res.data.application);
    } else {
      console.log("error in fetching job");
    }
  };

  useEffect(() => {
    getApplicationByJobId();
  }, [jobId]);

  if (!job) {
    return <div>Job not found</div>;
  }

  const handleApply = () => {
    // toast.success(`Applied for job:${job.title}`);
    // console.log("Applying for job:", job.title);
    navigate(`/job/job-apply/${jobId}`);
  };

  return (
    <div className=" lg:mx-auto bg-slate-200 min-h-screen flex flex-col items-center">
      <h1 className="lg:text-3xl font-bold mb-4 text-center mt-3 sm:text-md">
        Job Details
      </h1>
      <div className="bg-white shadow-md rounded-md p-6 lg:m-4 m-12 mx-20 min-h-96 lg:w-1/2 w-11/12 sm:m-10">
        <table className="w-full border-separate lg:border-spacing-y-4  border-spacing-y-2  ">
          <tbody>
            <tr className="">
              <td className="font-semibold mb-2 px-3 text-pretty align-top">
                Title
              </td>
              <td className="mb-2 text-pretty">{job.title}</td>
            </tr>
            <tr className="">
              <td className="font-semibold mb-2 px-3 text-pretty align-top">
                Course ID
              </td>
              <td className="mb-2 text-pretty">{job.courseId}</td>
            </tr>
            {/*<tr className="mb-4">
              <td className="font-semibold mb-2 px-3 text-pretty align-top">
                Instructor
              </td>
              <td className="mb-2 text-pretty">{job.instructor}</td>
  </tr>*/}
            <tr className="mb-4">
              <td className="font-semibold mb-2 px-3 text-pretty align-top">
                Department
              </td>
              <td className="mb-2 text-pretty">{job.department}</td>
            </tr>
            <tr className="mb-4">
              <td className="font-semibold mb-2 px-3 text-pretty align-top">
                Requirements
              </td>
              <td className="mb-2 text-pretty">{job.requiredSkills}</td>
            </tr>
          </tbody>
        </table>
        <div className="p-3 mt-3">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
            onClick={handleApply}
          >
            Apply
          </button>
          <Link
            to="/job"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Back
          </Link>
        </div>
        {/* <div className="mt-2 p-3">
          <h3 className="text-lg font-semibold mb-2">Attached Documents</h3>
          <ul>
            <li>
              <a
                href="/path/to/pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:underline"
              >
                Sample PDF
              </a>
            </li>
          </ul>
  </div>*/}
      </div>
    </div>
  );
};

export default JobDetailPage;
