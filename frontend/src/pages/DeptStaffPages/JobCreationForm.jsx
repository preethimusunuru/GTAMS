import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../Helper/axiosInstance";
import Dropdown from "./Dropdown";

const JobCreationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    instructor: "NA",
    requiredSkills: "",
    department: "",
    jobId: "",
    isApplicationOpen: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const [courseOptions, setCourseOptions] = useState([]);

  const [departmentOptions, setDepartmentOptions] = useState([]);

  const createJob = async () => {
    try {
      let res = axiosInstance.post("/application/create", formData);

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
        navigate("/dashboardDS");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('form data', formData);
    try {
      await createJob();
      setFormData({
        title: "",
        courseId: "",
        instructor: "NA",
        requiredSkills: "",
        department: "",
        jobId: "",
        isApplicationOpen: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getDepartmentList = async () => {
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
        let temp = res.data.departments.map(department => ({
          id: department._id,
          value: department.departmentId,
          label: department.name
        }));
        temp.unshift({ value: "", label: "Select Department ID" })
        setDepartmentOptions(temp);
        console.log('Departments ', departmentOptions);
      }
    } catch (error) {
      console.error("Error Fetching data", error);
      toast.error("Error Fetching data");
    }
  }

  const getCourseList = async () => {
    try {
      let res = axiosInstance.post(`/course/getAllCourseName`);
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
        let temp = res.data.courses.map(course => ({
          id: course._id,
          value: course.courseId,
          label: course.name
        }));
        temp.unshift({ value: "", label: "Select Course ID" })
        setCourseOptions(temp);
        console.log('course ', temp);
      }
    } catch (error) {
      console.error("Error Fetching data", error);
      toast.error("Error Fetching data");
    }
  }


  useEffect(() => {
    getDepartmentList();
    getCourseList();
  }, [setCourseOptions, setDepartmentOptions]);


  return (
    <div className="bg-slate-50 min-h-screen flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md m-3">
        <h1 className="text-2xl font-bold mb-4 text-center">Create New Job</h1>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-semibold mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Course ID */}
          <div className="mb-4">
            <label
              htmlFor="courseId"
              className="block text-gray-700 font-semibold mb-2"
            >
              Course ID
            </label>
            <Dropdown
              options={courseOptions}
              value={formData.courseId}
              handleChange={handleChange}
              name="courseId"
            />
          </div>


          {/* Required Skills */}
          <div className="mb-4">
            <label
              htmlFor="requiredSkills"
              className="block text-gray-700 font-semibold mb-2"
            >
              Required Skills
            </label>
            <textarea
              id="requiredSkills"
              name="requiredSkills"
              value={formData.requiredSkills}
              onChange={handleChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Department */}
          <div className="mb-4">
            <label
              htmlFor="department"
              className="block text-gray-700 font-semibold mb-2"
            >
              Department
            </label>
            <Dropdown
              options={departmentOptions}
              value={formData.department}
              handleChange={handleChange}
              name="department"
            />
          </div>

          {/* Job ID */}
          <div className="mb-4">
            <label
              htmlFor="jobId"
              className="block text-gray-700 font-semibold mb-2"
            >
              Job ID
            </label>
            <input
              type="text"
              id="jobId"
              name="jobId"
              value={formData.jobId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Is Application Open */}
          <div className="mb-4">
            <label className=" text-gray-700 font-semibold mb-2 flex justify-start items-center">
              <input
                type="checkbox"
                name="isApplicationOpen"
                checked={formData.isApplicationOpen}
                onChange={handleChange}
                className="mr-3 h-4 w-5"
              />
              <span>Is Application Open ?</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded font-semibold hover:bg-blue-700 transition duration-300 shadow-sm"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobCreationForm;
