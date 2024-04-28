import { model, Schema } from 'mongoose';


const employeeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: Schema.Types.ObjectId,
        ref: 'Department'
    },
    position: String,
    salary: Number,
    hireDate: {
        type: Date,
        default: Date.now
    }
});

const Employee = model('Employee', employeeSchema);

export default Employee;
