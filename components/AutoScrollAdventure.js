"use client";
import React from 'react'
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function AutoScrollAdventure({ width, height, right }) {
  const slides = [
    {
      img1: '/images/ai.jpg',
      img2: '/images/ai-trip.webp',
      title: 'AI-Powered Itinerary Planning',
      desc: 'Generate personalized travel itineraries in seconds. Just enter your destination and dates — our AI handles the rest with day-by-day plans.',
    },
    {
      img1: '/images/hotels.webp',
      img2: '/images/flights.webp',
      title: 'Live Flights & Hotel Integration',
      desc: 'Search real-time flights and hotel deals using our integration with top travel APIs. Compare and book without leaving the site.',
    },
    {
      img1: '/images/travel1.webp',
      img2: '/images/travel2.jpg',
      title: 'Save & Share Your Trips',
      desc: 'Create an account to save your favorite trips, revisit old plans, or share your custom itinerary with friends and travel partners.',
    }
  ];

  return (
    <div className={`${height} p-5 ${width}`}>
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="bg-[#F6FCFE] w-full p-20 h-full flex flex-col gap-15 rounded-2xl overflow-hidden">
              <div className="relative w-full left-[100px]">
                {/* Image 1 */}
                <div className="relative h-[400px] w-[300px]">
                  <Image
                    src={slide.img1}
                    alt="img1"
                    fill
                    className="rounded-2xl object-cover"
                  />
                </div>

                {/* Image 2 */}
                <div className={`absolute ${right} bottom-[-100px] h-[350px] w-[260px] border-[8px] border-[#F6FCFE] rounded-2xl`}>
                  <Image
                    src={slide.img2}
                    alt="img2"
                    fill
                    className="rounded-2xl object-cover"
                  />
                </div>
              </div>

              <div className="flex flex-col mt-20">
                <h1 className="text-center text-4xl font-bold mb-3">{slide.title}</h1>
                <p className="text-gray-600 text-center">{slide.desc}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
