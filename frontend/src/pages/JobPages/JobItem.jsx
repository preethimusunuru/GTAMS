import React from "react";

const JobItem = ({ job, handleSeeDetails }) => {
  return (
    <div className="bg-white shadow-md rounded-md p-6 text-sm transition duration-300 ease-in-out transform hover:scale-105">
      <h2 className="text-2xl font-semibold mb-2 truncate text-ellipsis">
        {job.title}
      </h2>
      <p className="mb-2 overflow-hidden truncate text-ellipsis">
        <strong>Course ID:</strong> {job.courseId}
      </p>
      <p className="mb-2 overflow-hidden truncate text-ellipsis">
        <strong>Requirements:</strong>{" "}
        {job.requiredSkills.length > 50
          ? `${job.requiredSkills.slice(0, 50)}...`
          : job.requiredSkills}
      </p>
      <p className="mb-2 overflow-hidden truncate text-ellipsis">
        <strong>Department:</strong> {job.department}
      </p>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-3"
        onClick={() => handleSeeDetails(job.jobId)}
      >
        See Details
      </button>
    </div>
  );
};

export default JobItem;
