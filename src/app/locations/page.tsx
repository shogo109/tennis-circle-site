import { getLocations } from "@/lib/notion/locations";
import LocationMap from "@/components/LocationMap";

export const revalidate = 3600; // 1時間ごとに再検証

export default async function LocationsPage() {
  try {
    const locations = await getLocations();

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">開催場所一覧</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">{location.name}</h2>
              <p className="text-gray-600 mb-4">{location.address}</p>
              <div className="mb-4">
                <LocationMap location={location} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error in LocationsPage:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">開催場所一覧</h1>
        <p className="text-red-500">
          データの取得中にエラーが発生しました。しばらく経ってから再度お試しください。
        </p>
      </div>
    );
  }
}
