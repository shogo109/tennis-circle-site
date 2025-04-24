"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { useMemo } from "react";
import type { NewsInfo } from "@/lib/notion/news";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

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

interface NewsDetailProps {
  news: NewsInfo;
}

export default function ClientNewsDetail({ news }: NewsDetailProps) {
  // カテゴリーの色を生成
  const categoryColor = useMemo(() => {
    const index =
      Math.abs(
        news.category.split("").reduce((acc, char) => {
          return acc + char.charCodeAt(0);
        }, 0)
      ) % colorPalette.length;
    return colorPalette[index];
  }, [news.category]);

  return (
    <main className="min-h-screen py-16 bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-tennis-court hover:text-tennis-court/80 mb-8 font-medium"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          お知らせ一覧に戻る
        </Link>

        <article>
          <div className="flex items-center gap-4 mb-4">
            <time
              className="text-sm text-gray-500"
              dateTime={news.register_date}
            >
              {format(new Date(news.register_date), "yyyy.MM.dd", {
                locale: ja,
              })}
            </time>
            <span
              className="px-3 py-1 text-xs font-medium rounded-full"
              style={{
                backgroundColor: `${categoryColor}20`,
                color: categoryColor,
              }}
            >
              {news.category}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">{news.title}</h1>

          <div className="bg-white rounded-xl p-8 shadow-sm">
            <div className="prose prose-tennis max-w-none">
              {news.body.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
