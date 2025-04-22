import { NextResponse } from "next/server";
import { createLocation, getCategories, getLocations } from "@/lib/notion/locations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { locationName, address, category, tell, mapUrl } = body;

    const newLocation = await createLocation({
      locationName,
      address,
      category,
      tell,
      mapUrl,
    });

    return NextResponse.json(newLocation);
  } catch (error) {
    console.error("Error in POST /api/locations:", error);
    return NextResponse.json({ error: "場所の登録に失敗しました" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const locations = await getLocations();
    if (!Array.isArray(locations)) {
      throw new Error("Invalid locations data format");
    }
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Error in GET /api/locations:", error);
    return NextResponse.json({ error: "データの取得に失敗しました" }, { status: 500 });
  }
}
