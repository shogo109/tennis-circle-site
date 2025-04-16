import { getEvents } from "@/lib/notion/events";
import Image from "next/image";
import EventCalendar from "@/components/EventCalendar";
import { Event } from "@/types/event";

export const revalidate = 3600; // 1時間ごとに再検証

export default async function SchedulePage() {
  try {
    const events = await getEvents();

    return (
      <main className="min-h-screen">
        <div className="relative h-[40vh] min-h-[300px]">
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
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-tennis-line mb-4 drop-shadow-lg">
                開催予定
              </h1>
              <p className="text-xl text-tennis-line/90 drop-shadow-md max-w-2xl mx-auto">
                Joy'n Tennisの活動予定をご確認ください。 予約状況に応じて随時更新しています。
              </p>
            </div>
          </div>
        </div>

        <section className="py-16 bg-primary-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <EventCalendar events={events} />
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error in SchedulePage:", error);
    return (
      <main className="min-h-screen">
        <div className="relative h-[40vh] min-h-[300px]">
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
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-tennis-line mb-4 drop-shadow-lg">
                開催予定
              </h1>
              <p className="text-xl text-tennis-line/90 drop-shadow-md max-w-2xl mx-auto">
                Joy'n Tennisの活動予定をご確認ください。 予約状況に応じて随時更新しています。
              </p>
            </div>
          </div>
        </div>

        <section className="py-16 bg-primary-50">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
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
