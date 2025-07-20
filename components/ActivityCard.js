'use client';

import React, { useEffect, useState } from 'react';
import { fetchUnsplashImage } from '@/lib/fetchUnsplashImage';
import Image from 'next/image';

const ActivityCard = ({ item, counter, delay = 0 }) => {
  const [image, setImage] = useState({
    url: '/images/america.jpg',
    photographerName: "null",
    photographerProfile: "null",
  });

  useEffect(() => {
    const fetchImage = async () => {
      await new Promise(resolve => setTimeout(resolve, delay));  // Optional delay
      const result = await fetchUnsplashImage(item.name || item.location.name);
      setImage(result);
    };
    fetchImage();
  }, [item.name, item.location.name, delay]);

  return (
    <div className="relative group flex flex-col sm:flex-row items-start gap-3 sm:gap-4 cursor-pointer w-full">
      {/* Timeline dot */}
      <div className="absolute -left-3 top-[15px] w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-md p-3 text-center flex items-center justify-center text-white text-sm">
        {counter}
      </div>

      {/* Card container */}
      <div className="flex flex-col sm:flex-row w-full bg-white rounded-xl p-4 shadow-sm border border-blue-100 group-hover:shadow-md transition duration-200 justify-between">

        {/* Info Section */}
        <div className="flex flex-col flex-1">
          <p className="text-sm text-blue-500 font-medium">{item.time}</p>
          <h3 className="text-lg font-semibold text-gray-800 mt-1">{item.name}</h3>
          <p className="text-sm text-gray-500">{item.location.name}</p>

          {item.notes && (
            <span className="mt-6 p-3 bg-white border-l-4 border-blue-400 text-blue-800 rounded-lg text-sm shadow-sm max-w-full sm:max-w-[360px]">
              {item.notes}
            </span>
          )}
        </div>

        {/* Image Section */}
        <div className="relative overflow-hidden h-40 w-full sm:w-40 sm:h-40 rounded-xl shadow-md border border-gray-100 mt-4 sm:mt-0 sm:ml-4">
          <Image
            fill
            className="object-cover h-full w-full"
            src={image.url}
            alt={item.name}
          />
          {image.photographerName && image.photographerProfile && (
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] rounded px-1 py-0.5">
              Photo by{' '}
              <a href={image.photographerProfile} target="_blank" rel="noopener noreferrer" className="underline">
                {image.photographerName}
              </a>{' '}
              on{' '}
              <a href="https://unsplash.com/?utm_source=tripforge_ai&utm_medium=referral" target="_blank" rel="noopener noreferrer" className="underline">
                Unsplash
              </a>
            </div>
          )}
        </div>
      </div>
    </div>


  );
};

export default ActivityCard;

