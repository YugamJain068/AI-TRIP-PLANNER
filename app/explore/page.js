import Link from "next/link";
export default function Explore() {
  const destinations = ["Tokyo, Japan", "New York, NY, USA", "Paris, France", "Dubai - United Arab Emirates", "Bangkok, Thailand", "Metropolitan City of Rome Capital, Italy"];
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Explore Popular Destinations</h1>
      <p className="mb-8 text-gray-600">Discover trending cities and get inspired for your next adventure.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {destinations.map((city) => (
          <div key={city} className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
            <h2 className="text-lg font-semibold">{city}</h2>
            <p className="text-sm text-gray-500 mt-1">Plan your itinerary in {} with smart AI suggestions.</p>
            <Link href={`/itinerary-form?destination=${encodeURIComponent(city)}`} className="text-blue-500 mt-2 inline-block hover:underline">Plan Now</Link>
          </div>
        ))}
      </div>
    </div>
  );
}