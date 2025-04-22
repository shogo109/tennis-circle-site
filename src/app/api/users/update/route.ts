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

export async function PUT(request: Request) {
  try {
    const { old_username, username, display_name } = await request.json();

    // 新しいユーザー名が既に存在するかチェック（古いユーザー名と同じ場合を除く）
    if (old_username !== username) {
      const existingUserResponse = await notion.databases.query({
        database_id: process.env.NOTION_USER_DATABASE_ID,
        filter: {
          property: "name",
          title: {
            equals: username,
          },
        },
      });

      if (existingUserResponse.results.length > 0) {
        return NextResponse.json(
          { error: "このユーザー名は既に使用されています" },
          { status: 400 }
        );
      }
    }

    // 現在のユーザーを検索
    const response = await notion.databases.query({
      database_id: process.env.NOTION_USER_DATABASE_ID,
      filter: {
        property: "name",
        title: {
          equals: old_username,
        },
      },
    });

    if (response.results.length === 0) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    const userId = response.results[0].id;

    // ユーザー情報を更新
    const updatedUser = await notion.pages.update({
      page_id: userId,
      properties: {
        name: {
          title: [
            {
              type: "text",
              text: {
                content: username,
              },
            },
          ],
        },
        display_name: {
          rich_text: [
            {
              type: "text",
              text: {
                content: display_name,
              },
            },
          ],
        },
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      username,
      display_name,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        error: "ユーザー情報の更新に失敗しました",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
