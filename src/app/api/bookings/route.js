// src/app/api/bookings/route.js
import dbConnect from "@/lib/mongoose";
import StudentInfo from "@/models/StudentInfo";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import User from "@/models/User";

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { userId, roomId, ...studentData } = body;

    // 1. Verify user and room exist
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found." }), { status: 404 });
    }
    const room = await Room.findById(roomId);
    if (!room) {
        return new Response(JSON.stringify({ error: "Room not found." }), { status: 404 });
    }

    // 2. Create or update the StudentInfo document
    let studentInfo = await StudentInfo.findOne({ userId });
    if (studentInfo) {
      studentInfo = await StudentInfo.findOneAndUpdate({ userId }, studentData, { new: true });
    } else {
      studentInfo = new StudentInfo({ userId, ...studentData });
      await studentInfo.save();
    }

    // 3. Create a new Booking document
    const booking = new Booking({
      studentId: studentInfo._id,
      roomId,
    });
    await booking.save();

    return new Response(JSON.stringify({ message: "Booking request created successfully.", booking }), { status: 201 });

  } catch (error) {
    console.error("Booking API Error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred." }), { status: 500 });
  }
}