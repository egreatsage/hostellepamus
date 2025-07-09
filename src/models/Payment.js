// src/models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentInfo', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  mpesaTransactionId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['completed', 'failed'], default: 'completed' },
}, { timestamps: true });

const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;