// src/app/api/mpesa/callback/route.js
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";
import Occupancy from "@/models/Occupancy";
import Payment from "@/models/Payment";
import Balance from "@/models/Balance";

export async function POST(request) {
  await dbConnect();
  const callbackData = await request.json();

  const checkoutRequestId = callbackData.Body.stkCallback.CheckoutRequestID;
  const resultCode = callbackData.Body.stkCallback.ResultCode;

  const booking = await Booking.findOne({ checkoutRequestId }).populate('roomId');

  if (!booking) {
    return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });
  }

  if (resultCode === 0) {
    // Payment successful
    const metadata = callbackData.Body.stkCallback.CallbackMetadata.Item;
    const phoneNumber = metadata.find(item => item.Name === 'PhoneNumber').Value;
    const amount = metadata.find(item => item.Name === 'Amount').Value;
    const mpesaReceiptNumber = metadata.find(item => item.Name === 'MpesaReceiptNumber').Value;

    // 1. Update Booking status
    booking.status = 'allocated';
    await booking.save();

    // 2. Create Payment record
    await Payment.create({
      studentId: booking.studentId,
      bookingId: booking._id,
      amount: amount,
      mpesaTransactionId: mpesaReceiptNumber,
      phoneNumber: phoneNumber,
      merchantRequestId: callbackData.Body.stkCallback.MerchantRequestID,
    });

    // 3. Create Occupancy record
    await Occupancy.create({
      studentId: booking.studentId,
      roomId: booking.roomId._id,
    });

    // 4. Create Balance record
    await Balance.create({
        studentId: booking.studentId,
        currentBalance: booking.roomId.price
    });

  } else {
    // Payment failed
    booking.status = 'payment_failed';
    await booking.save();
  }

  return new Response(JSON.stringify({ message: "Callback received" }), { status: 200 });
}