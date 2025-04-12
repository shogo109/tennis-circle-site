import { Client } from "@notionhq/client";
import { Location } from "@/types/location";

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is not defined");
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
    });

    console.log("Notion API Response:", JSON.stringify(response.results[0], null, 2));

    return response.results.map((page: any) => ({
      id: page.id,
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
