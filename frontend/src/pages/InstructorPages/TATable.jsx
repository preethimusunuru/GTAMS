import React from "react";

const TATable = ({ filteredTAs, viewTADetails }) => {
  return (
    <div className="max-h-screen min-h-96 p-5 rounded-lg shadow-lg bg-white mt-6 ">
      <h2 className="font-semibold text-xl md:text-2xl mt-3 mb-2">
        Teaching Assistants
      </h2>
      <div className="overflow-auto text-sm md:text-lg rounded-t-lg hover:shadow-md">
        {/*  table data */}
        <table className="w-full border-collapse border border-gray-300 overflow-auto ">
          <thead className="text-sm lg:text-lg">
            <tr className="bg-gray-600 text-white">
              <th className="border border-gray-300 px-2 py-2 w-1/12">ID</th>
              <th className="border border-gray-300 px-4 py-2 w-1/6">Name</th>
              <th className="border border-gray-300 px-4 py-2 w-1/6">
                Course ID
              </th>
              <th className="border border-gray-300 px-4 py-2 w-2/6">
                Course Name
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/6">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTAs.length > 0 ? (
              filteredTAs.map((obj, index) => (
                <tr key={obj._id}>
                  <td className="border border-gray-300 px-4 py-2 text-center w-1/12">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center w-1/6">
                    {obj.ta?.fullName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center w-1/6">
                    {obj.course?.courseId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center w-2/6">
                    {obj.course?.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center w-1/6">
                    <button
                      onClick={() => viewTADetails(obj)}
                      className="font-semibold text-blue-600 p-2 rounded-md hover:underline text-center"
                    >
                      <span className="hidden md:block">View Details</span>
                      <span className="md:hidden">View</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  No Teaching assistant to show.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TATable;
