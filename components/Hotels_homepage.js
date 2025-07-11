"use client";
import React from 'react';
import Image from 'next/image';
import hotels from '@/data/popularHotels.json';

const Hotels_homepage = () => {
  return (
    <div className="py-2">
      <div className="flex flex-row overflow-x-auto overflow-y-hidden gap-5 scrollbar-hide">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="flex flex-col overflow-hidden shrink-0 pt-2 pb-2 hover:shadow-xl transition-transform hover:scale-[1.02] rounded-xl bg-white"
          >
            <Image
              height={210}
              width={232}
              className="h-[210px] w-[232px] object-cover rounded-xl"
              src={hotel.imageUrl}
              alt={hotel.name}
            />
            <div className="w-[225px] mt-2 flex flex-col gap-1.5 px-1 relative ml-1">
              <span className="truncate text-md font-semibold">
                {hotel.name}
              </span>

              <span className="text-xs text-gray-600">
                {hotel.location}, {hotel.country}
              </span>

              <div className="flex flex-row gap-2 items-center">
                <Image width={13} height={13} src="/images/star.png" alt="rating" />
                <span className="text-sm">
                  {hotel.reviewScore} / 10
                </span>
              </div>

              {hotel.booking_link && (
                <a
                  href={hotel.booking_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-xs"
                >
                  Book Now
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels_homepage;

