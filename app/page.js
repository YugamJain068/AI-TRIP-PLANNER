"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Destination_homepage from "@/components/Destination_homepage";
import Hotels_homepage from "@/components/Hotels_homepage";
import Image from "next/image";
import { useDispatch, useSelector } from 'react-redux';
import { setHasSubmitted } from '@/store/formSlice';
import Recent_hotels from "@/components/Recent_hotels";
import { useSession } from 'next-auth/react';


export default function Home() {
  const { itinerary, hotels } = useSelector((state) => state.itinerary);
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const [showHotels, setShowHotels] = useState(false);

  useEffect(() => {
    dispatch(setHasSubmitted(false));
  }, []);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      itinerary?.userId &&
      session?.user?.id &&
      session.user.id === itinerary.userId
    ) {
      setShowHotels(true);
    }

  }, [status, session, itinerary]);

  return (
    <>
      <main className="my-32 flex flex-col items-center justify-center text-black px-4">
        <section className="w-full max-w-3xl flex flex-col justify-center items-center text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 relative border-2 rounded-full flex items-center justify-center overflow-hidden">
              <Image fill priority sizes="100px" className="object-cover" src="/images/ai_image.avif" alt="AI Assistant" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold">
              Your own AI Assistant
            </h2>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-tight">
            Plan <span className="text-[#F99262]">Smart. </span>Travel <span className="text-[#F99262]">Smarter.</span>
          </h1>

          <p className="w-full sm:w-4/5 text-lg sm:text-2xl font-semibold">
            Create AI-powered itineraries in seconds — tailored to your style, budget, and destinations.
          </p>

          <Link href="/itinerary-form">
            <button
              type="button"
              className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-base sm:text-xl px-6 sm:px-8 py-3"
            >
              Plan Your Trip
            </button>
          </Link>
        </section>
      </main>

      <section className="flex flex-col px-6 sm:px-20 gap-10">
        <article className="bg-[#F6FCFE] flex flex-col items-center text-center p-6 sm:p-10 rounded-2xl space-y-4">
          <h2 className="text-3xl font-bold">
            Top Trending Destinations in <span className="text-[#F99262]">2025</span>
          </h2>
          <p className="text-[#626262]">Explore the most popular travel spots this year — powered by global travel data.</p>
          <div className="scale-90">
            <Destination_homepage />
          </div>
        </article>

        <article className="bg-[#F6FCFE] flex flex-col gap-3 p-6 sm:p-10 rounded-2xl text-center">
          <h2 className="text-3xl font-bold">
            World’s Most Loved <span className="text-[#F99262]">Hotels</span>
          </h2>
          <p className="text-[#626262]">Discover iconic hotels known for exceptional stays worldwide.</p>
          <Hotels_homepage />
        </article>

        {showHotels && <Recent_hotels hotels={hotels} />}
      </section>

      <section className="flex flex-col items-center mt-16 mb-16 px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold">
          Your <span className="text-[#F99262]">AI-Powered</span> Trip
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 w-full max-w-6xl">
          {[
            {
              title: "Personalized AI Planning",
              description: "Get smart recommendations for destinations, hotels, and activities based on your interests.",
              image: "/images/home_img1.png",
              alt: "AI planning"
            },
            {
              title: "Real-time Deals",
              description: "Instantly access up-to-date flights, hotels, and experiences worldwide.",
              image: "/images/home_img2.jpg",
              alt: "Real-time deals"
            },
            {
              title: "Multi-City Itineraries",
              description: "Plan seamless trips covering multiple cities in one go.",
              image: "/images/home_img3.jpg",
              alt: "Multi-city itineraries"
            },
            {
              title: "Saved Trips",
              description: "Bookmark your favorite trips and access them anytime for easy re-planning and edits.",
              image: "/images/home_img4.jpg",
              alt: "Saved trips"
            }
          ].map((item, index) => (
            <article key={index} className="flex flex-col items-center text-center bg-white p-6 rounded-2xl hover:scale-[1.03] transition">
              <Image
                src={item.image}
                alt={item.alt}
                width={400}
                height={300}
                className="rounded-xl w-full h-72 max-w-sm object-cover"
              />
              <h3 className="font-semibold text-2xl mt-4">{item.title}</h3>
              <p className="text-[#626262] mt-2">{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
