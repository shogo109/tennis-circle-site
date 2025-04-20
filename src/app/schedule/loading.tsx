import { Spinner } from "@/components/Spinner";

export default function ScheduleLoading() {
  return (
    <main className="min-h-screen">
      <div className="relative h-[30vh] min-h-[200px] bg-tennis-court" />
      <section className="py-8 bg-primary-50">
        <div className="max-w-[1400px] mx-auto px-2 md:px-4 flex items-center justify-center min-h-[60vh]">
          <Spinner className="w-12 h-12 text-tennis-court" />
        </div>
      </section>
    </main>
  );
}
