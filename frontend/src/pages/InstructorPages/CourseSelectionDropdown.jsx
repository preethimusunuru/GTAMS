import React from "react";

const CourseSelectionDropdown = ({ courses, selectedCourse, handleCourseChange }) => {
  return (
    <div className="mb-4">
      <select
        id="course"
        className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-2/3 text-sm md:text-xl"
        value={selectedCourse}
        onChange={(e) => handleCourseChange(e.target.value)}
      >
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course._id} value={course.courseId}>
            {course.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CourseSelectionDropdown;
