import { Client } from "@notionhq/client";
import { PageObjectResponse, RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";
import { UserInfo } from "@/types/user";

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
      const nameProperty = pageUser.properties.name as { title: RichTextItemResponse[] };
      const notionUsername = nameProperty.title[0]?.plain_text || "";
      const normalizedNotionUsername = notionUsername.replace(/\s+/g, "");
      return normalizedNotionUsername === normalizedInputUsername;
    });

    if (!user) {
      return null;
    }

    const pageUser = user as PageObjectResponse;
    const nameProperty = pageUser.properties.name as { title: RichTextItemResponse[] };
    const idProperty = pageUser.properties._id as { number: number };
    const adminProperty = pageUser.properties.admin as { number: number };
    const displayNameProperty = pageUser.properties.display_name as {
      rich_text: RichTextItemResponse[];
    };

    return {
      id: user.id,
      _id: idProperty?.number || 0,
      name: nameProperty.title[0]?.plain_text || "",
      display_name: displayNameProperty?.rich_text[0]?.plain_text || "",
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

export async function getUsers(): Promise<UserInfo[]> {
  const response = await notion.databases.query({
    database_id: USER_DATABASE_ID,
    sorts: [
      {
        property: "name",
        direction: "ascending",
      },
    ],
  });

  return response.results.map((page: PageObjectResponse) => {
    const nameProperty = page.properties.name as { title: RichTextItemResponse[] };
    const idProperty = page.properties._id as { number: number };
    const adminProperty = page.properties.admin as { number: number };
    const displayNameProperty = page.properties.display_name as {
      rich_text: RichTextItemResponse[];
    };

    return {
      id: page.id,
      _id: idProperty?.number || 0,
      username: nameProperty.title[0]?.plain_text || "",
      display_name: displayNameProperty?.rich_text[0]?.plain_text || "",
      admin: adminProperty?.number === 1,
    };
  });
}

export async function updateUser(data: {
  id: string;
  username: string;
  display_name?: string;
  admin: boolean;
}): Promise<UserInfo> {
  const response = await notion.pages.update({
    page_id: data.id,
    properties: {
      name: {
        title: [
          {
            text: {
              content: data.username,
            },
          },
        ],
      },
      display_name: {
        rich_text: data.display_name
          ? [
              {
                text: {
                  content: data.display_name,
                },
              },
            ]
          : [],
      },
      admin: {
        number: data.admin ? 1 : 0,
      },
    },
  });

  const page = response as PageObjectResponse;
  const nameProperty = page.properties.name as { title: RichTextItemResponse[] };
  const idProperty = page.properties._id as { number: number };
  const adminProperty = page.properties.admin as { number: number };
  const displayNameProperty = page.properties.display_name as {
    rich_text: RichTextItemResponse[];
  };

  return {
    id: page.id,
    _id: idProperty?.number || 0,
    username: nameProperty.title[0]?.plain_text || "",
    display_name: displayNameProperty?.rich_text[0]?.plain_text || "",
    admin: adminProperty?.number === 1,
  };
}
