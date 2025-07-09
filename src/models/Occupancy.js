// src/models/Occupancy.js
import mongoose from "mongoose";

const occupancySchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentInfo', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  moveInDate: { type: Date, default: Date.now },
  expectedMoveOutDate: { type: Date },
  isActive: { type: Boolean, default: true } // Becomes false when a student moves out
});

const Occupancy = mongoose.models.Occupancy || mongoose.model("Occupancy", occupancySchema);

export default Occupancy;