"use client";
import React, { useState, useEffect, useRef } from "react";
import { Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";

const Map_display = ({ city, focusedActivity }) => {
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapCenter, setMapCenter] = useState(city?.coordinates || { lat: 0, lng: 0 });

    // Recenter when city changes
    useEffect(() => {
        if (city?.coordinates) {
            setMapCenter(city.coordinates);
        }
    }, [city]);

    // Recenter when activity is clicked in sidebar
    useEffect(() => {
        if (focusedActivity?.location) {
            setMapCenter({
                lat: focusedActivity.location.lat,
                lng: focusedActivity.location.lng
            });
            setSelectedMarker(focusedActivity);
        }
    }, [focusedActivity]);

    if (!city || !city.coordinates) return null;

    return (
        <div className="relative w-full h-full">
            <Map
                defaultCenter={mapCenter}
                defaultZoom={12}
                mapId="5639b6a101468943d9183d74"
                mapTypeId="roadmap"
                className="w-full h-full"
            >
                {(() => {
                    let activityCounter = 1;

                    return city.activities?.flatMap((day, dayIndex) =>
                        day.plan.map((activity, actIndex) => {
                            const activityId = `${city.name}-day${day.day}-activity${actIndex}`;
                            const markerData = { ...activity, activityId };

                            return (
                                <AdvancedMarker
                                    key={activityId}
                                    position={activity.location}
                                    title={`${activity.name} at ${activity.time}`}
                                    onClick={() => {
                                        setSelectedMarker(markerData);
                                        // Scroll to matching ActivityCard
                                        const el = document.getElementById(activityId);
                                        if (el) {
                                            el.scrollIntoView({ behavior: "smooth", block: "center" });
                                            el.classList.add("ring-2", "ring-blue-400", "transition", "rounded-xl");
                                            setTimeout(() => el.classList.remove("ring-2", "ring-blue-400"), 1500);
                                        }
                                    }}
                                >
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md border border-white">
                                        {activityCounter++}
                                    </div>
                                </AdvancedMarker>
                            );
                        })
                    );
                })()}

                {/* InfoWindow on map marker */}
                {selectedMarker && (
                    <InfoWindow
                        position={selectedMarker.location}
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div className="p-1 text-xs leading-tight max-w-[160px] sm:p-3 sm:text-sm sm:max-w-[220px]">
                            <p className="font-semibold">{selectedMarker.name}</p>
                            <p className="text-[10px] text-gray-500 sm:text-xs">{selectedMarker.time}</p>
                        </div>
                    </InfoWindow>
                )}
            </Map>

            {selectedMarker && (

                <div className="absolute bottom-4 right-4 z-10 w-[350px] bg-white rounded-xl shadow-xl border border-gray-200 p-4 hidden sm:block">
  <div className="flex flex-col">
    <p className="text-sm text-blue-500 font-medium">
      {selectedMarker.time}
    </p>
    <h3 className="text-lg font-semibold text-gray-800 mt-1">
      {selectedMarker.name}
    </h3>
    <p className="text-sm text-gray-500">
      {selectedMarker.location.name}
    </p>
    <span className="mt-4 p-3 bg-white border-l-4 border-blue-400 text-blue-800 rounded-lg text-sm shadow-sm">
      {selectedMarker.notes}
    </span>
  </div>

  <button
    onClick={() => setSelectedMarker(null)}
    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
  >
    ✕
  </button>
</div>

            )}
        </div>
    );
};

export default Map_display;
