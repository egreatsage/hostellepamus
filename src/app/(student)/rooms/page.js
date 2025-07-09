// src/app/(student)/rooms/page.js
"use client";

import { useEffect, useState } from "react";
import useRoomStore from "@/store/useRoomStore";
import Link from "next/link";
import { 
  HomeIcon, 
  UserGroupIcon, 
  BanknotesIcon,
  FunnelIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from "@heroicons/react/24/outline";

export default function StudentRoomsPage() {
  const { rooms, fetchRooms, loading, error } = useRoomStore();
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [filters, setFilters] = useState({
    gender: "All",
    minPrice: "",
    maxPrice: "",
    capacity: "All",
    block: "All"
  });
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  useEffect(() => {
    let filtered = rooms;

    // Filter by gender
    if (filters.gender !== "All") {
      filtered = filtered.filter(room => room.gender === filters.gender);
    }

    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter(room => room.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(room => room.price <= parseFloat(filters.maxPrice));
    }

    // Filter by capacity
    if (filters.capacity !== "All") {
      filtered = filtered.filter(room => room.capacity === parseInt(filters.capacity));
    }

    // Filter by block
    if (filters.block !== "All") {
      filtered = filtered.filter(room => room.block === filters.block);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(room => 
        room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.block.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRooms(filtered);
  }, [rooms, filters, searchTerm]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      gender: "All",
      minPrice: "",
      maxPrice: "",
      capacity: "All",
      block: "All"
    });
    setSearchTerm("");
  };

  const getUniqueBlocks = () => {
    return [...new Set(rooms.map(room => room.block))];
  };

  const getUniqueCapacities = () => {
    return [...new Set(rooms.map(room => room.capacity))].sort((a, b) => a - b);
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "All" && value !== "").length + (searchTerm ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EFD09E] to-[#D4AA7D] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#272727] mb-4">
            Available Rooms
          </h1>
          <p className="text-[#272727] opacity-80 text-lg max-w-2xl mx-auto">
            Find your perfect room with our comprehensive filtering options. Select a room to view more details and proceed with your booking.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
        

          {/* Filter Toggle Button */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#272727] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors duration-300"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-[#D4AA7D] text-[#272727] px-2 py-1 rounded-full text-xs font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-300"
              >
                <XMarkIcon className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-200">
              {/* Gender Filter */}
              <div>
                <label className="block text-sm font-bold text-[#272727] mb-2">Gender</label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange("gender", e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#D4AA7D] focus:outline-none focus:ring-2 focus:ring-[#D4AA7D] focus:ring-opacity-20 transition-all duration-300"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-bold text-[#272727] mb-2">Price Range (KSh)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    className="w-1/2 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#D4AA7D] focus:outline-none focus:ring-2 focus:ring-[#D4AA7D] focus:ring-opacity-20 transition-all duration-300"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    className="w-1/2 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#D4AA7D] focus:outline-none focus:ring-2 focus:ring-[#D4AA7D] focus:ring-opacity-20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Capacity Filter */}
              <div>
                <label className="block text-sm font-bold text-[#272727] mb-2">Sharing Type</label>
                <select
                  value={filters.capacity}
                  onChange={(e) => handleFilterChange("capacity", e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#D4AA7D] focus:outline-none focus:ring-2 focus:ring-[#D4AA7D] focus:ring-opacity-20 transition-all duration-300"
                >
                  <option value="All">All Types</option>
                  {getUniqueCapacities().map(capacity => (
                    <option key={capacity} value={capacity}>{capacity} Person{capacity > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-[#272727] font-semibold">
            Showing {filteredRooms.length} of {rooms.length} rooms
          </p>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#272727]"></div>
            <span className="ml-3 text-[#272727] font-semibold">Loading rooms...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏠</div>
            <h3 className="text-2xl font-bold text-[#272727] mb-2">No rooms found</h3>
            <p className="text-[#272727] opacity-70 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-[#272727] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors duration-300"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Room Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map(room => (
            <Link href={`/rooms/${room._id}`} key={room._id}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <div className="bg-gradient-to-r from-[#272727] to-[#3a3a3a] p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">
                      Room {room.roomNumber}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      room.gender === 'Male' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-pink-100 text-pink-800'
                    }`}>
                      {room.gender}
                    </span>
                  </div>
                </div>

                {/* Room Details */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-[#272727] group-hover:text-[#D4AA7D] transition-colors duration-300">
                      <HomeIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span className="font-medium">Block {room.block}</span>
                    </div>
                    
                    <div className="flex items-center text-[#272727] group-hover:text-[#D4AA7D] transition-colors duration-300">
                      <UserGroupIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span className="font-medium">
                        Capacity: {room.capacity} Person{room.capacity > 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-[#272727] group-hover:text-[#D4AA7D] transition-colors duration-300">
                      <BanknotesIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                      <span className="font-medium">
                        KSh {room.price.toLocaleString()} / month
                      </span>
                    </div>
                  </div>

                  {/* Price Highlight */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                   <div className="bg-green-800 px-3 py-2 md:w-28 w-full text-sm hover:bg-green-700 rounded-lg text-white">
                      Click to book
                   </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}