"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import Image from "next/image";

// スクロールアニメーション用のコンポーネント
function AnimateOnScroll({
  children,
  className,
  animation = "animate-slide-up",
  delay = 0,
  margin = "-10% 0px",
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

const images = [
  {
    src: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2940",
    alt: "テニスコート1",
  },
  {
    src: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?q=80&w=2940",
    alt: "テニスコート2",
  },
  {
    src: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?q=80&w=2940",
    alt: "テニスコート3",
  },
];

function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[70vh] bg-gradient-to-b from-tennis-court to-primary-600">
      {/* 画像スライダー */}
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={image.src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentImage === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-tennis-court/80 to-primary-600/80" />
          </div>
        ))}
      </div>

      <div className="relative container mx-auto px-4 h-full">
        <div className="h-full flex flex-col items-center justify-center text-center">
          <AnimateOnScroll className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-tennis-line">
              Joy'n Tennis
              <br />
              について
            </h1>
          </AnimateOnScroll>
          <AnimateOnScroll
            delay={100}
            className="mb-8"
          >
            <p className="text-xl text-tennis-line/90">
              テニスを通じて、楽しみながら新しい仲間との出会いを大切に
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={200}>
            <div className="flex flex-wrap justify-center gap-6 text-tennis-line/90">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                <span>メンバー35名</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📍</span>
                <span>一宮市・稲沢市</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎾</span>
                <span>初心者歓迎</span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* インジケーター */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImage === index
                  ? "bg-tennis-line w-8"
                  : "bg-tennis-line/50 hover:bg-tennis-line/75"
              }`}
              aria-label={`画像${index + 1}に切り替え`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutContent() {
  return (
    <div className="min-h-screen bg-primary-50">
      <Hero />

      <div className="container mx-auto px-4 py-16">
        {/* サークル名の由来 */}
        <AnimateOnScroll className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-tennis-court mb-8 flex items-center gap-4">
              <span className="text-4xl">💫</span>
              サークル名の由来
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-tennis-court/5 rounded-xl p-6">
                <div className="text-3xl mb-4">JOY</div>
                <h3 className="text-xl font-bold text-tennis-court mb-3">喜び・楽しみ</h3>
                <p className="text-gray-600">
                  テニスを通じて得られる喜びと楽しみを大切にしています。上達する喜び、仲間と過ごす楽しい時間を共有しましょう。
                </p>
              </div>
              <div className="bg-tennis-court/5 rounded-xl p-6">
                <div className="text-3xl mb-4">JOIN</div>
                <h3 className="text-xl font-bold text-tennis-court mb-3">参加・仲間になる</h3>
                <p className="text-gray-600">
                  新しい仲間との出会いを大切にしています。テニスを通じて素敵な仲間との出会いが待っています。
                </p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* 活動内容 */}
        <div className="max-w-7xl mx-auto mb-16">
          <AnimateOnScroll>
            <h2 className="text-3xl font-bold text-center text-tennis-court mb-12">活動内容</h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-8">
            <AnimateOnScroll delay={100}>
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-tennis-court/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="text-xl font-bold text-tennis-court mb-4">練習時間</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-tennis-court">•</span>
                    <span>1回4時間の充実した活動</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-tennis-court">•</span>
                    <span>基本練習とゲーム形式を両立</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-tennis-court">•</span>
                    <span>たっぷり球を打てる環境</span>
                  </li>
                </ul>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={200}>
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-tennis-court/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="text-xl font-bold text-tennis-court mb-4">活動場所</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-tennis-court">•</span>
                    <span>一宮市内のテニスコート</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-tennis-court">•</span>
                    <span>稲沢市内のテニスコート</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-tennis-court">•</span>
                    <span>アクセスの良い場所を選定</span>
                  </li>
                </ul>
              </div>
            </AnimateOnScroll>
            <AnimateOnScroll delay={300}>
              <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-tennis-court/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-xl font-bold text-tennis-court mb-4">開催頻度</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-tennis-court">•</span>
                    <span>週末を中心に開催</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-tennis-court">•</span>
                    <span>平日夜の練習会も実施</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-tennis-court">•</span>
                    <span>参加は自由な形式</span>
                  </li>
                </ul>
              </div>
            </AnimateOnScroll>
          </div>
        </div>

        {/* メンバー構成 */}
        <AnimateOnScroll className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-tennis-court mb-8 text-center">メンバー構成</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-tennis-court/10 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">👥</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">現在の会員数</div>
                    <div className="text-2xl font-bold text-tennis-court">約35名</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-tennis-court/10 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">年齢層</div>
                    <div className="text-2xl font-bold text-tennis-court">20代後半〜40代前半</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-tennis-court/10 rounded-xl flex items-center justify-center">
                    <span className="text-3xl">💼</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">職業</div>
                    <div className="text-2xl font-bold text-tennis-court">社会人中心</div>
                  </div>
                </div>
              </div>
              <div className="bg-tennis-court/5 rounded-xl p-6">
                <h3 className="text-xl font-bold text-tennis-court mb-6">テニスレベル</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">初心者</span>
                      <span className="text-tennis-court">30%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tennis-court rounded-full"
                        style={{ width: "30%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">中級者</span>
                      <span className="text-tennis-court">50%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tennis-court rounded-full"
                        style={{ width: "50%" }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">経験者</span>
                      <span className="text-tennis-court">20%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-tennis-court rounded-full"
                        style={{ width: "20%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* 参加方法 */}
        <AnimateOnScroll className="max-w-4xl mx-auto">
          <div className="bg-tennis-court rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-6">参加をお考えの方へ</h2>
            <p className="text-lg mb-8 max-w-2xl">
              Joy'n Tennis では、新しいメンバーを随時募集しています。
              テニス経験の有無は問いません。まずは体験参加からお気軽にご参加ください。
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/schedule"
                className="bg-white text-tennis-court px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
              >
                開催予定を確認する
              </a>
              <a
                href="/apply"
                className="bg-accent-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-accent-600 transition-colors"
              >
                参加を申し込む
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
}
