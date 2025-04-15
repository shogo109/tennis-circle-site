import { Client } from "@notionhq/client";
import { Event } from "@/types/event";
import { getLocationById } from "./locations";

// サーバーサイドでのみ実行されることを確認
if (typeof window === "undefined") {
  if (!process.env.NOTION_API_KEY) {
    throw new Error("NOTION_API_KEY is not defined");
  }
}

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getEvents(): Promise<Event[]> {
  if (!process.env.NOTION_EVENTS_DATABASE_ID) {
    throw new Error("NOTION_EVENTS_DATABASE_ID is not defined");
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_EVENTS_DATABASE_ID,
      sorts: [
        {
          property: "event_date",
          direction: "ascending",
        },
      ],
    });

    const events = await Promise.all(
      response.results.map(async (page: any) => {
        // 場所の情報を取得
        const locationId = page.properties["location_id"]?.relation[0]?.id;
        const eventId = page.properties["_id"]?.number;

        let location = null;

        if (locationId) {
          try {
            location = await getLocationById(locationId);
          } catch (error) {
            console.error("Error fetching location:", error);
          }
        }

        // デフォルトの場所情報
        const defaultLocation = {
          id: "",
          notionPageId: "",
          name: "場所未定",
          address: "",
          map_url: "",
        };

        return {
          id: page.id,
          _id: eventId || 0,
          notionPageId: page.id,
          startDate: page.properties.event_date.date.start,
          endDate: page.properties.event_date.date.end || null,
          location: location || defaultLocation,
        };
      })
    );

    // 日付でソート
    events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return events;
  } catch (error) {
    console.error("Error fetching events from Notion:", error);
    throw error;
  }
}

export async function getLocation(locationId: string) {
  try {
    const response = await notion.pages.retrieve({ page_id: locationId });
    return {
      id: response.id,
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

async function getMaxEventId(): Promise<number> {
  if (!process.env.NOTION_EVENTS_DATABASE_ID) {
    throw new Error("NOTION_EVENTS_DATABASE_ID is not defined");
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_EVENTS_DATABASE_ID,
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
    console.error("Error getting max event ID:", error);
    return 0;
  }
}
