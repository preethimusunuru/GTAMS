import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import Course from '../models/course.model.js';
import Department from '../models/department.model.js';
import AppError from '../utils/appError.js';


export const getAllCourses = asyncHandler(async (_req, res, next) => {
  try {
    const courses = await Course.find({}).select('_id name courseId').populate('department', '_id name');

    res.status(200).json({
      success: true,
      message: 'All courses',
      courses,
    });
  } catch (er) {
    console.log(er);
  }

});


export const createCourse = asyncHandler(async (req, res, next) => {
  const formData = req.body;
  const department = await Department.findById(formData.department);

  if (!department) {
    return next(new AppError('Department with department code not found', 404));
  }

  // department
  const course = await Course.create(formData);

  if (!course) {
    return next(
      new AppError('Course could not be created, please try again', 400)
    );
  }

  department.courses.push(course._id);
  department.save();

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    course,
  });
});



export const deleteCourseById = asyncHandler(async (req, res, next) => {
  const { id } = req.body;
  const course = await Course.findById(id);

  if (!course) {
    return next(new AppError('Course with given id does not exist.', 404));
  }
  const department = await Department.findById(course.department);

  if (!department) {
    return next(new AppError('Department with department code not found', 404));
  }

  // Remove course reference from department.courses
  const courseIndex = department.courses.indexOf(course._id);
  if (courseIndex !== -1) {
    department.courses.splice(courseIndex, 1);
  }

  await department.save();

  await course.remove();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

export const getAllCourseName = asyncHandler(async (req, res, next) => {
  const courses = await Course.find().select('_id name courseId');
  res.status(200).json({
    success: true,
    message: 'Course names fetched successfully.',
    courses
  });
});
