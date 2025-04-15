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
