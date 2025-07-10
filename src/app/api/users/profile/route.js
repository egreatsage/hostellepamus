// src/app/api/users/profile/route.js
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import StudentInfo from "@/models/StudentInfo";
import Booking from "@/models/Booking";
import Room from "@/models/Room";

export async function GET(request) {
  const token = await getToken({ req: request });
  console.log("Token ID:", token?.id);
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await dbConnect();

  try {
    // 1. Find the user's detailed information
    const studentInfo = await StudentInfo.findOne({ userId: token.id });
   

    // If no student info, they haven't started a booking yet.
    if (!studentInfo) {
      return new Response(JSON.stringify({ booking: null }), { status: 200 });
    }

    // 2. Find the most recent booking associated with this student
    // We sort by creation date in descending order and limit to 1.
    const booking = await Booking.findOne({ studentId: studentInfo._id })
                                 .sort({ createdAt: -1 }) // Get the latest booking
                                 .populate({
                                     path: 'roomId',
                                     model: Room,
                                     select: 'roomNumber price' // Only select the fields you need
                                 });
  

    // 3. Return all relevant data
    return new Response(JSON.stringify({ studentInfo, booking }), { status: 200 });

  } catch (error) {
    console.error("Profile API Error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch profile data." }), { status: 500 });
  }
}
