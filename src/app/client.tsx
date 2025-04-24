"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, ReactNode, useMemo } from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { NewsInfo } from "@/lib/notion/news";

// スクロールアニメーション用のコンポーネント
function AnimateOnScroll({
  children,
  className,
  animation = "animate-slide-up",
  delay = 0,
  margin = "-25% 0px",
}: {
  children: ReactNode;
  className?: string;
  animation?: string;
  delay?: number;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 要素が表示範囲に入ったらアニメーションクラスを適用
          setTimeout(() => {
            entry.target.classList.add(...animation.split(" "));
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: margin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [animation, delay, margin]);

  return (
    <div
      ref={ref}
      className={`opacity-0 ${className || ""}`}
    >
      {children}
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-accent-500">
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 text-tennis-court">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="flex items-start space-x-6">
      <div className="w-12 h-12 bg-gradient-to-br from-tennis-court to-primary-600 text-tennis-line rounded-2xl flex items-center justify-center font-bold text-xl shadow-md">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold text-tennis-court mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

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

interface HomeProps {
  news: NewsInfo[];
}

export default function ClientHome({ news }: HomeProps) {
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
      <div className="relative h-[70vh] overflow-hidden">
        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2940"
            alt="テニスコート"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-tennis-court/80 to-primary-600/80" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* アニメーションする円 1 */}
            <div className="absolute inset-0 rounded-full border-8 border-tennis-ball/70 animate-ping-slow" />
            {/* アニメーションする円 2 (少し遅延) */}
            <div className="absolute inset-0 rounded-full border-8 border-tennis-ball/60 animate-ping-slower" />
            {/* メインのテニスボール */}
            <div className="relative w-full h-full rounded-full flex items-center justify-center bg-tennis-court/20 backdrop-blur-sm">
              <div className="animate-float-random">
                <span className="block text-6xl animate-spin-slow">🎾</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-5xl font-bold text-center mb-4 tracking-tight text-tennis-line drop-shadow-lg">
            Joy'n Tennis
          </h1>
          <p className="text-xl text-center mb-4 text-tennis-line/90 drop-shadow-md">
            一宮市・稲沢市を中心に活動中！
          </p>
          <p className="text-lg text-center mb-8 text-tennis-line/90 drop-shadow-md">
            JOY（喜び）× JOin（仲間になる）
          </p>
          <div className="space-y-4 mt-16">
            <Link
              href="/schedule"
              className="block bg-accent-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-accent-600 transition-colors text-center"
            >
              開催予定を確認
            </Link>
            <Link
              href="#about"
              className="block bg-tennis-court/20 backdrop-blur-sm text-tennis-line px-8 py-4 rounded-xl font-bold hover:bg-tennis-court/30 transition-colors text-center border-2 border-tennis-line/30"
            >
              サークルについて
            </Link>
          </div>
        </div>
      </div>

      {/* お知らせセクション */}
      <section className="py-16 bg-white">
        <div className="container">
          <AnimateOnScroll animation="animate-slide-up">
            <h2 className="text-3xl font-bold text-center mb-2 text-tennis-court">お知らせ</h2>
          </AnimateOnScroll>
          <AnimateOnScroll
            animation="animate-slide-up"
            delay={100}
          >
            <p className="text-center text-gray-600 mb-12">最新の活動情報をお届けします</p>
          </AnimateOnScroll>
          <AnimateOnScroll
            animation="animate-slide-up"
            delay={200}
          >
            <div className="max-w-3xl mx-auto space-y-4">
              {news.map((item) => (
                <Link
                  key={item._id}
                  href={`/news/${item._id}`}
                  className="block"
                >
                  <div className="group bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
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
                    <h3 className="mt-2 text-lg font-bold text-gray-900 group-hover:text-tennis-court transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </AnimateOnScroll>
          <AnimateOnScroll
            animation="animate-slide-up"
            delay={300}
            className="text-center mt-8"
          >
            <Link
              href="/news"
              className="inline-flex items-center text-tennis-court hover:text-tennis-court/80 font-bold transition-colors"
            >
              お知らせ一覧へ
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* サークル紹介セクション */}
      <section
        id="about"
        className="px-4 py-16 bg-gradient-to-b from-primary-50 to-white"
      >
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll animation="animate-slide-up">
            <h2 className="text-3xl font-bold text-center mb-2 text-tennis-court">
              Joy'n Tennis とは
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll
            animation="animate-slide-up"
            delay={100}
          >
            <p className="text-center text-gray-600 mb-12">
              『一緒にテニスを楽しみたい』という思いが込められた造語です
            </p>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <AnimateOnScroll
              className="bg-white p-6 rounded-2xl shadow-lg"
              animation="animate-slide-up"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-tennis-court/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-bold text-tennis-court">メンバー構成</h3>
              </div>
              <ul className="space-y-3 list-disc pl-5 text-gray-700">
                <li>現在35名前後が在籍</li>
                <li>20代後半～40代前半の社会人が中心</li>
                <li>初心者から元部活生まで幅広いレベル</li>
              </ul>
            </AnimateOnScroll>

            <AnimateOnScroll
              className="bg-white p-6 rounded-2xl shadow-lg"
              animation="animate-slide-up"
              delay={200}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-tennis-court/10 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="text-xl font-bold text-tennis-court">活動内容</h3>
              </div>
              <ul className="space-y-3 list-disc pl-5 text-gray-700">
                <li>1回4時間の充実した活動</li>
                <li>半分練習・半分試合のバランスの良い内容</li>
                <li>1面5～8名でたくさんボールが打てる</li>
              </ul>
            </AnimateOnScroll>
          </div>

          <AnimateOnScroll
            className="bg-tennis-court/5 backdrop-blur-sm p-6 md:p-8 rounded-2xl"
            animation="animate-slide-up"
            delay={400}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-bold text-tennis-court">活動場所・頻度</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-tennis-court">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="font-bold">活動エリア</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm bg-tennis-court/10 px-3 py-1 rounded-full">
                      一宮市
                    </span>
                    <span className="text-sm bg-tennis-court/10 px-3 py-1 rounded-full">
                      稲沢市
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    人工芝のテニスコートを中心に活動しています
                  </p>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3 text-tennis-court">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-bold">活動頻度</span>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm bg-tennis-court/10 px-3 py-1 rounded-full">
                      土曜日
                    </span>
                    <span className="text-sm bg-tennis-court/10 px-3 py-1 rounded-full">
                      日曜日
                    </span>
                    <span className="text-sm bg-accent-500/10 text-accent-600 px-3 py-1 rounded-full">
                      平日ナイター
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">週1～2回、4時間の充実した活動</p>
                </div>
              </div>

              <div className="md:col-span-2 bg-gradient-to-r from-tennis-court/5 to-accent-500/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3 text-tennis-court">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-bold">活動の特徴</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    テニススクールよりも多くボールを打てると好評です。
                    初参加の方も気兼ねなく楽しめる雰囲気づくりを心がけています。
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* 特徴セクション */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll animation="animate-slide-up">
            <h2 className="text-3xl font-bold text-center mb-2 text-tennis-court">
              サークルの特徴
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll
            animation="animate-slide-up"
            delay={100}
          >
            <p className="text-center text-gray-600 mb-12">楽しく、安全に、みんなでテニス</p>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimateOnScroll
              animation="animate-slide-up"
              delay={200}
            >
              <FeatureCard
                title="初心者歓迎"
                description="年齢、性別、テニスレベルの制約なし。初めてラケットを握る方から、元部活生まで、誰でも参加できます。"
                icon="🎾"
              />
            </AnimateOnScroll>
            <AnimateOnScroll
              animation="animate-slide-up"
              delay={400}
            >
              <FeatureCard
                title="充実した活動"
                description="練習と試合をバランスよく実施。テニススクールよりも多くボールを打てると好評です。"
                icon="🏸"
              />
            </AnimateOnScroll>
            <AnimateOnScroll
              animation="animate-slide-up"
              delay={600}
            >
              <FeatureCard
                title="フレンドリーな雰囲気"
                description="初参加でも気兼ねなく楽しめる雰囲気です。テニスを通じて自然と笑顔が生まれる環境です。"
                icon="😊"
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* 参加方法セクション */}
      <section className="px-4 py-16 bg-gradient-to-b from-white to-primary-50">
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll animation="animate-slide-up">
            <h2 className="text-3xl font-bold text-center mb-2 text-tennis-court">参加方法</h2>
          </AnimateOnScroll>
          <AnimateOnScroll
            animation="animate-slide-up"
            delay={100}
          >
            <p className="text-center text-gray-600 mb-12">簡単3ステップで参加できます</p>
          </AnimateOnScroll>
          <div className="max-w-3xl mx-auto space-y-8">
            <AnimateOnScroll
              animation="animate-slide-in-right"
              delay={200}
            >
              <Step
                number={1}
                title="開催予定を確認"
                description={
                  <>
                    <Link
                      href="/schedule"
                      className="text-accent-500 hover:text-accent-600 underline"
                    >
                      カレンダーから開催日を確認
                    </Link>
                    <span className="block text-sm text-gray-500 mt-1">
                      土日を中心に、平日ナイターでも開催しています
                    </span>
                  </>
                }
              />
            </AnimateOnScroll>
            <AnimateOnScroll
              animation="animate-slide-in-right"
              delay={400}
            >
              <Step
                number={2}
                title="開催場所を確認"
                description={
                  <>
                    <Link
                      href="/locations"
                      className="text-accent-500 hover:text-accent-600 underline"
                    >
                      活動場所の詳細をチェック
                    </Link>
                    <span className="block text-sm text-gray-500 mt-1">
                      一宮市・稲沢市の人工芝コートを中心に活動しています
                    </span>
                  </>
                }
              />
            </AnimateOnScroll>
            <AnimateOnScroll
              animation="animate-slide-in-right"
              delay={600}
            >
              <Step
                number={3}
                title="フォームから申し込み"
                description={
                  <>
                    <Link
                      href="/apply"
                      className="text-accent-500 hover:text-accent-600 underline"
                    >
                      必要事項を入力して完了
                    </Link>
                    <span className="block text-sm text-gray-500 mt-1">
                      初心者の方も気軽にご参加いただけます
                    </span>
                  </>
                }
              />
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* お問い合わせセクション */}
      <section
        id="contact"
        className="relative px-4 py-16 overflow-hidden"
      >
        {/* 背景画像 */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2940"
            alt="テニスボール"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-tennis-court/90 to-primary-600/80" />
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <AnimateOnScroll
            animation="animate-scale-up"
            margin="0px"
          >
            <h2 className="text-3xl font-bold mb-4 text-tennis-line drop-shadow-lg">
              お気軽にお問い合わせください
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll
            animation="animate-scale-up"
            delay={200}
            margin="0px"
          >
            <p className="mb-8 text-tennis-line/90 drop-shadow-md">
              ご不明な点があればお問い合わせください
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll
            animation="animate-scale-up"
            delay={400}
            margin="0px"
          >
            <Link
              href="/contact"
              className="inline-block bg-accent-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-accent-600 transition-colors"
            >
              お問い合わせ
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </main>
  );
}
