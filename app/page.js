"use client";
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import AutoScrollAdventure from "@/components/AutoScrollAdventure";
import Destination_homepage from "@/components/Destination_homepage";
import Hotels_homepage from "@/components/Hotels_homepage";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="flex h-screen">
        <div className="flex max-h-[761px] w-[65%]">
          <div className="h-full w-full flex flex-col gap-6 items-center mt-36">
            <div className="flex flex-row gap-4 items-center justify-center">
              <div className="w-[70px] h-[70px] relative border-0 rounded-full flex items-center justify-center overflow-hidden">
                <Image fill className="object-cover" src="/images/ai_image.avif" alt="" />
              </div>
              <span className="text-center text-2xl font-semibold text-[#626262]">Your own AI Assistant</span>
            </div>

            <h1 className="text-center text-7xl font-bold ">Your Next Journey, Optimized</h1>
            <p className="w-[65%] text-[#626262] text-center text-lg font-semibold">Build, personalize, and optimize your itineraries with our free AI trip planner. Designed for vacations, workations, and everyday adventures.</p>
            <Link className="cursor-pointer" href="/ai_page"><button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium cursor-pointer rounded-lg text-xl px-8 py-3 text-center">Plan a new Trip</button></Link>
          </div>
        </div>
        <div className="mt-14 w-[350px] h-[561px] border-0 rounded-3xl overflow-hidden relative">
          <Image
            fill
            className="object-cover"
            src="/images/travel3.avif"
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-col px-20 gap-6">
        <div className="bg-[#F6FCFE] flex flex-col gap-3 p-4">
          <h1 className="text-3xl font-bold">Discover your travel <span className="text-[#F99262]">Destination</span></h1>
          <p className="text-[#626262]">personalized journeys created for you, powered by smart technology</p>
          <Destination_homepage />
        </div>
        <div className="bg-[#F6FCFE] flex flex-col gap-3 p-4">
          <h1 className="text-3xl font-bold">Picks for you <span className="text-[#F99262]">Hotels</span></h1>
          <p className="text-[#626262]">from luxury to budget ,we&apos;ve got perfect room for you</p>
          <Hotels_homepage />
        </div>
        <div className="bg-[#F6FCFE] flex flex-col gap-3 p-4">
          <h1 className="text-3xl font-bold">Top Attractions <span className="text-[#F99262]">Cities</span></h1>
          <Destination_homepage />
        </div>
      </div>
      <div className="flex flex-col items-center mt-10 mb-10">
        <h1 className="text-5xl font-bold">Your <span className="text-[#F99262]">AI-Powered </span>Trip</h1>
        <div className="flex text-center gap-40 mt-10">
          <div className="flex flex-col gap-3 w-[400px] items-center">
            <Image height={200} width={200} src="/images/travel3.avif" alt="" />
            <h1 className="font-semibold text-3xl">The most optimal</h1>
            <p className="text-[#626262]">Craft your perfect itinerary with Trip Planner AI. Our advanced algorithms take into account your selected explore-sights, dining, and lodging preferences to create the optimal travel plan tailored just for you.</p>
          </div>
          <div className="flex flex-col gap-3 w-[400px] items-center">
            <Image height={200} width={200} src="/images/travel3.avif" alt="" />
            <h1 className="font-semibold text-3xl">Get Inspired</h1>
            <p className="text-[#626262]">Extract valuable travel insights from Instagram reels and TikToks, explore the mentioned explore-sights, and effortlessly include them in your own adventure with Trip Planner AI.</p>
          </div>
        </div>
        <div className="flex text-center gap-40 mt-10">
          <div className="flex flex-col gap-3 w-[400px] items-center">
            <Image height={200} width={200} src="/images/travel3.avif" alt="" />
            <h1 className="font-semibold text-3xl">Smart Itinerary</h1>
            <p className="text-[#626262]">
              Our AI crafts optimized multi-city itineraries tailored to your interests, preferences, and trip length — no more manual planning stress.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-[400px] items-center">
            <Image height={200} width={200} src="/images/travel3.avif" alt="" />
            <h1 className="font-semibold text-3xl">Live Integration</h1>
            <p className="text-[#626262]">
              Access real-time flights, hotels, and local experiences through our API integrations. Book instantly or save for later — all in one place.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
