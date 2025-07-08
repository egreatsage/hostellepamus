"use client";

import { useEffect, useState } from "react";
import useRoomStore from "@/store/useRoomStore";
import RoomInfoForm from "@/components/RoomInfoForm";
import toast, { Toaster } from "react-hot-toast";
import BulkAddRooms from "@/components/BulkAddRooms";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, HomeIcon } from "@heroicons/react/24/outline";

export default function RoomsPage() {
  const { rooms, fetchRooms, createRoom, updateRoom, deleteRoom, loading, error } = useRoomStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleOpenModal = (room = null) => {
    setEditingRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRoom(null);
    setIsModalOpen(false);
  };

  const handleOpenBulkModal = () => {
    setIsBulkModalOpen(true);
  };

  const handleCloseBulkModal = () => {
    setIsBulkModalOpen(false);
  };

  const handleSubmit = async (data) => {
    try {
      if (editingRoom) {
        await updateRoom(editingRoom._id, data);
        toast.success("Room updated successfully");
      } else {
        await createRoom(data);
        toast.success("Room created successfully");
      }
      handleCloseModal();
    } catch {
      toast.error(`Failed to ${editingRoom ? 'update' : 'create'} room`);
    }
  };

  const handleDelete = async (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteRoom(roomId);
        toast.success("Room deleted successfully");
      } catch {
        toast.error("Failed to delete room");
      }
    }
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.block.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: rooms.length,
    active: rooms.filter(r => r.status === 'active').length,
    inactive: rooms.filter(r => r.status === 'inactive').length,
    occupancy: Math.round((rooms.filter(r => r.status === 'active').length / rooms.length) * 100) || 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Toaster 
        position="top-center"
        toastOptions={{
          className: 'shadow-lg',
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
          },
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <HomeIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Room Management
                </h1>
                <p className="text-slate-600 mt-1">Manage your accommodation inventory</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleOpenModal()}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Room
              </button>
              <button
                onClick={handleOpenBulkModal}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Bulk Add
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Rooms</p>
                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <HomeIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Rooms</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Inactive Rooms</p>
                <p className="text-3xl font-bold text-red-600">{stats.inactive}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Occupancy Rate</p>
                <p className="text-3xl font-bold text-purple-600">{stats.occupancy}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <EyeIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search rooms by number or block..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modals */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800">
                  {editingRoom ? "Edit Room" : "Add New Room"}
                </h2>
              </div>
              <div className="p-6">
                <RoomInfoForm
                  onSubmit={handleSubmit}
                  defaultValues={editingRoom}
                  onCancel={handleCloseModal}
                />
              </div>
            </div>
          </div>
        )}

        {isBulkModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800">Bulk Add Rooms</h2>
              </div>
              <div className="p-6">
                <BulkAddRooms
                  onCancel={handleCloseBulkModal}
                  onBulkSubmit={async (data) => {
                    try {
                      await createRoom(data);
                      toast.success("Rooms added successfully!");
                      handleCloseBulkModal();
                    } catch (error) {
                      toast.error("Failed to add rooms in bulk.");
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}
        
        {/* Rooms Table */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">Block</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">Room No.</th>
                  <th className="py-4 px-6 text-left text-sm font-semibold text-slate-700">Gender</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-slate-700">Capacity</th>
                  <th className="py-4 px-6 text-right text-sm font-semibold text-slate-700">Price</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-slate-700">Status</th>
                  <th className="py-4 px-6 text-center text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRooms.map((room, index) => (
                  <tr key={room._id} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="py-4 px-6 text-sm font-medium text-slate-900">{room.block}</td>
                    <td className="py-4 px-6 text-sm text-slate-700">{room.roomNumber}</td>
                    <td className="py-4 px-6 text-sm text-slate-700">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        room.gender === 'Male' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-pink-100 text-pink-800'
                      }`}>
                        {room.gender}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-sm text-slate-700">{room.capacity}</td>
                    <td className="py-4 px-6 text-right text-sm font-medium text-slate-900">
                      ${room.price.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        room.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {room.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleOpenModal(room)} 
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Edit room"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(room._id)} 
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete room"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRooms.length === 0 && !loading && (
            <div className="text-center py-12">
              <HomeIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No rooms found</p>
              <p className="text-slate-400 text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}