import dbConnect from "@/lib/mongoose";
import Room from "@/models/Room";

export async function GET(request) {
  await dbConnect();
  try {
    const rooms = await Room.find({ status: "active" });
    return new Response(JSON.stringify(rooms), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch rooms" }), { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const room = new Room(body);
    await room.save();
    return new Response(JSON.stringify(room), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to create room" }), { status: 500 });
  }
}
