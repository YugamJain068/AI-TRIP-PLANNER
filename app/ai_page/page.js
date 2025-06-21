"use client";
import Navbar from "@/components/Navbar";
import Input_form from "@/components/Input_form";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect } from "react";
import {resetFormData } from '@/store/formSlice';
import { setItineraryData } from '@/store/itinerarySlice';

export default function Home() {
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
        dispatch(setItineraryData(result));
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
      <Navbar />
      <div className="flex p-8">
        <div className="w-[50%] h-screen p-10">
          {loading ? (
            <div className="flex justify-center items-center h-full text-xl">
              Loading your trip...
            </div>
          ) : (
            <Input_form />
          )}
        </div>
        <div className="w-[50%] bg-blue-400 h-screen flex items-end p-4">
          <button className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              dispatch(resetFormData());
              dispatch(setItineraryData({ itinerary: null, hotels: [], flights: [] }));
              setLoading(false);
            }}
          >
            Reset Form
          </button>
        </div>
      </div>
    </>
  );
}
