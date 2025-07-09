// src/models/StudentInfo.js
import mongoose from "mongoose";

const studentInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  homeCounty: { type: String },
  location: { type: String },
  formerHighSchool: { type: String },
  mothersName: { type: String },
  mothersNumber: { type: String },
  fathersName: { type: String },
  fathersNumber: { type: String },
  guardianName: { type: String },
  guardianNumber: { type: String },
  school: { type: String },
  course: { type: String },
}, { timestamps: true });

const StudentInfo = mongoose.models.StudentInfo || mongoose.model("StudentInfo", studentInfoSchema);

export default StudentInfo;