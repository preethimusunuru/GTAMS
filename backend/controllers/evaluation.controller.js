import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/appError.js";
import Application from "../models/application.model.js";
import { sendEmail } from '../utils/sendEmail.js';
import Form from "../models/form.model.js";
import User from "../models/user.model.js";
import Evaluation from "../models/evaluation.model.js";
import { Mongoose } from "mongoose";


// export const createApplication = asyncHandler(async (req, res, next) => {

// })


export const addNewEvaluation = asyncHandler(async (req, res, next) => {
    const { formData, courseId, taId } = req.body;

    const evaluation = await Evaluation.findOne({
        instructor: req.user.id,
        "under": {
            $elemMatch: {
                course: courseId,
                ta: taId
            }
        }
    });

    if (!evaluation) {
        return next(new AppError('Course and TA combination not found in evaluation', 404));
    }
    console.log(formData, 'fd')
    // Create a new summary object
    const newSummary = {
        task: formData.task,
        rating: formData.rating,
        remark: formData.remark,
        date: formData.date,
    };


    // Update the evaluation document with the new summary
    await Evaluation.updateOne(
        {
            _id: evaluation._id,
            "under": {
                $elemMatch: {
                    course: courseId,
                    ta: taId
                }
            }
        },
        {
            $push: {
                "under.$.summary": newSummary
            }
        }
    );

    res.status(201).json({
        success: true,
        message: "New evaluation added successfully."
    });
});



export const getAllCourseAndTaList = asyncHandler(async (req, res, next) => {
    console.log(req.user.id)
    const evaluation = await Evaluation.
        findOne({ instructor: req.user.id })
        .populate({
            path: 'under',
            populate: [
                { path: 'course', select: '_id name courseId' },
                { path: 'ta', select: '_id fullName' }
            ]
        })


    if (!evaluation) {
        return next(new AppError('Instructor not found or no evaluations found', 404));
    }
    // else {
    //     console.log(evaluation);
    // }

    res.status(200).json({
        success: true,
        message: 'Fetched',
        under: evaluation.under
    });
});




export const getSummary = asyncHandler(async (req, res, next) => {
    const { taId, courseId } = req.body;

    const evaluation = await Evaluation.findOne({
        instructor: req.user.id,
        "under.ta": taId,
        "under.course": courseId
    });

    if (!evaluation) {
        return next(new AppError('Not found', 404));
    }

    const result = evaluation.under.find(obj => (
        (obj.course.toString() === courseId) &&
        (obj.ta.toString() === taId)
    ));

    console.log('result', result);

    res.status(200).json({
        success: true,
        message: 'Fetched',
        summary: result.summary
    });
});




// export const createApplication = asyncHandler(async (req, res, next) => {

// })

getSummary