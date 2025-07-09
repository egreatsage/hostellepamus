// src/app/api/users/profile/route.js
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import StudentInfo from "@/models/StudentInfo";
import Booking from "@/models/Booking";
import Room from "@/models/Room";

export async function GET(request) {
  const token = await getToken({ req: request });
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await dbConnect();

  try {
    const studentInfo = await StudentInfo.findOne({ userId: token.id });
    if (!studentInfo) {
      return new Response(JSON.stringify({ message: "No profile information found." }), { status: 200 });
    }

    const booking = await Booking.findOne({ studentId: studentInfo._id })
                                 .populate('roomId', 'roomNumber price', Room)
                                 .sort({ createdAt: -1 });
 console.log("Profile data fetched successfully:", { studentInfo, booking });
    return new Response(JSON.stringify({ studentInfo, booking }), { status: 200 });
        

  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch profile data." }), { status: 500 });
  }
}