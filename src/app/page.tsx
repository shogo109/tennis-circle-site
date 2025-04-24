import { getLatestNews } from "@/lib/notion/news";
import ClientHome from "./client";

export default async function Home() {
  const news = await getLatestNews(3);
  return <ClientHome news={news} />;
}
