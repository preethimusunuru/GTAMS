import { model, Schema } from 'mongoose';

const applicationSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        courseId: {
            type: String,
            required: true,
        },
        instructor: String,
        requiredSkills: String,
        department: String,
        jobId: {
            type: String,
            unique: [true, 'Job Id must be unique.'],
            trim: true,
            required: [true,'Job Id is required.'],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        isApplicationOpen: {
            type: Boolean,
            default: true,
        },
        appliedBy: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                form: {
                    type: Schema.Types.ObjectId,
                    ref: 'Form',
                },

            }
        ]
    },
    {
        timestamps: true,
    }
);

const Application = model('Application', applicationSchema);

export default Application;
