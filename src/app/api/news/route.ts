import { NextResponse } from "next/server";
import { getLatestNews } from "@/lib/notion/news";

export async function GET() {
  try {
    const news = await getLatestNews(3);
    return NextResponse.json(news);
  } catch (error) {
    console.error("Failed to fetch news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
