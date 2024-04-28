import { model, Schema } from 'mongoose';


const departmentSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    departmentId: {
        type: String,
        required: true,
        unique: true
    },
    employees: [{
        type: Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
});

const Department = model('Department', departmentSchema);

export default Department;
