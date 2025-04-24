import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

const NEWS_DATABASE_ID = process.env.NOTION_NEWS_DATABASE_ID || "";

export type NewsInfo = {
  _id: number;
  category: string;
  title: string;
  body: string;
  register_date: string;
};

export async function getLatestNews(limit: number = 3): Promise<NewsInfo[]> {
  try {
    const response = await notion.databases.query({
      database_id: NEWS_DATABASE_ID,
      sorts: [
        {
          property: "register_date",
          direction: "descending",
        },
      ],
      page_size: limit,
    });

    return response.results.map((page) => {
      const pageNews = page as PageObjectResponse;
      const properties = pageNews.properties;

      return {
        _id: (properties._id as any).number || 0,
        category: (properties.category as any).select.name || "",
        title: (properties.title as any).title[0]?.plain_text || "",
        body: (properties.body as any).rich_text[0]?.plain_text || "",
        register_date: (properties.register_date as any).date?.start || "",
      };
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function getNewsById(id: number): Promise<NewsInfo | null> {
  try {
    const response = await notion.databases.query({
      database_id: NEWS_DATABASE_ID,
      filter: {
        property: "_id",
        number: {
          equals: id,
        },
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0] as PageObjectResponse;
    const properties = page.properties;

    return {
      _id: (properties._id as any).number || 0,
      category: (properties.category as any).select.name || "",
      title: (properties.title as any).title[0]?.plain_text || "",
      body: (properties.body as any).rich_text[0]?.plain_text || "",
      register_date: (properties.register_date as any).date?.start || "",
    };
  } catch (error) {
    console.error("Error fetching news by id:", error);
    return null;
  }
}
