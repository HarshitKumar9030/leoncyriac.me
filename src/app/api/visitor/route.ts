import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/lib/connect";
import LastVisited from "@/models/LastVisited";

export async function GET() {
  await connectDb();

  try {
    const lastVisited = await LastVisited.findOne();
    if (lastVisited) {
      return NextResponse.json({
        city: lastVisited.city,
        country: lastVisited.country,
        views: lastVisited.views,
      });
    } else {
      return NextResponse.json({
        city: "Unknown",
        country: "Unknown",
        views: 0,
      });
    }
  } catch (error) {
    console.error("Error fetching last visited:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connectDb();

  // Getting visitor's IP address
  const body = await request.json();
  let ip = body.ip;
  

  try {
    // Fetch location data using ipapi.co
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    const city = data.city || "Unknown";
    const country = data.country_name || "Unknown";

    // Update the last visited document
    const update = {
      city,
      country,
      timestamp: new Date(),
      $inc: { views: 1 },
    };

    const lastVisited = await LastVisited.findOneAndUpdate({}, update, {
      new: true,
      upsert: true,
    });

    return NextResponse.json({
      city: lastVisited.city,
      country: lastVisited.country,
      views: lastVisited.views,
    });
  } catch (error) {
    console.error("Error fetching location:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
