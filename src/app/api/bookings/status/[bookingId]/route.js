// src/app/api/bookings/status/[bookingId]/route.js
import dbConnect from "@/lib/mongoose";
import Booking from "@/models/Booking";

export async function GET(request, { params }) {
  await dbConnect();
  const { bookingId } = params;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ status: booking.status }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch booking status" }), { status: 500 });
  }
}