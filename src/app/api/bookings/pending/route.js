// src/app/api/bookings/pending/route.js
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";
import StudentInfo from "@/models/StudentInfo";
import Room from "@/models/Room";
import User from "@/models/User";

export async function GET(request) {
  await dbConnect();
  try {
    const pendingBookings = await Booking.find({ status: 'pending' })
      .populate({
        path: 'studentId',
        model: StudentInfo,
        populate: {
          path: 'userId',
          model: User,
          select: 'email'
        }
      })
      .populate('roomId', 'roomNumber block price', Room);

    return new Response(JSON.stringify(pendingBookings), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch pending bookings" }), { status: 500 });
  }
}