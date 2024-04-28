import React from "react";
import { FaTrashAlt, FaPencilAlt, FaEye } from "react-icons/fa";
import { TbMailPlus } from "react-icons/tb";

const JobRow = ({
  index,
  job,
  handleDeleteJob,
  handleEditJob,
  handleViewJob,
  handleInvite,
}) => {
  return (
    <tr>
      <td className="text-sm  border px-4 lg:py-2 truncate w-40 max-w-10">
        {index + 1}
      </td>
      <td className=" text-sm  border px-4 py-2 truncate w-40 max-w-60">
        {job.title}
      </td>
      <td className="text-sm  border px-4 py-2 truncate w-40 max-w-40">
        {job.jobId}
      </td>
      <td className="text-sm  border px-4 py-2 truncate w-40 max-w-40">
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
      <td className="border px-2 text-sm  text-center py-2 w-40 max-w-48">
        <div className="flex justify-evenly max-w-50 items-center">
          <button
            className="text-red-600 m-1 p-1 rounded hover:bg-red-600 hover:text-white "
            onClick={() => handleDeleteJob(job._id)}
            title="Delete"
          >
            <FaTrashAlt size={10} />
          </button>
          <button
            className="text-black m-1 p-1 rounded hover:bg-gray-500 hover:text-white "
            onClick={() => handleEditJob(job.jobId)}
            title="Edit"
          >
            <FaPencilAlt size={10} />
          </button>
          <button
            className="text-blue-600 m-1 p-1 rounded hover:bg-blue-600 hover:text-white "
            onClick={() => handleViewJob(job.jobId)}
            title="View Applications"
          >
            <FaEye size={10} />
          </button>
          <button
            className="text-blue-600 m-1 p-1 rounded hover:bg-blue-600 hover:text-white "
            onClick={() => handleInvite(job.jobId)}
            title="Invite"
          >
            <TbMailPlus size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default JobRow;
