import { model, Schema } from 'mongoose';

const evaluationSchema = new Schema(
    {
        instructor: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        under: [{
            course: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
            },
            ta: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            summary: [{
                task: {
                    type: String,
                    required: [true, 'Task is required'],
                },
                rating: {
                    type: Number,
                    min: 0,
                    max: 10,
                    required: [true, 'Rating is required'],
                },
                remark: {
                    type: String,
                    required: [true, 'Remark is required'],
                },
                date: {
                    type: String,
                    default: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
                    required: true,
                },
            }]
        }]
    },
    {
        timestamps: true,
    }
);


const Evaluation = model('Evaluation', evaluationSchema);

export default Evaluation;
