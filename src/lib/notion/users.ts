import { Client } from "@notionhq/client";
import { PageObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const USER_DATABASE_ID = process.env.NOTION_USER_DATABASE_ID || "";

export async function getUser(username: string) {
  try {
    // 入力された名前からスペースを削除
    const normalizedInputUsername = username.replace(/\s+/g, "");

    const response = await notion.databases.query({
      database_id: USER_DATABASE_ID,
    });

    // 全ユーザーの中からスペースを無視して一致するものを探す
    const user = response.results.find((page) => {
      const pageUser = page as PageObjectResponse;
      const nameProperty = pageUser.properties.name as { rich_text: RichTextItemResponse[] };
      const notionUsername = nameProperty.rich_text[0]?.plain_text || "";
      const normalizedNotionUsername = notionUsername.replace(/\s+/g, "");
      return normalizedNotionUsername === normalizedInputUsername;
    });

    if (!user) {
      return null;
    }

    const pageUser = user as PageObjectResponse;
    const nameProperty = pageUser.properties.name as { rich_text: RichTextItemResponse[] };
    const idProperty = pageUser.properties._id as { number: number };
    const adminProperty = pageUser.properties.admin as { number: number };

    return {
      id: user.id,
      _id: idProperty?.number || 0,
      name: nameProperty.rich_text[0]?.plain_text || "",
      admin: adminProperty?.number === 1,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

async function getMaxUserId(): Promise<number> {
  try {
    const response = await notion.databases.query({
      database_id: USER_DATABASE_ID,
      sorts: [
        {
          property: "_id",
          direction: "descending",
        },
      ],
      page_size: 1,
    });

    if (response.results.length === 0) {
      return 0;
    }

    const page = response.results[0] as PageObjectResponse;
    const idProperty = page.properties._id as { number: number };
    return idProperty?.number || 0;
  } catch (error) {
    console.error("Error getting max user ID:", error);
    return 0;
  }
}
