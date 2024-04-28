import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/appError.js";
import Application from "../models/application.model.js";
import { sendEmail } from '../utils/sendEmail.js';
import Form from "../models/form.model.js";
import User from "../models/user.model.js";
import Evaluation from "../models/evaluation.model.js";
import Course from "../models/course.model.js";


// export const createApplication = asyncHandler(async (req, res, next) => {

// })

export const getUserFormResponseByJobId = asyncHandler(async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError("User not found.", 404));
    }

    try {
        const form = await Application.aggregate([
            {
                $match: { jobId, 'appliedBy.user': user._id }
            },
            {
                $unwind: '$appliedBy'
            },
            {
                $match: { 'appliedBy.user': user._id }
            },
            {
                $project: {
                    form: '$appliedBy.form',
                    title: '$title',
                }
            }
        ]);

        if (!form || form.length === 0 || !form[0].form) {
            return next(new AppError("Response not found.", 404));
        }

        const formId = form[0].form;

        let responseForm = await Form.findById(formId);

        if (!responseForm) {
            return next(new AppError("Response form not found.", 404));
        }

        res.status(200).json({
            success: true,
            message: 'Response fetched.',
            form: responseForm,
            jobTitle: form[0].title
        });
    } catch (error) {
        console.error(error);
        return next(new AppError("Error fetching response.", 500));
    }
});



export const getAllFormResponseByJobId = asyncHandler(async (req, res, next) => {
    try {
        const { jobId } = req.params;
        const application = await Application.findOne({ jobId });

        if (!application) {
            return next(new AppError('Application not found', 409));
        }

        // get all the fromIds of response received on that requested application. 
        const formIds = application.appliedBy.map(item => item.form);

        // Find all forms with the extracted formIds
        const forms = await Form.find({ _id: { $in: formIds } });

        // Filter out null/undefined values
        const filteredForms = forms.filter(form => form);

        res.status(200).json({
            success: true,
            forms: filteredForms,
            message: 'From data fetched successfully.'
        });
    } catch (err) {
        console.log(err);
        return next(new AppError('Error occured.', 505));
    }

})


export const changeFormStatusByFormId = asyncHandler(async (req, res, next) => {
    const { id } = req.body;

    const form = await Form.findById(id);

    if (!form) {
        return next(new AppError('The response is not found.', 404));
    }

    form.status = 'Forwarded';
    await form.save();

    res.status(201).json({
        success: true,
        message: "Forwarded successfully."
    })
})


export const rejectFromByFormId = asyncHandler(async (req, res, next) => {
    const { id } = req.body;

    const form = await Form.findById(id);

    if (!form) {
        return next(new AppError('The response is not found.', 404));
    }

    form.status = 'Rejected';

    await sendEmail(
        form.email,
        `Update regarding your from ID ${form.formId}.`,
        'We are not moving forward with your application this time.'
    );

    await form.save();

    res.status(201).json({
        success: true,
        message: "Rejected successfully."
    })
})


export const acceptFromByFormId = asyncHandler(async (req, res, next) => {
    const { id, instructor } = req.body;

    const form = await Form.findById(id);

    if (!form) {
        return next(new AppError('The response is not found.', 404));
    }

    form.status = 'Assigned to Instructor';
    form.instructor = instructor;

    await form.save();

    res.status(201).json({
        success: true,
        message: "Accepted successfully."
    })
})


export const offeredByDS = asyncHandler(async (req, res, next) => {
    const { id, jobId } = req.body;

    const form = await Form.findById(id);

    if (!form) {
        return next(new AppError('The response is not found.', 404));
    }
    form.status = 'Offer Pending';


    const emailSubject = `Update Regarding Your Form ID ${form.formId}`;
    const emailBody = `Dear ${form.applicantName},\n\nWe are pleased to inform you that your form with ID ${form.formId} has been reviewed and accepted.
    \n\nNow to confirm your interest in this opening please visit this <a href=${process.env.FRONTEND_URL}/applications/${jobId}>Link</a>.
    \n\nIf you have any questions or need further assistance, please feel free to reach out to us. We are here to help!\n\nThank you once again for choosing us.
    \n\nBest regards,\n`;


    try {
        await sendEmail(form.email, emailSubject, emailBody);
    } catch (error) {
        console.error('Error sending email:', error);
        return next(new AppError('Error sending email.', 500));
    }

    await form.save();

    res.status(201).json({
        success: true,
        message: "Offered successfully."
    })
})


export const acceptByTa = asyncHandler(async (req, res, next) => {
    const { id } = req.body;

    const form = await Form.findById(id);

    if (!form) {
        return next(new AppError('The response is not found.', 404));
    }

    form.status = 'TA Assigned';
    console.log(form.courseId);
    // Find course
    const foundCourse = await Course.findOne({ courseId: form.courseId }).select('_id');
    if (!foundCourse) {
        return next(new AppError('The course is not found.', 404));
    }

    // Check if Evaluation with the same instructor and course exists
    const foundPrevEval = await Evaluation.findOne({
        instructor: form.instructor,
        "under.course": foundCourse._id
    });

    if (foundPrevEval) {
        // If Evaluation exists, update the TA for the course
        foundPrevEval.under.push({
            course: foundCourse._id,
            ta: req.user.id,
            summary: [] // Initialize an empty summary array
        });
        await foundPrevEval.save();
    } else {
        // If Evaluation doesn't exist, create a new one
        const evaluation = await Evaluation.create({
            instructor: form.instructor,
            under: [{
                course: foundCourse._id,
                ta: req.user.id,
                summary: [] // Initialize an empty summary array
            }]
        });

        if (!evaluation) {
            return next(new AppError('Error in evaluation creation', 502));
        }
    }

    await form.save();

    res.status(201).json({
        success: true,
        message: "Offer accepted successfully."
    });

});


// export const createApplication = asyncHandler(async (req, res, next) => {

// })
