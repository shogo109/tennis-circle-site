import { NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is not defined");
}

if (!process.env.NOTION_USER_DATABASE_ID) {
  throw new Error("NOTION_USER_DATABASE_ID is not defined");
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function GET(request: Request, { params }: { params: { username: string } }) {
  try {
    const username = decodeURIComponent(params.username);

    // ユーザーを検索
    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_DATABASE_ID,
      filter: {
        property: "name",
        title: {
          equals: username,
        },
      },
    });

    if (response.results.length === 0) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    const user = response.results[0] as PageObjectResponse;

    return NextResponse.json({
      id: user.id,
      username:
        (user.properties.name as { title: Array<{ plain_text: string }> }).title[0]?.plain_text ||
        "",
      display_name:
        (user.properties.display_name as { rich_text: Array<{ plain_text: string }> }).rich_text[0]
          ?.plain_text || "",
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        error: "ユーザー情報の取得に失敗しました",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
