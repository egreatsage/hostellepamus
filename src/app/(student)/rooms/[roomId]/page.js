// src/app/(student)/rooms/[roomId]/page.js
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useRoomStore from '@/store/useRoomStore';
import Link from 'next/link';
import { 
  HomeIcon, 
  UserGroupIcon, 
  BanknotesIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function RoomDetailsPage() {
    const { roomId } = useParams();
    const router = useRouter();
    const { rooms, fetchRooms, loading } = useRoomStore();
    const [room, setRoom] = useState(null);

    useEffect(() => {
        if (rooms.length === 0) {
            fetchRooms();
        }
    }, [rooms.length, fetchRooms]);

    useEffect(() => {
        if (rooms.length > 0) {
            const currentRoom = rooms.find(r => r._id === roomId);
            setRoom(currentRoom);
        }
    }, [roomId, rooms]);

    if (loading || !room) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#EFD09E] to-[#D4AA7D] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#272727] mx-auto mb-4"></div>
                    <p className="text-[#272727] text-lg font-semibold">Loading room details...</p>
                </div>
            </div>
        );
    }

    const features = [
        "Free Wi-Fi",
        "24/7 Security",
        "Laundry Services",
        "Common Kitchen",
        "Study Area",
        "Parking Available"
    ];

    const amenities = [
        { icon: "🛏️", name: "Furnished Room", description: "Bed, desk, and wardrobe included" },
        { icon: "🚿", name: "Private Bathroom", description: "Clean and modern facilities" },
        { icon: "🌐", name: "High-Speed Internet", description: "Reliable connection for studies" },
        { icon: "🔒", name: "Secure Access", description: "Key card entry system" },
        { icon: "🧹", name: "Cleaning Service", description: "Weekly room cleaning" },
        { icon: "⚡", name: "Utilities Included", description: "Water, electricity, and gas" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EFD09E] to-[#D4AA7D] py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg text-[#272727] hover:bg-opacity-30 transition-all duration-300 font-semibold"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        <span>Back to Rooms</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Room Header Card */}
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
                            {/* Hero Section */}
                            <div className="bg-gradient-to-r from-[#272727] to-[#3a3a3a] p-8 text-white">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div>
                                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                                            Room {room.roomNumber}
                                        </h1>
                                        <div className="flex items-center space-x-2 text-[#EFD09E]">
                                            <MapPinIcon className="h-5 w-5" />
                                            <span className="text-lg font-medium">Block {room.block}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon key={i} className="h-6 w-6 fill-[#D4AA7D] text-[#D4AA7D]" />
                                        ))}
                                        <span className="ml-2 text-sm opacity-90">(4.8)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Room Details */}
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-gradient-to-br from-[#EFD09E] to-[#D4AA7D] rounded-xl p-6 text-center">
                                        <UserGroupIcon className="h-8 w-8 mx-auto mb-3 text-[#272727]" />
                                        <div className="text-[#272727] font-bold text-lg mb-1">Gender</div>
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                                            room.gender === 'Male' 
                                                ? 'bg-blue-100 text-blue-800' 
                                                : 'bg-pink-100 text-pink-800'
                                        }`}>
                                            {room.gender}
                                        </span>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#EFD09E] to-[#D4AA7D] rounded-xl p-6 text-center">
                                        <UserGroupIcon className="h-8 w-8 mx-auto mb-3 text-[#272727]" />
                                        <div className="text-[#272727] font-bold text-lg mb-1">Capacity</div>
                                        <div className="text-2xl font-bold text-[#272727]">
                                            {room.capacity} Person{room.capacity > 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#EFD09E] to-[#D4AA7D] rounded-xl p-6 text-center">
                                        <BanknotesIcon className="h-8 w-8 mx-auto mb-3 text-[#272727]" />
                                        <div className="text-[#272727] font-bold text-lg mb-1">Monthly Rate</div>
                                        <div className="text-2xl font-bold text-[#272727]">
                                            KSh {room.price.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-[#272727] mb-4">Room Features</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {features.map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                                                <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                                                <span className="text-[#272727] font-medium text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Amenities */}
                                <div>
                                    <h3 className="text-2xl font-bold text-[#272727] mb-4">Amenities</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                                                <div className="text-2xl">{amenity.icon}</div>
                                                <div>
                                                    <h4 className="font-bold text-[#272727] mb-1">{amenity.name}</h4>
                                                    <p className="text-gray-600 text-sm">{amenity.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-2xl p-8 sticky top-8">
                            {/* Price Summary */}
                            <div className="text-center mb-8">
                                <div className="text-4xl font-bold text-[#272727] mb-2">
                                    KSh {room.price.toLocaleString()}
                                </div>
                                <div className="text-gray-600">per month</div>
                            </div>

                            {/* Availability Status */}
                            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center justify-center space-x-2">
                                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                                    <span className="text-green-700 font-bold">Available Now</span>
                                </div>
                            </div>

                            {/* Quick Info */}
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Room Type</span>
                                    <span className="font-semibold text-[#272727]">{room.gender} Only</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Occupancy</span>
                                    <span className="font-semibold text-[#272727]">{room.capacity} Person{room.capacity > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-600">Block</span>
                                    <span className="font-semibold text-[#272727]">{room.block}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-gray-600">Availability</span>
                                    <span className="font-semibold text-green-600">Immediate</span>
                                </div>
                            </div>

                            {/* Booking Button */}
                            <Link href={`/book/${room._id}`}>
                                <button className="w-full bg-gradient-to-r from-[#272727] to-[#3a3a3a] text-white py-4 rounded-lg text-lg font-bold hover:from-[#3a3a3a] hover:to-[#272727] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                    Book This Room
                                </button>
                            </Link>

                            {/* Contact Info */}
                            <div className="mt-6 p-4 bg-[#EFD09E] bg-opacity-30 rounded-lg">
                                <div className="text-center">
                                    <h4 className="font-bold text-[#272727] mb-2">Need Help?</h4>
                                    <p className="text-sm text-[#272727] opacity-80 mb-3">
                                        Contact our support team for assistance
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-center space-x-2">
                                            <ClockIcon className="h-4 w-4 text-[#272727]" />
                                            <span className="text-[#272727]">24/7 Support</span>
                                        </div>
                                        <div className="font-semibold text-[#272727]">
                                            📞 +254 700 123 456
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}