// import React, { useEffect, useState } from "react";
// import { FaSearch } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../../Helper/axiosInstance";
// import toast from "react-hot-toast";

// // import jobs from "./jobsData";
// const JobPage = () => {
//   // State for search query
//   const [searchQuery, setSearchQuery] = useState("");
//   const [jobs, setJobs] = useState([]);
//   const navigate = useNavigate();

//   // Function to handle search input change
//   const handleSearchInputChange = (e) => {
//     setSearchQuery(e.target.value);
//   };

//   // Function to filter job listings based on search query
//   const filteredJobs = jobs.filter((job) => {
//     return (
//       job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       job.courseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       job.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       job.department.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   });

//   const getAllJobs = async () => {
//     let res = axiosInstance.post("/application/getAllJobs");

//     await toast.promise(res, {
//       loading: "Loading...",
//       success: (data) => {
//         // console.log(data.data);
//         return data?.data?.message;
//       },
//       error: (data) => {
//         return data?.data?.message;
//       },
//     });

//     res = await res;

//     // console.log(res.data.jobs);
//     setJobs(res.data.jobs);
//   };

//   useEffect(() => {
//     getAllJobs();
//   }, []);

//   //   Function to handle click on "See Details" button
//   const handleSeeDetails = (jobId) => {
//     // Code to show full details of the job with jobId
//     // console.log("See Details clicked for job with ID:", jobId);
//     navigate("/job_details/" + jobId);
//   };

//   return jobs.length > 0 ? (
//     <div className="min-h-screen mx-auto px-4 p-4">
//       <h1 className="text-3xl font-bold mb-4">Job Listings</h1>

//       <div className="relative mb-4">
//         <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search by title, course, instructor, or department"
//           value={searchQuery}
//           onChange={handleSearchInputChange}
//           className="border border-gray-300 rounded px-4 py-2 pl-10 w-full"
//           autoFocus
//         />
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
//         {filteredJobs.map((job) => (
//           <div
//             key={job._id}
//             className="bg-white shadow-md rounded-md p-6 text-sm transition duration-300 ease-in-out transform hover:scale-105"
//           >
//             <h2 className="text-2xl font-semibold mb-2 truncate text-ellipsis">
//               {job.title}
//             </h2>
//             <p className="mb-2 overflow-hidden truncate text-ellipsis">
//               <strong>Course ID:</strong> {job.courseId}
//             </p>
//             {/*<p className="mb-2 overflow-hidden truncate text-ellipsis">
//               <strong>Instructor:</strong> {job.instructor}
//         </p>*/}
//             <p className="mb-2 overflow-hidden truncate text-ellipsis">
//               <strong>Requirements:</strong>{" "}
//               {job.requiredSkills.length > 50
//                 ? `${job.requiredSkills.slice(0, 50)}...`
//                 : job.requiredSkills}
//             </p>
//             <p className="mb-2 overflow-hidden truncate text-ellipsis">
//               <strong>Department:</strong> {job.department}
//             </p>

//             <button
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-3"
//               onClick={() => handleSeeDetails(job.jobId)}
//             >
//               See Details
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   ) : (
//     <div className="border rounded-md hover:shadow-md text-3xl overflow-x-auto mt-10 min-h-screen">
//       No Jobs to show
//     </div>
//   );
// };

// export default JobPage;

// JobPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";
import JobList from "./JobList";
import SearchInput from "./SearchInput";

const JobPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const getAllJobs = async () => {
    let res = axiosInstance.post("/application/getAllJobs");

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

    setJobs(res.data.jobs);
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  const handleSeeDetails = (jobId) => {
    navigate("/job_details/" + jobId);
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.courseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen p-3 md:p-8 bg-slate-50">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h1 className="text-xl md:text-3xl font-semibold mb-4">Job Listings</h1>
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearchInputChange={handleSearchInputChange}
        />
      </div>
      <div className="max-h-screen min-h-96 p-5 rounded-lg shadow-lg bg-white mt-6 ">
        {jobs.length > 0 ? (
          <JobList
            filteredJobs={filteredJobs}
            handleSeeDetails={handleSeeDetails}
          />
        ) : (
          <div className="border rounded-md hover:shadow-md text-3xl overflow-x-auto mt-10 min-h-screen">
            No Jobs to show
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPage;
