"use client";
import Input_form from "@/components/Input_form";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from "react";
import { setItineraryData } from '@/store/itinerarySlice';
import AutoScrollAdventure from "@/components/AutoScrollAdventure";
import DesignerLoader from "@/components/DesignerLoader";
import withAuth from "@/lib/withAuth";


function Home() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form.formData);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const hasSubmitted = useSelector((state) => state.form.hasSubmitted);


  const handleFormSubmit = async () => {
    setLoading(true);

    try {
      const res = await fetch('/api/generate-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        dispatch(setItineraryData({
          itinerary: result.itinerary
        }));
        router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/ai_display`);
      } else {
        console.error("Itinerary generation failed:", result);
        setLoading(false);
      }
    } catch (error) {
      console.error("API error:", error);
      setLoading(false);
    }
  };


  useEffect(() => {
    if (formData && hasSubmitted) {
      handleFormSubmit();
    }
  }, [formData, hasSubmitted]);




  return (
    <>
      <div className="flex overflow-auto scrollbar-hide">
        <div className="w-[50%] h-screen p-10 overflow-y-auto scrollbar-hide">
          {loading ? (
            <div className='fixed inset-0 bg-white/80 z-50 flex flex-col justify-center items-center'>
              <h1 className='text-2xl mb-4'>Preparing Your <span className="text-[#F99262] font-bold">Trip</span>...</h1>
              <span className='mt-2 mb-4 text-sm text-red-500 font-semibold'>
                ⚠️ Please do not refresh or leave the page.
              </span>
              <DesignerLoader />
            </div>
          ) : (
            <div>
              <Input_form />
            </div>
          )}

        </div>
        <div className="w-[50%] overflow-hidden sticky h-screen">
          <AutoScrollAdventure
            width="w-[100%]"
            right="right-[100px]"
            scale="scale-85"
          />
        </div>
      </div>
    </>
  );
}
export default withAuth(Home);

