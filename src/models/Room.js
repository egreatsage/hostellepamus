import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  block: { type: String, required: true }, // e.g., 'A'
  roomNumber: { type: String, required: true }, // e.g., 'A101'
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  capacity: { type: Number, required: true },
  photoUrls: [{ type: String }],
  price: { type: Number, required: true }, // Price per month
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

// Create a compound index to ensure room numbers are unique within a block
roomSchema.index({ block: 1, roomNumber: 1 }, { unique: true });

const Room = mongoose.models.Room || mongoose.model("Room", roomSchema);

export default Room;
