import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { compare } from "bcryptjs";

export async function POST(request) {
  await dbConnect();

  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
  }

  try {
    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      return new Response(JSON.stringify({ error: "No admin user found with this email" }), { status: 401 });
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 });
    }

    // Here you can generate a token or session as needed, but since NextAuth is used, this might be handled elsewhere.

    return new Response(JSON.stringify({ message: "Admin login successful" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
