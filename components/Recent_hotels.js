"use client";
import React from "react";
import Image from "next/image";

const Recent_hotels = ({ hotels }) => {
  // Merge all hotels from all cities into one array
  const mergedHotels = Object.values(hotels).flat();

  // If no hotels available, show nothing
  if (!mergedHotels || mergedHotels.length === 0) {
    return null;
  }

  // Shuffle hotels randomly and pick top 10
  const randomHotels = mergedHotels
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  return (
    <>
      <div className="bg-[#F6FCFE] flex flex-col gap-3 sm:p-10 p-6 rounded-2xl">
        <h1 className="text-3xl font-bold not-sm:text-xl">
          Hotels From Your Latest <span className="text-[#F99262]">Trip Plan</span>
        </h1>
        <p className="text-[#626262] not-sm:text-sm">
          Based on your recent itinerary.
        </p>
        <div className="flex flex-row overflow-x-auto overflow-y-hidden gap-5 scrollbar-hide">
          {randomHotels.map((hotel, idx4) => {
            const data = hotel.basicPropertyData;
            const photoUrl = data?.photos?.main?.highResUrl?.relativeUrl
              ? `https://cf.bstatic.com${data.photos.main.highResUrl.relativeUrl}`
              : "/images/placeholder.png";

            const starRating = data?.starRating?.value;
            const reviewScore = data?.reviews?.totalScore;
            const reviewText = data?.reviews?.totalScoreTextTag?.translation;
            const location = hotel.location?.displayLocation;
            const freeCancel = hotel.policies?.showFreeCancellation;
            const priceStay =
              hotel.priceDisplayInfoIrene?.displayPrice?.amountPerStay?.amount;
            const priceNight =
              hotel.priceDisplayInfoIrene?.averagePricePerNight?.amount;

            return (
              <div
                key={`${data?.id}-${idx4}`}
                className="not-sm:w-[160px] flex flex-col overflow-hidden shrink-0 pt-2 pb-2 hover:shadow-xl transition-transform hover:scale-[1.01]"
              >
                <Image
                  height={210}
                  width={232}
                  className="h-[210px] w-[232px] object-cover rounded-xl not-sm:h-[150px] not-sm:w-[150px]"
                  src={photoUrl}
                  alt={hotel.displayName?.text || "Hotel image"}
                />
                <div className="w-[225px] mt-2 flex flex-col gap-1.5 px-1 relative ml-1 not-sm:w-[155px]">
                  <span className="truncate text-md font-semibold not-sm:text-sm">
                    {hotel.displayName?.text}
                  </span>

                  {starRating && (
                    <span className="text-xs text-yellow-600">
                      {`${starRating}★ Hotel`}
                    </span>
                  )}

                  <div className="flex flex-row gap-2 items-center">
                    <Image
                      width={13}
                      height={13}
                      src="/images/star.png"
                      alt="rating"
                    />
                    <span className="text-sm not-sm:text-xs">
                      {reviewScore || "N/A"} - {reviewText || "No reviews"}
                    </span>
                  </div>

                  {location && (
                    <span className="text-xs text-gray-500 ">{location}</span>
                  )}

                  <a
                    href={`https://www.booking.com/hotel/${hotel.id}.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-xs"
                  >
                    <span>Book Now</span>
                  </a>

                  {freeCancel && (
                    <span className="absolute top-[-40px] text-xs text-white rounded-md font-medium mt-1 bg-black/55 p-1">
                      ✅ Free cancellation
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Recent_hotels;
