import dbConnect from "@/lib/mongoose";
import Room from "@/models/Room";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  await dbConnect();
  try {
    const { roomId } = params;
    if (!ObjectId.isValid(roomId)) {
      return new Response(JSON.stringify({ error: "Invalid room ID" }), { status: 400 });
    }
    const room = await Room.findById(roomId);
    if (!room) {
      return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(room), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch room" }), { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  try {
    const { roomId } = params;
    if (!ObjectId.isValid(roomId)) {
      return new Response(JSON.stringify({ error: "Invalid room ID" }), { status: 400 });
    }
    const body = await request.json();
    const updatedRoom = await Room.findByIdAndUpdate(roomId, body, { new: true });
    if (!updatedRoom) {
      return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
    }
    return new Response(JSON.stringify(updatedRoom), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update room" }), { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const { roomId } = params;
    if (!ObjectId.isValid(roomId)) {
      return new Response(JSON.stringify({ error: "Invalid room ID" }), { status: 400 });
    }
    // Instead of deleting, set status to inactive
    const deletedRoom = await Room.findByIdAndUpdate(roomId, { status: "inactive" }, { new: true });
    if (!deletedRoom) {
      return new Response(JSON.stringify({ error: "Room not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "Room deactivated" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete room" }), { status: 500 });
  }
}
