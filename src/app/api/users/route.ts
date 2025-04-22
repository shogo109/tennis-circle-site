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

export async function GET(request: Request) {
  try {
    // リクエストヘッダーからユーザー情報を取得
    const authHeader = request.headers.get("x-auth-user");
    if (!authHeader) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const authUser = JSON.parse(decodeURIComponent(atob(authHeader)));
    if (!authUser.admin) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_DATABASE_ID,
      sorts: [
        {
          property: "name",
          direction: "ascending",
        },
      ],
    });

    const users = response.results.map((page) => {
      const user = page as PageObjectResponse;
      return {
        id: user.id,
        _id: (user.properties._id as { number: number }).number,
        username:
          (user.properties.name as { title: Array<{ plain_text: string }> }).title[0]?.plain_text ||
          "",
        display_name:
          (user.properties.display_name as { rich_text: Array<{ plain_text: string }> })
            .rich_text[0]?.plain_text || "",
        admin: (user.properties.admin as { number: number }).number === 1,
      };
    });

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
