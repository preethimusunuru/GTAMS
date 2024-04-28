import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash } from "react-icons/fa"; // Importing React Icons
import toast from "react-hot-toast";
import axiosInstance from "../../Helper/axiosInstance";

const CourseCreation = () => {
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    courseId: "",
    department: "",
  });
  const [searchTerm, setSearchTerm] = useState(""); // Search term state

  const getAllCourse = async () => {
    try {
      let res = axiosInstance.post(`/course/getAllCourses`);

      // await toast.promise(res, {
      //   loading: "Fetching...",
      //   success: (data) => {
      //     return data?.data?.message;
      //   },
      //   error: (data) => {
      //     return data?.response?.data.message;
      //   },
      // });
      res = await res;
      if (res.data.success) {
        setCourses(res.data.courses);
        console.log("courses", res.data.courses);
      }
    } catch (error) {
      console.error("Error Fetching data", error);
      toast.error("Error Fetching data");
    }
  };

  const [depName, setDepName] = useState([]);
  const getDepartmentName = async () => {
    try {
      let res = axiosInstance.post(`/department/getAllDepartmentsName`);

      // await toast.promise(res, {
      //   loading: "Fetching...",
      //   success: (data) => {
      //     return data?.data?.message;
      //   },
      //   error: (data) => {
      //     return data?.response?.data.message;
      //   },
      // });
      res = await res;
      if (res.data.success) {
        setDepName(res.data.departments);
        console.log("departments", res.data.departments);
      }
    } catch (error) {
      console.error("Error Fetching data", error);
      toast.error("Error Fetching data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = axiosInstance.post(`/course/create`, formData);

      await toast.promise(res, {
        loading: "Creating...",
        success: (data) => {
          return data?.data?.message;
        },
        error: (data) => {
          return data?.response?.data.message;
        },
      });
      res = await res;
      if ((await res).data.success) {
        // Clear form fields after submission
        setFormData({
          name: "",
          courseId: "",
          department: "",
        });
        getAllCourse();
      }
    } catch (error) {
      console.error("Error Creating data", error);
      toast.error("Error Creating data");
    }
  };

  // Function to handle delete button click
  const handleDelete = async (id) => {
    const result = window.confirm("Are you sure you want to proceed?");

    if (!result) return;
    console.log(id);
    try {
      let res = axiosInstance.post(`/course/delete`, { id });

      await toast.promise(res, {
        loading: "Deleting...",
        success: (data) => {
          return data?.data?.message;
        },
        error: (data) => {
          return data?.response?.data.message;
        },
      });
      res = await res;
      if ((await res).data.success) {
        getAllCourse();
      }
    } catch (error) {
      console.error("Error deleting data", error);
      toast.error("Error deleting data");
    }
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getAllCourse();
    getDepartmentName();
  }, []);

  return (
    <div className="min-h-screen p-3 md:p-8 bg-slate-50">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h1 className=" text-xl md:text-3xl md:text-medium font-semibold  mb-4 ">
          Course Management
        </h1>

        {/* Course Creation Form */}
        <div className="mb-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                placeholder="Course Name"
                className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-2/5 text-sm md:text-xl"
                value={formData?.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Course ID"
                className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/5 text-sm md:text-xl"
                value={formData.courseId}
                onChange={(e) =>
                  setFormData({ ...formData, courseId: e.target.value })
                }
                required
              />
              <select
                className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-2/5 text-sm md:text-xl shadow-sm"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                required
              >
                <option value="">Select Department</option>

                {depName.map((dep, index) => {
                  return (
                    <option key={dep._id} value={dep._id}>
                      {dep.name}
                    </option>
                  );
                })}
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 md:px-3 md:py-2 rounded-md hover:bg-blue-600 text-sm md:text-xl md:w-1/5 shadow-sm"
              >
                Create Course
              </button>
            </div>
          </form>
        </div>

        {/* Search input */}

        <div className="mb-4 flex items-center">
          {" "}
          {/* Adding flex container to align items center */}
          <div className="relative w-full">
            {" "}
            {/* Adding relative positioning */}
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />{" "}
            {/* Adding search icon */}
            <input
              type="text"
              placeholder="Search courses..."
              className="border border-gray-300 rounded-md pl-10 px-4 py-2 w-full md:w-3/5 text-sm md:text-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="max-h-screen min-h-96 p-5 rounded-lg shadow-lg bg-white mt-6 ">
        <h2 className="font-semibold text-xl md:text-2xl mt-3 mb-2">
          Course List
        </h2>
        <div className=" rounded-md hover:shadow-md text-md overflow-x-auto  ">
          <table className="w-full table-auto border-collapse border-gray-300">
            <thead className="text-sm lg:text-lg">
              <tr className="bg-gray-600 text-white">
                <th className="border border-gray-300 px-2 py-2 w-1/20">
                  Sr.No.
                </th>
                <th className="border border-gray-300 px-4 py-2 w-2/5">
                  Course Name
                </th>
                <th className="border border-gray-300 px-4 py-2 w-2/5">
                  Course ID
                </th>
                <th className="border border-gray-300 px-4 py-2 w-2/5">
                  Department
                </th>
                <th className="border border-gray-300 px-3 py-2 w-1/20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, index) => (
                <tr key={course._id} className="text-md md:text-lg">
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {course?.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {course.courseId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {course.department?.name}
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="text-red-500 hover:text-red-600"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseCreation;
