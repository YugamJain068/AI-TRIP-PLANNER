export default function AboutUs() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">About TripForge AI</h1>
      <p className="mb-4">
        TripForge AI is a smart travel planner designed to make your adventures easier, faster, and personalized. Our AI technology helps you craft multi-city travel itineraries based on your preferences, time, and budget.
      </p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Why TripForge?</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>AI-generated itineraries tailored to you.</li>
        <li>Real-time suggestions using trusted travel APIs.</li>
        <li>Save and share your trips easily.</li>
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Our Mission</h2>
      <p>
        To simplify travel planning through intelligent tools and help people explore the world with confidence.
      </p>
      <p className="mt-6 text-sm text-gray-500">Have questions? Reach us at support@tripforge.ai</p>
    </div>
  );
}
