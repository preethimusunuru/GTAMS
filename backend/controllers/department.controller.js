import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/appError.js';
import Department from '../models/department.model.js'
import Course from '../models/course.model.js';


export const createDepartment = asyncHandler(async (req, res, next) => {
    const formData = req.body;
    const department = await Department.create(formData);

    if (!department) {
        return next(new AppError('Department not created', 404));
    }

    res.status(201).json({
        success: true,
        message: 'Department created',
        department
    })
});


export const deleteDepartment = asyncHandler(async (req, res, next) => {
    const {id} = req.body;

    const result = await Department.findByIdAndDelete({ _id: id });

    if (result.deletedCount === 0) {
        return next(new AppError('Department not created.', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Department deleted successfully.',
        result
    });
});

export const getAllDepartment = asyncHandler(async (req, res, next) => {
    const departments = await Department.find();
    res.status(200).json({
        success: true,
        message: 'Department list fetched successfully.',
        departments
    });
});

export const getAllDepartmentsName = asyncHandler(async (req, res, next) => {
    const departments = await Department.find().select('_id name departmentId');
    res.status(200).json({
        success: true,
        message: 'Department names fetched successfully.',
        departments
    });
});


export const getCourseListFromDepartmentId = asyncHandler(async (req, res, next) => {
    console.log(req.body)
    const { id } = req.body;
    console.log(id);

    const department = await Department.findById(id);

    if (!department) {
        return next(new AppError('Department not exist', 404));
    }

    const courses = await Course.find({ _id: { $in: department.courses } });

    res.status(201).json({
        success: true,
        message: 'Course list fetched successfully',
        courses
    })

});