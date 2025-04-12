import { Client } from "@notionhq/client";

if (!process.env.NOTION_API_KEY) {
  throw new Error("NOTION_API_KEY is not defined");
}

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export async function getDatabase() {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not defined");
  }

  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  return response.results;
}
