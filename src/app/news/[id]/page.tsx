import { getNewsById } from "@/lib/notion/news";
import ClientNewsDetail from "./client";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const news = await getNewsById(Number(params.id));

  if (!news) {
    return {
      title: "お知らせが見つかりません | Joy'n Tennis",
      description: "お探しのお知らせは見つかりませんでした。",
    };
  }

  return {
    title: `${news.title} | Joy'n Tennis`,
    description: news.body.slice(0, 100),
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const news = await getNewsById(Number(params.id));

  if (!news) {
    notFound();
  }

  return <ClientNewsDetail news={news} />;
}
