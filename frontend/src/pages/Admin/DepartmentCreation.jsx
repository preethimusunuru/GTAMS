import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-modal"; // Import React Modal
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";

const DepartmentCreation = () => {
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({ name: "", departmentId: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartmentCourses, setSelectedDepartmentCourses] = useState(
    []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAllDepartments = async () => {
    try {
      let res = axiosInstance.post(`/department/getAllDepartment`);

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
        setDepartments(res.data.departments);
        console.log((await res).data.departments);
      }
    } catch (error) {
      console.error("Error Fetching data", error);
      toast.error("Error Fetching data");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);
    try {
      let res = axiosInstance.post(`/department/create`, formData);
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
      if (res.data.success) {
        setFormData({ name: "", departmentId: "" });
        getAllDepartments();
      }
    } catch (error) {
      console.error("Error creating", error);
      toast.error("Error creating");
    }
  };

  const handleDelete = async (id) => {
    try {
      let res = axiosInstance.post(`/department/delete`, { id });
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
      if (res.data.success) {
        getAllDepartments();
      }
    } catch (error) {
      console.error("Error deleting", error);
      toast.error("Error deleting");
    }
  };

  const handleSeeCourses = async (id) => {
    console.log("id", id);
    try {
      let res = axiosInstance.post(
        `/department/getCourseListFromDepartmentId`,
        { id }
      );
      await toast.promise(res, {
        loading: "Fetching...",
        success: (data) => {
          return data?.data?.message;
        },
        error: (data) => {
          return data?.response?.data.message;
        },
      });
      res = await res;
      if (res.data.success) {
        setSelectedDepartmentCourses(res.data.courses);
        console.log("courses", res.data.courses);
      }
    } catch (error) {
      console.error("Error Fetching data", error);
      toast.error("Error Fetching data");
    }
    setIsModalOpen(true);
  };

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch departments from backend or set dummy data on component mount
  useEffect(() => {
    getAllDepartments();
  }, []);

  return (
    <div className="min-h-screen p-3 md:p-8 bg-slate-50">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h1 className=" text-xl md:text-3xl md:text-medium font-semibold  mb-4 ">
          Department Management
        </h1>

        <div className="mb-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
              <input
                type="text"
                placeholder="Department Name"
                className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-2/5 text-sm md:text-xl"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Department ID"
                className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/5 text-sm md:text-xl"
                value={formData.departmentId}
                onChange={(e) =>
                  setFormData({ ...formData, departmentId: e.target.value })
                }
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 md:px-3 md:py-2 rounded-md hover:bg-blue-600 text-sm md:text-xl md:w-1/5"
              >
                Create Department
              </button>
            </div>
          </form>
        </div>

        {/**search input */}
        <div className="mb-4 flex items-center">
          <div className="relative w-full">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search departments..."
              className="border border-gray-300 rounded-md pl-10 px-4 py-2 w-full md:w-3/5 text-sm md:text-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="max-h-screen min-h-96 p-5 rounded-lg shadow-lg bg-white mt-6 ">
        <h1 className="font-semibold text-xl md:text-2xl mt-3 mb-2">
          Department List
        </h1>

        <div className=" rounded-md hover:shadow-md text-md overflow-x-auto  ">
          <table className="w-full table-auto border-collapse border-gray-300">
            <thead className="text-sm lg:text-lg">
              <tr className="bg-gray-600 text-white">
                <th className="border border-gray-300 px-2 py-2 w-1/20">
                  Sr.No.
                </th>
                <th className="border border-gray-300 px-4 py-2 w-2/5">
                  Department Name
                </th>
                <th className="border border-gray-300 px-4 py-2 w-2/5">
                  Department ID
                </th>
                <th className="border border-gray-300 px-4 py-2 w-1/10">
                  Courses
                </th>
                <th className="border border-gray-300 px-3 py-2 w-1/20">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept, index) => (
                <tr key={dept._id} className="text-md md:text-lg ">
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {dept.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {dept.departmentId}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <button
                      onClick={() => handleSeeCourses(dept._id)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      See
                    </button>
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    <button
                      onClick={() => handleDelete(dept._id)}
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0 , 0, 0.75)", // Background color with opacity
          },
        }}
      >
        <div className="flex justify-between items-center mb-4 w-full">
          <h2 className="text-2xl font-semibold">Courses</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="font-semibold text-gray-800 border rounded p-2 hover:bg-red-600 hover:text-white"
          >
            <AiOutlineClose />
          </button>
        </div>
        <div className=" rounded-md hover:shadow-md text-md overflow-x-auto  ">
          <table className="w-full table-auto border-collapse border-gray-300">
            <thead className="text-sm lg:text-lg">
              <tr className="bg-gray-600 text-white">
                <th className="border border-gray-300 px-2 py-2 ">Sr.No.</th>
                <th className="border border-gray-300 px-4 py-2">
                  Course Name
                </th>
                <th className="border border-gray-300 px-4 py-2">Course ID</th>
              </tr>
            </thead>
            <tbody>
              {selectedDepartmentCourses.map((course, index) => (
                <tr key={index} className="text-md">
                  <td className="border border-gray-300 px-2 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {course.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {course.courseId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
};

export default DepartmentCreation;
