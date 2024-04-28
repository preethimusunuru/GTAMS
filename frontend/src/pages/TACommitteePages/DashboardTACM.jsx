
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import SearchInput from "./SearchInput";
import JobTable from "./JobTable";
import axiosInstance from "../../Helper/axiosInstance";

const DashboardTACM = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);

  const getAllJobs = async () => {
    try {
      const res = await axiosInstance.post("/application/getAllJobs");
      if (res.data?.success) {
        // toast.success("Application Fetched.");
        setJobs(res.data.jobs);
      } else {
        toast.error("Error in fetch.");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast.error("Error fetching jobs.");
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  const handleViewJob = (jobId) => {
    navigate(`/tacm-dashboard/application-review-by-committee/${jobId}`);
    // Handle view job functionality
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job._id.toString().includes(searchQuery) ||
      job.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.courseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-3 md:p-8 bg-slate-50">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h1 className=" text-xl md:text-3xl md:text-medium font-semibold  mb-4 ">
          TACM Dashboard
        </h1>
        <div className="w-full flex justify-between items-center mb-4">
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </div>
      <JobTable filteredJobs={filteredJobs} handleViewJob={handleViewJob} />
    </div>
  );
};

export default DashboardTACM;
