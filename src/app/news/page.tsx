import { getLatestNews } from "@/lib/notion/news";
import ClientNews from "./client";

export const metadata = {
  title: "お知らせ一覧 | Joy'n Tennis",
  description: "テニスサークルJoy'n Tennisからのお知らせ一覧です。",
};

export default async function NewsPage() {
  const news = await getLatestNews(20); // 最新20件を取得
  return <ClientNews news={news} />;
}
