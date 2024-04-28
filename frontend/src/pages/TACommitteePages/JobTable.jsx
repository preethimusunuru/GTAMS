import React from "react";

const JobTable = ({ filteredJobs, handleViewJob }) => {
  return (
    <div className="max-h-screen min-h-96 p-5 rounded-lg shadow-lg bg-white mt-6 ">
      <h2 className="font-semibold text-xl md:text-2xl mt-3 mb-2">
        Recommended Job List
      </h2>
      <div className=" rounded-md hover:shadow-md text-sm overflow-x-auto  ">
        {filteredJobs.length > 0 ? (
          <table className="w-full table-auto border-collapse border-gray-300">
            <thead className="text-sm lg:text-lg">
              <tr className="bg-gray-600 text-white">
                <th className="px-4 lg:py-2">SN</th>
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
                <tr key={job._id}>
                  <td className="text-sm border px-4 lg:py-2 truncate w-40 max-w-10">
                    {index + 1}
                  </td>
                  <td className="text-sm border px-4 py-2 truncate w-40 max-w-60">
                    {job.title}
                  </td>
                  <td className="text-sm border px-4 py-2 truncate w-40 max-w-40">
                    {job.jobId}
                  </td>
                  <td className="text-sm border px-4 py-2 truncate w-40 max-w-40">
                    {job.courseId}
                  </td>
                  <td className="text-sm border px-4 py-2 truncate w-40 max-w-40">
                    {job.department}
                  </td>
                  <td className="text-sm border px-4 py-2 truncate w-40 max-w-80">
                    {job.requiredSkills}
                  </td>
                  <td className="text-sm border px-4 py-2 text-center w-40 max-w-20">
                    {job.isApplicationOpen ? "Yes" : "No"}
                  </td>
                  <td className="border px-2 text-sm text-center py-2 w-40 max-w-48">
                    <div className="flex justify-evenly max-w-50 items-center">
                      <button
                        className="text-blue-600 m-1 p-1 rounded hover:underline hover:text-blue-600 font-semibold "
                        onClick={() => handleViewJob(job.jobId)}
                        title="View Applications"
                      >
                        See
                      </button>
                    </div>
                  </td>
                </tr>
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
