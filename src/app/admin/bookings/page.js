// src/app/admin/dashboard/bookings/page.js
"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/pending');
      if (!response.ok) throw new Error("Failed to fetch bookings.");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAllocate = async (bookingId) => {
    try {
      const response = await fetch('/api/allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Failed to allocate room.");
      }
      
      toast.success("Room allocated successfully!");
      // Refresh the list of pending bookings
      fetchBookings();

    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return <div className="text-center p-12">Loading booking requests...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-center" />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pending Booking Requests</h1>

        {bookings.length === 0 ? (
          <p className="text-gray-600">There are no pending booking requests at the moment.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking._id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">{booking.studentId.fullName}</p>
                  <p className="text-sm text-gray-600">{booking.studentId.userId.email}</p>
                  <p className="text-sm text-gray-500 mt-2">Wants to book Room: <span className="font-semibold">{booking.roomId.roomNumber}</span> (Block {booking.roomId.block})</p>
                </div>
                <button
                  onClick={() => handleAllocate(booking._id)}
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Allocate Room
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}