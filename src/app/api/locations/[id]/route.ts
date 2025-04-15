import { NextResponse } from "next/server";
import { getLocationById } from "@/lib/notion/locations";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const location = await getLocationById(params.id);

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json(location);
  } catch (error) {
    console.error("Error fetching location:", error);
    return NextResponse.json({ error: "Failed to fetch location" }, { status: 500 });
  }
}
