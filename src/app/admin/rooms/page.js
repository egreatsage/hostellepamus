"use client";

import { useEffect } from "react";
import useRoomStore from "@/store/useRoomStore";
import RoomInfoForm from "@/components/RoomInfoForm";
import toast from "react-hot-toast";

export default function RoomsPage() {
  const { rooms, fetchRooms, createRoom, updateRoom, deleteRoom, loading, error } = useRoomStore();

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreate = async (data) => {
    try {
      await createRoom(data);
      toast.success("Room created successfully");
    } catch {
      toast.error("Failed to create room");
    }
  };

  const handleUpdate = async (roomId, data) => {
    try {
      await updateRoom(roomId, data);
      toast.success("Room updated successfully");
    } catch {
      toast.error("Failed to update room");
    }
  };

  const handleDelete = async (roomId) => {
    try {
      await deleteRoom(roomId);
      toast.success("Room deleted successfully");
    } catch {
      toast.error("Failed to delete room");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Rooms</h1>
      {loading && <p>Loading rooms...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div>
        {rooms.map((room) => (
          <div key={room._id} className="border p-4 mb-4 rounded">
            <p><strong>Block:</strong> {room.block}</p>
            <p><strong>Room Number:</strong> {room.roomNumber}</p>
            <p><strong>Gender:</strong> {room.gender}</p>
            <p><strong>Capacity:</strong> {room.capacity}</p>
            <p><strong>Price:</strong> ${room.price}</p>
            <p><strong>Status:</strong> {room.status}</p>
            {/* Add buttons or links to edit/delete here */}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Add New Room</h2>
        <RoomInfoForm onSubmit={handleCreate} />
      </div>
    </div>
  );
}
