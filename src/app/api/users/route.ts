import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is not defined");
}

if (!process.env.NOTION_USER_DATABASE_ID) {
  throw new Error("NOTION_USER_DATABASE_ID is not defined");
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function GET() {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_DATABASE_ID,
      sorts: [
        {
          property: "name",
          direction: "ascending",
        },
      ],
    });

    const users = response.results.map((page: any) => ({
      id: page.id,
      username: page.properties.name.rich_text[0]?.plain_text || "",
      notionUserId: page.id,
    }));

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: error.message,
        code: error.code,
        status: error.status,
      },
      { status: error.status || 500 }
    );
  }
}
