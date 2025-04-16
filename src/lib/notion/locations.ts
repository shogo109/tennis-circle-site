import { Client } from "@notionhq/client";
import { Location } from "@/types/location";

// サーバーサイドでのみ実行されることを確認
if (typeof window === "undefined") {
  if (!process.env.NOTION_API_KEY) {
    throw new Error("NOTION_API_KEY is not defined");
  }
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getLocations(): Promise<Location[]> {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not defined");
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      sorts: [
        {
          property: "_id",
          direction: "ascending",
        },
      ],
    });

    return response.results.map((page: any) => ({
      id: page.id,
      _id: page.properties._id?.number || 0,
      notionPageId: page.id,
      name: page.properties.location_name.rich_text[0]?.plain_text || "",
      address: page.properties.address.rich_text[0]?.plain_text || "",
      map_url: page.properties.map_url?.url || undefined,
      category: page.properties.category?.select?.name || "",
    }));
  } catch (error) {
    console.error("Error fetching locations from Notion:", error);
    throw error;
  }
}

export async function getLocationById(locationId: string): Promise<Location | null> {
  try {
    const response = await notion.pages.retrieve({ page_id: locationId });
    return {
      id: response.id,
      _id: (response as any).properties._id?.number || 0,
      notionPageId: response.id,
      name: (response as any).properties.location_name.rich_text[0]?.plain_text || "",
      address: (response as any).properties.address.rich_text[0]?.plain_text || "",
      map_url: (response as any).properties.map_url?.url || undefined,
      category: (response as any).properties.category?.select?.name || "",
    };
  } catch (error) {
    console.error(`Error fetching location ${locationId}:`, error);
    return null;
  }
}

async function getMaxLocationId(): Promise<number> {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not defined");
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
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

    const page = response.results[0] as any;
    return page.properties._id?.number || 0;
  } catch (error) {
    console.error("Error getting max location ID:", error);
    return 0;
  }
}

export async function createLocation({
  locationName,
  address,
  category,
  tell,
  mapUrl,
}: {
  locationName: string;
  address: string;
  category: string;
  tell: string;
  mapUrl: string;
}) {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not defined");
  }

  try {
    // 最大のIDを取得して+1する
    const maxId = await getMaxLocationId();
    const newId = maxId + 1;

    const response = await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      properties: {
        _id: {
          number: newId,
        },
        location_name: {
          rich_text: [
            {
              text: {
                content: locationName,
              },
            },
          ],
        },
        address: {
          rich_text: [
            {
              text: {
                content: address,
              },
            },
          ],
        },
        category: {
          select: {
            name: category,
          },
        },
        tell: {
          rich_text: [
            {
              text: {
                content: tell,
              },
            },
          ],
        },
        map_url: {
          url: mapUrl,
        },
      },
    });

    return {
      id: response.id,
      _id: newId,
      notionPageId: response.id,
      name: locationName,
      address,
      category,
      tell,
      map_url: mapUrl,
    };
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
}

// 既存のカテゴリー一覧を取得する関数
export async function getCategories(): Promise<string[]> {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not defined");
  }

  try {
    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    const categoryOptions = (response as any).properties.category.select.options;
    return categoryOptions.map((option: any) => option.name);
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}
