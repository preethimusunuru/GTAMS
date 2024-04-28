import React, { useEffect, useState } from "react";
import CourseSelectionDropdown from "./CourseSelectionDropdown";
import TATable from "./TATable";
import TADetailsModal from "./TADetailsModal";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";

const InstructorDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [tas, setTAs] = useState([]);
  const [filteredTAs, setFilteredTAs] = useState([]);
  const [selectedTA, setSelectedTA] = useState(null);
  const [isTADetailsOpen, setIsTADetailsOpen] = useState(false);

  const [courses, setCourses] = useState([]);

  const fetchTAs = () => {
    if (selectedCourse === "") {
      setFilteredTAs(tas);
    } else {
      setFilteredTAs(
        tas.filter((ta) => ta?.course?.courseId === selectedCourse)
      );
    }
  };

  const handleCourseChange = (courseId) => {
    setSelectedCourse(courseId);
  };

  const viewTADetails = (ta) => {
    setSelectedTA(ta);
    setIsTADetailsOpen(true);
  };

  const getAllCourseAndTaList = async () => {
    try {
      let res = axiosInstance.post(`/evaluation/getAllCourseAndTaList`);

      // await toast.promise(res, {
      //   loading: "Fetching...",
      //   success: (data) => data?.data?.message,
      //   error: (data) => data?.response?.data.message,
      // });

      res = await res;
      if (res.data.success) {
        setTAs(res.data.under);
        setFilteredTAs(res.data.under);
        setCourses(res.data.under.map((obj) => obj.course));
      }
    } catch (error) {
      console.error("Error Fetching data", error);
      toast.error("Error Fetching data");
    }
  };

  useEffect(() => {
    getAllCourseAndTaList();
  }, []);

  useEffect(() => {
    fetchTAs();
  }, [selectedCourse]);

  return (
    <div className="min-h-screen p-3 md:p-8 bg-slate-50">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h1 className="text-xl md:text-3xl font-semibold mb-4">
          Instructor Dashboard
        </h1>
        <CourseSelectionDropdown
          courses={courses}
          selectedCourse={selectedCourse}
          handleCourseChange={handleCourseChange}
        />
      </div>

      <TATable filteredTAs={filteredTAs} viewTADetails={viewTADetails} />

      {selectedTA && isTADetailsOpen && (
        <TADetailsModal
          selectedTA={selectedTA}
          onClose={() => setIsTADetailsOpen(false)}
        />
      )}

     
    </div>
  );
};

export default InstructorDashboard;
