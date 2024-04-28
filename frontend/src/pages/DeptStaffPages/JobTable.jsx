import React from "react";
import JobRow from "./JobRow";

const JobTable = ({
  filteredJobs,
  handleDeleteJob,
  handleEditJob,
  handleViewJob,
  handleInvite,
}) => {
  return (
    <div className="max-h-screen min-h-96 p-5 rounded-lg shadow-lg bg-white mt-6 ">
      <h2 className="font-semibold text-xl md:text-2xl mt-3 mb-2">Initial Job List</h2>
      <div className=" rounded-md hover:shadow-md text-sm overflow-x-auto  ">
        {filteredJobs.length > 0 ? (
          <table className="w-full table-auto border-collapse border-gray-300">
            <thead className="text-sm lg:text-lg">
              <tr className="bg-gray-600 text-white">
                <th className="px-4  lg:py-2">SN</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Job ID</th>
                <th className="px-4 py-2">Course ID</th>
                <th className="px-4 py-2">Departments</th>
                <th className="px-4 py-2">Requirements</th>
                <th className="px-4 py-2">Open</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job, index) => (
                <JobRow
                  key={job._id}
                  index={index}
                  job={job}
                  handleDeleteJob={handleDeleteJob}
                  handleEditJob={handleEditJob}
                  handleViewJob={handleViewJob}
                  handleInvite={handleInvite}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <div className="font-semibold text-3xl">No jobs to show.</div>
        )}
      </div>
    </div>
  );
};

export default JobTable;
