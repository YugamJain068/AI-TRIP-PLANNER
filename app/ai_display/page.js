"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHasSubmitted } from '@/store/formSlice';
import Navbar from '@/components/Navbar';
import ActivityCard from '@/components/ActivityCard';
import Image from 'next/image';

const AiDisplay = () => {
  const { itinerary, hotels, flights } = useSelector((state) => state.itinerary);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHasSubmitted(false));
  }, []);

  function getTransportIcon(mode) {
    switch (mode.toLowerCase()) {
      case "taxi": return "🚕";
      case "plane": return "✈️";
      case "bus": return "🚌";
      case "car": return "🚗";
      case "train": return "🚆";
      case "walk":
      case "walking": return "🚶";
      default: return "🚘"; // default transport
    }
  }


  if (!itinerary) {
    return <div>No itinerary data found. Please go back and submit the form.</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex p-8 gap-2">
        <div className="w-[55%] h-screen">
          <div className='rounded-2xl overflow-hidden shadow-lg'>

            {/* trip overview */}
            <div className="text-white rounded-2xl overflow-hidden relative w-full h-72 mb-4">
              <Image fill src="/images/america.jpg" alt="Trip Banner" className="w-full h-full object-cover rounded-2xl" />
              <div className="absolute bottom-0 flex justify-between left-0 right-0 bg-black/40 p-4">
                <div className='flex flex-col'>
                  <h2 className="text-2xl font-bold">{itinerary.tripName}</h2>
                  <p className="text-lg">{itinerary.startDate} - {itinerary.endDate}</p>
                </div>
                <ul className='flex gap-2'>
                  <li>download</li>
                  <li>copy</li>
                </ul>
              </div>
            </div>

            {/*trip details  */}
            <div className='flex flex-col gap-4'>
              {itinerary.cities.map((city, idx1) => (

                <div key={idx1} className='shadow-lg rounded-xl bg-[#F6FCFE] p-2'>

                  <div className='flex flex-col gap-4'>
                    <div className='flex flex-row h-[180px] w-full gap-4'>
                      <div className='overflow-hidden h-44 w-60 rounded-md relative'>
                        <Image fill className='object-cover rounded-md' src="/images/newyork.avif" alt="" />
                      </div>
                      <div className='flex flex-col flex-1 p-1'>
                        <div className='flex flex-row justify-between'>
                          <h1 className='text-xl font-bold'>{city.name} </h1>
                          <span className='text-md text-[#626262]'>{city.startDate} - {city.endDate}</span>
                        </div>
                        <hr className='my-4 border-1 border-[#b7b6b6]' />
                        {itinerary.hotels.filter(hotel => hotel.city === city.name).map((hotel, idx3) => (
                          <div key={idx3} className='flex flex-row gap-3 mb-2.5'>
                            <Image height={30} width={30} src="/images/hotel.png" alt="" />
                            <span className='font-normal '>{hotel.notes}</span>
                          </div>
                        ))}
                        {itinerary.travelling.filter(travel => travel.to === city.name).filter(travel => travel.modeOfTransport === "Flight").map((flight, idx3) => (
                          <div key={idx3} className='flex flex-row gap-3 items-center text-center mb-2.5'>
                            <Image height={30} width={30} src="/images/airplane.png" alt="" />
                            <span className='font-normal '>{flight.from} - {flight.to}</span>

                          </div>
                        ))}
                        <a
                          href={`https://www.lonelyplanet.com/search?q=${encodeURIComponent(city.name.split(',')[0])}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          Explore more about {city.name.split(',')[0]}
                        </a>

                      </div>
                    </div>
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-blue-100 group-hover:shadow-md transition duration-200'>
                      <h1 className='text-xl font-bold'>Hotel Recommendation</h1>
                      <hr className='my-3 border-1 border-[#d6d5d5]' />
                      <div className='flex flex-row gap-10'>
                        <div className='bg-red-600'>

                        </div>
                      </div>
                    </div>
                  </div>

                  {city.activities.map((activity, idx2) => (
                    <div key={idx2} className="bg-gradient-to-r from-[#EAF6FB] to-[#F6FCFE] shadow-xl rounded-2xl my-6 p-6">
                      {/* Day Header */}
                      <h2 className="text-3xl font-semibold text-blue-800 mb-6">
                        Day {activity.day}
                      </h2>

                      {/* Timeline as flex column */}
                      <div className="relative border-l-4 border-blue-200 pl-6 flex flex-col gap-8">
                        {activity.plan.map((item, idx3) => (
                          <React.Fragment key={idx3}>
                            {/* Activity Info */}
                            <ActivityCard item={item} delay={idx3 * 800} />

                            {/* Transport Between Activities */}
                            {idx3 < activity.plan.length - 1 &&
                              activity.plan[idx3 + 1].transportFromPrevious && (
                                <div className="relative flex items-center gap-2 text-gray-600 text-sm ml-10">
                                  {/* vertical line bit */}
                                  <div className="w-1 h-6 bg-blue-200 rounded-full -ml-[15px]" />
                                  {/* inline transport display */}
                                  <div className="flex items-center gap-2 italic text-blue-700">
                                    <span className="text-xl">
                                      {getTransportIcon(activity.plan[idx3 + 1].transportFromPrevious.mode)}
                                    </span>
                                    <span>{activity.plan[idx3 + 1].transportFromPrevious.mode}</span>
                                    <span className="text-gray-400">•</span>
                                    <span>{activity.plan[idx3 + 1].transportFromPrevious.duration}</span>
                                  </div>
                                </div>
                              )}
                          </React.Fragment>
                        ))}
                      </div>

                      {/* Optional Notes */}
                      {activity.notes && (
                        <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-lg text-sm">
                          <strong>Note:</strong> {activity.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>


          </div>
        </div>
        <div className="w-[45%] bg-blue-400 h-screen flex items-end p-4 rounded-2xl">

        </div>
      </div>
    </>
  );
};

export default AiDisplay;
