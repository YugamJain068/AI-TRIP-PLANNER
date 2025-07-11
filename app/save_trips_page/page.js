"use client";

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DesignerLoader from '@/components/DesignerLoader';
import { useDispatch } from 'react-redux';
import { setItineraryData } from '@/store/itinerarySlice';
import Link from 'next/link';
import withAuth from '@/lib/withAuth';

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [saved_trips, setsaved_trips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const load_save_trips = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const res = await fetch('/api/fetch_trips', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: session.user.id }),
          });

          const result = await res.json();

          if (res.ok) {
            setsaved_trips(result.saved_trips);
            setLoading(false);
          } else {
            console.error("Trips loading failed:", result);
            setLoading(false);
          }
        } catch (error) {
          console.error("API error:", error);
          setLoading(false);
        }
      }
    };

    load_save_trips();
  }, [status, session]);

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString(undefined, options);
  }

  const handleclick = async (trip) => {
    setPageLoading(true);
    try {
      const res = await fetch('/api/savedTrips_hotels_flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trip: trip }),
      });

      const result = await res.json();

      if (res.ok) {
        const cityWiseHotels = {};
        result.hotels.forEach(h => {
          if (!cityWiseHotels[h.city]) cityWiseHotels[h.city] = [];
          const hotelList = h.hotels?.results || [];
          cityWiseHotels[h.city].push(...hotelList);
        });

        dispatch(setItineraryData({
          itinerary: trip,
          hotels: cityWiseHotels,
          flights: result.flights
        }));

        router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/ai_display`);
      } else {
        console.error("Hotels and flights generation failed:", result);
        setPageLoading(false);
      }
    } catch (error) {
      console.error("API error:", error);
      setPageLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className='mt-8 p-4 w-[1300px] bg-[#f2fafd] mx-auto rounded-2xl h-[665px] overflow-y-scroll scrollbar-hide'>
        <h1 className="text-3xl font-bold">
          Your <span className="text-[#F99262]">Trips</span>
        </h1>
        <hr className='my-4 border-1 border-[#b7b6b6]' />
        {!loading ? (
          saved_trips.length > 0 ? (
            <div className='flex flex-row gap-4 flex-wrap'>
              {saved_trips
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((trip) => (
                  <div
                    onClick={() => handleclick(trip)}
                    key={trip._id}
                    className="text-white cursor-pointer rounded-2xl overflow-hidden relative w-[300px] h-64 mb-4"
                  >
                    <div className="relative w-full h-[300px] rounded-2xl overflow-hidden">
                      <Image
                        fill
                        src={trip.bannerImageUrl}
                        alt="Trip Banner"
                        className="w-full h-full object-cover rounded-2xl"
                      />
                      <div className="absolute bottom-10 flex justify-between left-0 right-0 bg-black/50 px-4 py-2">
                        <div className="flex flex-col gap-1">
                          <h2 className="text-[20px] font-bold">{trip.title}</h2>
                          <p className="font-semibold text-sm">
                            {trip.startDate} - {trip.endDate}
                          </p>
                          <p className="font-semibold text-sm">
                            created on {formatDateTime(trip.createdAt)}
                          </p>
                        </div>
                      </div>
                      {trip.bannerPhotographerName && (
                        <div className="absolute top-0 left-4 text-right text-xs text-white self-end">
                          Photo by{' '}
                          <a
                            href={trip.bannerPhotographerProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {trip.bannerPhotographerName}
                          </a>{' '}
                          on{' '}
                          <a
                            href="https://unsplash.com/?utm_source=tripforge_ai&utm_medium=referral"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            Unsplash
                          </a>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
            </div>
          ) : (
            <div className='flex flex-col justify-center items-center gap-4 mt-20'>
              <h1 className='text-xl font-semibold'>No Trips Found</h1>
              <p className='text-sm text-gray-400'>Start planning your next adventure!</p>
              <Link className='cursor-pointer' href="/ai_page"><button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 cursor-pointer dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Plan Your Trip
              </button></Link>
            </div>
          )
        ) : (
          <div className='flex flex-col justify-center items-center gap-6 mt-[20%] overflow-hidden'>
            <h1 className='text-2xl'>
              Loading Your <span className="text-[#F99262] font-bold">Trips</span>
            </h1>
            <span><DesignerLoader /></span>
          </div>
        )}
      </div>

      {/* Full-page loader overlay */}
      {pageLoading && (
        <div className='fixed inset-0 bg-white/80 z-50 flex flex-col justify-center items-center'>
          <h1 className='text-2xl mb-4'>Preparing Your <span className="text-[#F99262] font-bold">Trip</span>...</h1>
          <span className='mt-2 mb-4 text-sm text-red-500 font-semibold'>
            ⚠️ Please do not refresh or leave the page.
          </span>
          <DesignerLoader />
        </div>
      )}
    </>
  );
};

export default withAuth(Page);
