// src/app/(student)/book/[roomId]/page.js
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import StudentInfoForm from "@/components/StudentInfoForm";
import toast, { Toaster } from "react-hot-toast";

export default function BookRoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    if (!session) {
      toast.error("You must be logged in to book a room.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, roomId, userId: session.user.id }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit booking.");
      }
      
      toast.success("Booking request submitted successfully! You will be notified upon allocation.");
      router.push('/profile');

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-[#EFD09E] to-[#D4AA7D] rounded-lg md:p-8 p-2 shadow-xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Confirm Your Details</h1>
          <p className="text-gray-600 mb-8">Please fill out your personal information to complete the booking request.</p>
          <StudentInfoForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}