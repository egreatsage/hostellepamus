// src/app/api/allocations/route.js
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";
import Occupancy from "@/models/Occupancy";
import Balance from "@/models/Balance";
import Room from "@/models/Room";

export async function POST(request) {
  await dbConnect();
  try {
    const { bookingId } = await request.json();

    const booking = await Booking.findById(bookingId).populate('roomId');
    if (!booking || booking.status !== 'pending') {
      return new Response(JSON.stringify({ error: "Booking not found or not pending." }), { status: 404 });
    }

    // 1. Update Booking status to 'allocated'
    booking.status = 'allocated';
    await booking.save();

    // 2. Create a new Occupancy record
    const occupancy = new Occupancy({
      studentId: booking.studentId,
      roomId: booking.roomId._id,
    });
    await occupancy.save();

    // 3. Create a Balance record for the student with the initial room price
    const balance = new Balance({
      studentId: booking.studentId,
      currentBalance: booking.roomId.price,
    });
    await balance.save();
    
    // Note: In a real application, you would also trigger an email notification here.

    return new Response(JSON.stringify({ message: "Room allocated successfully." }), { status: 200 });

  } catch (error) {
    console.error("Allocation API Error:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred during allocation." }), { status: 500 });
  }
}