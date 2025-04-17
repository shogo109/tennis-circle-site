import { getEvents } from "@/lib/notion/events";
import Image from "next/image";
import dynamic from "next/dynamic";

const EventCalendar = dynamic(() => import("@/components/EventCalendar"), {
  ssr: false,
});

export const revalidate = 3600; // 1時間ごとに再検証

function PageHeader() {
  return (
    <div className="relative h-[30vh] min-h-[200px]">
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=2940"
          alt="テニスコート"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-tennis-court/90 to-primary-600/80" />
      </div>

      {/* コンテンツ */}
      <div className="relative h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-tennis-line mb-2 drop-shadow-lg">
            開催予定
          </h1>
          <p className="text-base md:text-lg text-tennis-line/90 drop-shadow-md">
            予約状況に応じて随時更新しています
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function SchedulePage() {
  try {
    const events = await getEvents();

    return (
      <main className="min-h-screen">
        <PageHeader />
        <section className="py-8 bg-primary-50">
          <div className="max-w-[1400px] mx-auto px-2 md:px-4">
            <EventCalendar events={events} />
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error in SchedulePage:", error);
    return (
      <main className="min-h-screen">
        <PageHeader />
        <section className="py-8 bg-primary-50">
          <div className="max-w-[1400px] mx-auto px-2 md:px-4">
            <div className="text-center">
              <p className="text-red-500 text-lg">
                データの取得中にエラーが発生しました。
                <br />
                しばらく経ってから再度お試しください。
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }
}
