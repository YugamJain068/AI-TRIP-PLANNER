import React, { useEffect, useState,useRef } from 'react';

const Trip_page = ({ formData }) => {
  const [loading, setLoading] = useState(true);
  const hasGenerated = useRef(false);

  useEffect(() => {
    const generateData = async () => {

      if (hasGenerated.current) return;
      hasGenerated.current = true;
      setLoading(true);
      try {
        // Fetch itinerary
        await fetch('/api/generate-itinerary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

      } catch (error) {
        console.error("Error generating trip data:", error);
      } finally {
        setLoading(false);
      }
    };

    generateData();
  }, [formData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg font-medium">Generating your itinerary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Trip Itinerary</h1>

      <h2 className="text-2xl font-semibold mb-2">Flight Options</h2>
    </div>
  );
};

export default Trip_page;
