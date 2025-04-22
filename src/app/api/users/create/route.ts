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

export async function POST(request: Request) {
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

    // リクエストボディを取得
    const body = await request.json();
    const { name, display_name, admin } = body;

    if (!name || !display_name) {
      return NextResponse.json({ error: "名前と表示名は必須です" }, { status: 400 });
    }

    // 既存のユーザーをチェック（名前の重複と最大_id値の取得）
    const existingUsers = await notion.databases.query({
      database_id: process.env.NOTION_USER_DATABASE_ID,
      sorts: [
        {
          property: "_id",
          direction: "descending",
        },
      ],
    });

    // 名前の重複チェック
    const duplicateUser = existingUsers.results.find(
      (user: any) => user.properties.name.title[0]?.plain_text === name
    );
    if (duplicateUser) {
      return NextResponse.json({ error: "このユーザー名は既に使用されています" }, { status: 409 });
    }

    // 最大_id値の取得
    const maxId =
      existingUsers.results.length > 0
        ? (existingUsers.results[0] as any).properties._id.number
        : 0;
    const newId = maxId + 1;

    // 新しいユーザーを作成
    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_USER_DATABASE_ID,
      },
      properties: {
        name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        display_name: {
          rich_text: [
            {
              text: {
                content: display_name,
              },
            },
          ],
        },
        admin: {
          number: admin,
        },
        _id: {
          number: newId,
        },
      },
    });

    return NextResponse.json({ success: true, user: response });
  } catch (error: any) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      {
        error: "Failed to create user",
        details: error.message,
        code: error.code,
        status: error.status,
      },
      { status: error.status || 500 }
    );
  }
}
