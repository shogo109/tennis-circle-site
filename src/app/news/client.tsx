"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useMemo } from "react";
import type { NewsInfo } from "@/lib/notion/news";
import Image from "next/image";

// カテゴリーごとの色のパレット
const colorPalette = [
  "#4CAF50", // 緑
  "#F44336", // 赤
  "#2196F3", // 青
  "#FF9800", // オレンジ
  "#9C27B0", // 紫
  "#00BCD4", // シアン
  "#795548", // 茶色
  "#607D8B", // ブルーグレー
];

interface NewsPageProps {
  news: NewsInfo[];
}

export default function ClientNews({ news }: NewsPageProps) {
  // カテゴリーごとの色を動的に生成
  const categoryColors = useMemo(() => {
    const uniqueCategories = Array.from(new Set(news.map((item) => item.category)));
    return uniqueCategories.reduce((acc, category, index) => {
      acc[category] = colorPalette[index % colorPalette.length];
      return acc;
    }, {} as Record<string, string>);
  }, [news]);

  return (
    <main className="min-h-screen">
      {/* ヒーローセクション */}
      <div className="relative h-[40vh] min-h-[400px]">
        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070"
            alt="テニスコート"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-tennis-court/90 to-primary-600/80" />
        </div>

        {/* コンテンツ */}
        <div className="relative h-full flex flex-col items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-tennis-line mb-4 drop-shadow-lg">
              お知らせ一覧
            </h1>
            <p className="text-xl text-tennis-line/90 drop-shadow-md max-w-2xl mx-auto">
              テニスサークルからの最新情報をお届けします
            </p>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-6">
          {news.map((item) => (
            <Link
              key={item._id}
              href={`/news/${item._id}`}
              className="block bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <time
                  className="text-sm text-gray-500"
                  dateTime={item.register_date}
                >
                  {format(new Date(item.register_date), "yyyy.MM.dd", {
                    locale: ja,
                  })}
                </time>
                <span
                  className="px-3 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: `${categoryColors[item.category]}20`,
                    color: categoryColors[item.category],
                  }}
                >
                  {item.category}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-bold text-gray-900 hover:text-tennis-court transition-colors">
                {item.title}
              </h2>
              <p className="mt-2 text-gray-600 line-clamp-2">{item.body}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
