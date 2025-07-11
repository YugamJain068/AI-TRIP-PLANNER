import Trip from "@/db/models/Trip";
import mongoose from "mongoose";
import connectDb from "@/db/connectDb";

export async function POST(req) {
  try {
    await connectDb();
    const { userId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid userId");
    }

    const saved_trips = await Trip.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();

    return new Response(JSON.stringify({ saved_trips }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching trips:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load saved trips" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

