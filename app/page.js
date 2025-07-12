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
      <div className="h-screen w-full overflow-visible flex ">
        {/* Left-side Content */}
        <div className="flex max-h-[761px] w-[55%] scale-110">
          <div className="h-full w-full flex flex-col items-center mt-36 text-black z-10">
            <div className="flex flex-row gap-4 items-center justify-center">
              <div className="w-[70px] h-[70px] relative border-2 rounded-full flex items-center justify-center overflow-hidden">
                <Image fill priority sizes="70px" className="object-cover" src="/images/ai_image.avif" alt="" />
              </div>
              <span className="text-center text-2xl font-semibold ">Your own AI Assistant</span>
            </div>

            <h1 className="text-center text-7xl font-bold mt-3">Plan <span className="text-[#F99262]">Smart. </span>Travel <span className="text-[#F99262]">Smarter.</span></h1>
            <p className="w-[65%] text-center text-lg font-semibold mt-5">Create AI-powered itineraries in seconds — tailored to your style, budget, and destinations.</p>
            <Link className="cursor-pointer mt-8" href="/ai_page"><button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium cursor-pointer rounded-lg text-xl px-8 py-3 text-center">Plan Your Trip</button></Link>
          </div>
        </div>
        <div className="relative h-[600px] w-[660px] rounded-xl overflow-hidden mt-[40px]">
          <Image
            fill
            sizes="660px"
            className="object-contain"
            src="/images/home_image.png"
            alt=""
          />
        </div>
      </div>
    

      <div className="flex flex-col px-20 gap-10">
        <div className="flex bg-[#F6FCFE] flex-col p-4 justify-center items-center rounded-2xl">
          <h1 className="text-3xl font-bold">Top Trending Destinations in <span className="text-[#F99262]">2025</span></h1>
          <p className="text-[#626262]">Explore the most popular travel spots this year — powered by global travel data.</p>
          <div className="flex scale-90">
            <Destination_homepage />
          </div>
        </div>
        <div className="bg-[#F6FCFE] flex flex-col gap-3 p-4 rounded-2xl">
          <h1 className="text-3xl font-bold">World’s Most Loved <span className="text-[#F99262]">Hotels</span></h1>
          <p className="text-[#626262]">Discover iconic hotels known for exceptional stays worldwide.</p>
          <Hotels_homepage />
        </div>
        {showHotels && <Recent_hotels hotels={hotels} />}
      </div>
      <div className="flex flex-col items-center mt-16 mb-16 px-6">
        <h1 className="text-5xl font-bold text-center">
          Your <span className="text-[#F99262]">AI-Powered</span> Trip
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-12 w-full max-w-6xl">
          <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl hover:scale-[1.03] transition">
            <Image height={700} width={1100} src="/images/home_img1.png" alt="" className="rounded-xl w-[400px] h-[300px]" />
            <h2 className="font-semibold text-2xl mt-4">Personalized AI Planning</h2>
            <p className="text-[#626262] mt-2">Get smart recommendations for destinations, hotels, and activities based on your interests.</p>
          </div>

          <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl hover:scale-[1.03] transition">
            <Image height={2000} width={2000} src="/images/home_img2.jpg" alt="" className="rounded-xl w-[400px] h-[300px]" />
            <h2 className="font-semibold text-2xl mt-4">Real-time Deals</h2>
            <p className="text-[#626262] mt-2">Instantly access up-to-date flights, hotels, and experiences worldwide.</p>
          </div>

          <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl hover:scale-[1.03] transition">
            <Image height={2000} width={2000} src="/images/home_img3.jpg" alt="" className="rounded-xl w-[400px] h-[300px]" />
            <h2 className="font-semibold text-2xl mt-4">Multi-City Itineraries</h2>
            <p className="text-[#626262] mt-2">Plan seamless trips covering multiple cities in one go.</p>
          </div>

          <div className="flex flex-col items-center text-center bg-white p-6 rounded-2xl hover:scale-[1.03] transition">
            <Image height={2000} width={2000} src="/images/home_img4.jpg" alt="" className="rounded-xl w-[400px] h-[300px]" />
            <h2 className="font-semibold text-2xl mt-4">Saved Trips</h2>
            <p className="text-[#626262] mt-2">Bookmark your favorite trips and access them anytime for easy re-planning and edits.</p>
          </div>
        </div>
      </div>
    </>
  );
}
