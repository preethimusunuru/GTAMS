import { model, Schema } from 'mongoose';


const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true,
    unique: true
  },
  // description: String,
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department'
  },
  creditHours: {
    type: Number,
    // required: true
  },
  instructors: [{
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }],
  ta: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const Course = model('Course', courseSchema);

export default Course;
