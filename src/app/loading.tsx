import { Spinner } from "@/components/Spinner";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <Spinner className="w-12 h-12 text-tennis-court" />
    </div>
  );
}
