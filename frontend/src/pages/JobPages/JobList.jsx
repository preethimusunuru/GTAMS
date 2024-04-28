import React from "react";
import JobItem from "./JobItem";

const JobList = ({ filteredJobs, handleSeeDetails }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
      {filteredJobs.map((job) => (
        <JobItem key={job._id} job={job} handleSeeDetails={handleSeeDetails} />
      ))}
    </div>
  );
};

export default JobList;
