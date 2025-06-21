import  connectDb  from "@/db/connectDb"
import User from "@/db/models/User"
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, email, password, confirm_password } = body;

    if (!username || !email || !password || !confirm_password) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    if (password.length < 6) {
      return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    if (password !== confirm_password) {
      return Response.json({ error: "Passwords do not match" }, { status: 400 });
    }

    await connectDb();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username: username, email: email, password: hashedPassword });
    await newUser.save();

    return Response.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
