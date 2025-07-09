// src/app/(student)/profile/page.js
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

// --- PaymentModal Component ---
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h2>
          <p className="text-gray-600">Secure your room booking</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Room:</span>
            <span className="font-semibold text-gray-800">{booking.roomId.roomNumber}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-2xl text-green-600">Ksh {booking.roomId.price.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
            placeholder="0712345678"
          />
        </div>

        <div className="flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handlePayment} 
            disabled={isLoading} 
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200 font-medium shadow-lg"
          >
            {isLoading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- InfoCard Component ---
function InfoCard({ title, children, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="bg-gradient-to-r from-[#272727] to-[#3a3a3a] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#D4AA7D] rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}

// --- ProfileField Component ---
function ProfileField({ label, value }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="text-gray-800 font-semibold">{value || "Not provided"}</span>
    </div>
  );
}

// --- StatusBadge Component ---
function StatusBadge({ status }) {
  const statusConfig = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
      icon: "⏳"
    },
    allocated: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
      icon: "✅"
    },
    confirmed: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300",
      icon: "🏠"
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
      <span>{config.icon}</span>
      <span className="font-semibold capitalize">{status}</span>
    </div>
  );
}

// --- Main Component ---
export default function StudentProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const response = await fetch('/api/users/profile');
      if (!response.ok) throw new Error("Failed to fetch profile.");
      const data = await response.json();
      setProfileData(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (status === 'loading') {
      return; 
    }
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (session?.user?.role === 'student') {
      fetchProfile();
    } else {
      router.push('/');
    }
  }, [status, session, router]);

  const handlePaymentSuccess = () => {
    setIsModalOpen(false);
    fetchProfile();
  };

  if (status === 'loading' || loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EFD09E] to-[#D4AA7D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#272727] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#272727] text-lg font-semibold">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  if (!session || session.user.role !== 'student') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFD09E] to-[#D4AA7D]">
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#272727',
            color: '#fff',
            borderRadius: '12px',
          },
        }}
      />
      
      {/* Header */}
      <div className="bg-[#272727] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Student Dashboard</h1>
              <p className="text-[#D4AA7D]">Welcome back, {profileData?.studentInfo?.fullName || session.user.name}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AA7D] to-[#EFD09E] rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#272727]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Booking Status Card */}
          <div className="lg:col-span-2">
            <InfoCard 
              title="Booking Status" 
              icon={
                <svg className="w-4 h-4 text-[#272727]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            >
              {!profileData?.booking ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#D4AA7D] to-[#EFD09E] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-[#272727]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Booking</h3>
                  <p className="text-gray-600 mb-6">Ready to find your perfect room? Start your booking journey today!</p>
                  <Link href="/rooms">
                    <button className="bg-gradient-to-r from-[#272727] to-[#3a3a3a] text-white font-bold py-3 px-8 rounded-xl hover:from-[#3a3a3a] hover:to-[#272727] transition-all duration-200 shadow-lg">
                      Browse Rooms
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-[#EFD09E] to-[#D4AA7D] p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-[#272727]">Room {profileData.booking.roomId.roomNumber}</h3>
                        <p className="text-[#272727]/70">Your reserved accommodation</p>
                      </div>
                      <StatusBadge status={profileData.booking.status} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/50 p-4 rounded-lg">
                        <p className="text-sm text-[#272727]/70 mb-1">Room Price</p>
                        <p className="text-2xl font-bold text-[#272727]">Ksh {profileData.booking.roomId.price.toFixed(2)}</p>
                      </div>
                      <div className="bg-white/50 p-4 rounded-lg">
                        <p className="text-sm text-[#272727]/70 mb-1">Booking Date</p>
                        <p className="text-lg font-semibold text-[#272727]">
                          {new Date(profileData.booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {profileData.booking.status === 'pending' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-yellow-800 mb-2">Payment Required</h4>
                          <p className="text-yellow-700 mb-4">Complete your payment to secure your room booking. Your reservation is being held temporarily.</p>
                          <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-semibold shadow-lg"
                          >
                            Pay Now - Ksh {profileData.booking.roomId.price.toFixed(2)}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {profileData.booking.status === 'allocated' && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-green-800 mb-2">Booking Confirmed!</h4>
                          <p className="text-green-700">Congratulations! Your room has been successfully allocated. You'll receive further instructions about check-in procedures.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </InfoCard>
          </div>

          {/* Student Information Card */}
          <div>
            <InfoCard 
              title="Personal Information" 
              icon={
                <svg className="w-4 h-4 text-[#272727]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            >
              {profileData?.studentInfo ? (
                <div className="space-y-1">
                  <ProfileField label="Full Name" value={profileData.studentInfo.fullName} />
                  <ProfileField label="Phone" value={profileData.studentInfo.phoneNumber} />
                  <ProfileField label="Gender" value={profileData.studentInfo.gender} />
                  <ProfileField label="Location" value={profileData.studentInfo.location} />
                  <ProfileField label="School" value={profileData.studentInfo.school} />
                  <ProfileField label="Course" value={profileData.studentInfo.course} />
                  <ProfileField label="Home County" value={profileData.studentInfo.homeCounty} />
                  <ProfileField label="Mother's Name" value={profileData.studentInfo.mothersName} />
                  <ProfileField label="Father's Name" value={profileData.studentInfo.fathersName} />
                  <ProfileField label="Guardian's Name" value={profileData.studentInfo.guardianName} />
                  <ProfileField label="Guardian's Phone" value={profileData.studentInfo.guardianNumber} />
                  
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-4">Complete your profile to get started</p>
                  <button className="bg-[#D4AA7D] text-[#272727] font-semibold py-2 px-4 rounded-lg hover:bg-[#c19a6b] transition-colors">
                    Update Profile
                  </button>
                </div>
              )}
            </InfoCard>
          </div>
        </div>

      
      </div>

      {/* Payment Modal */}
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