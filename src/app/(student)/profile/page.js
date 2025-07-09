// src/app/(student)/profile/page.js
"use client";

import { useEffect, useState } from "react";
import useRequireAuth from "@/hooks/useRequireAuth";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link"; // Import the Link component

// --- PaymentModal Component (remains the same) ---
function PaymentModal({ booking, onClose, onPaymentSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!/^(07|01)\d{8}$/.test(phoneNumber)) {
        toast.error("Please enter a valid phone number (e.g., 0712345678).");
        return;
    }
    
    setIsLoading(true);
    toast.loading("Processing payment...");

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log("Simulating payment confirmation for:", {
        bookingId: booking._id,
        amount: booking.roomId.price,
        phoneNumber,
      });

      toast.dismiss();
      toast.success("Payment successful!");
      onPaymentSuccess();
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Payment failed.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Pay for Room</h2>
        <p className="mb-2">Room: <span className="font-semibold">{booking.roomId.roomNumber}</span></p>
        <p className="mb-4">Amount: <span className="font-semibold">Ksh {booking.roomId.price.toFixed(2)}</span></p>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">M-Pesa Phone Number</label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="0712345678"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button onClick={onClose} className="text-gray-600">Cancel</button>
          <button onClick={handlePayment} disabled={isLoading} className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50">
            {isLoading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}


// --- StudentProfilePage Component (updated) ---
export default function StudentProfilePage() {
  const { user } = useRequireAuth("student");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users/profile');
      if (!response.ok) throw new Error("Failed to fetch profile.");
      const data = await response.json();
      setProfileData(data);
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handlePaymentSuccess = () => {
    setIsModalOpen(false);
    fetchProfile(); 
  };

  // if (loading) {
  //   return <div className="text-center p-12">Loading Profile...</div>;
  // }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Booking Status</h2>
          
          {/* --- THIS IS THE MODIFIED SECTION --- */}
          {!profileData?.booking ? (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">You have no active booking requests. Find your perfect room today!</p>
              <Link href="/rooms">
                <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                  Book Now
                </button>
              </Link>
            </div>
          ) : (
            <div>
              <p><strong>Room:</strong> {profileData.booking.roomId.roomNumber}</p>
              <p><strong>Status:</strong> <span className="font-semibold capitalize">{profileData.booking.status}</span></p>

              {profileData.booking.status === 'pending' && (
                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
                  <p className="text-yellow-800">Your booking is pending payment. Please pay to secure your room.</p>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-3 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                  >
                    Pay Now (Ksh {profileData.booking.roomId.price.toFixed(2)})
                  </button>
                </div>
              )}

              {profileData.booking.status === 'allocated' && (
                 <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-green-800">Congratulations! Your room has been allocated.</p>
                </div>
              )}
            </div>
          )}
          {/* --- END OF MODIFIED SECTION --- */}
        </div>
      </div>

      {isModalOpen && profileData?.booking && (
        <PaymentModal 
          booking={profileData.booking} 
          onClose={() => setIsModalOpen(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}