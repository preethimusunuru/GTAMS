import React from "react";

const WorkSummary = ({ heading, tasks }) => {
  return (
    <div className="mt-6">
      <h3 className="font-semibold md:text-2xl mb-4 text-xl">{heading}</h3>
      <div className="border  rounded-t-lg text-sm md:text-md overflow-x-auto ">
        <table className="border-collapse w-full md:text-md text-sm overflow-x-auto ">
          <thead>
            <tr>
              <th className="bg-gray-600 text-white py-.5 md:py-2  text-center ">
                Sr.No.
              </th>
              <th className="bg-gray-600 text-white py-.5 md:py-2  text-center px-4">
                Task
              </th>
              <th className="bg-gray-600 text-white py-.5 md:py-2  text-center">
                Rating(10)
              </th>
              <th className="bg-gray-600 text-white py-.5 md:py-2  text-center px-4">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td className="border py-2  px-1 ">{index + 1}</td>
                <td className="border py-2 px-4 w-1/2">{task.task}</td>
                <td className="border py-2 text-center">{task.rating}</td>
                <td className="border py-2  px-4">{task.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkSummary;
