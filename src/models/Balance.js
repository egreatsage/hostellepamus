// src/models/Balance.js
import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentInfo', required: true, unique: true },
    currentBalance: { type: Number, default: 0 } // Can be negative (overpayment) or positive (due)
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Balance = mongoose.models.Balance || mongoose.model("Balance", balanceSchema);

export default Balance;
