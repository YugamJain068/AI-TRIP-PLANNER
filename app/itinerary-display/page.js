"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setHasSubmitted } from '@/store/formSlice';
import ActivityCard from '@/components/ActivityCard';
import Image from 'next/image';
import Map_display from '@/components/Map_display';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { fetchUnsplashImage } from '@/lib/fetchUnsplashImage';
import withAuth from '@/lib/withAuth';
import { setItineraryData } from '@/store/itinerarySlice';
import BlurAreaLoader from '@/components/BlurAreaLoader';

const AiDisplay = () => {
  const [hasFetched, setHasFetched] = useState(false);
  const [flightHotelsLoading, setflightHotelsLoading] = useState(true);
  const { data: session, status } = useSession();
  const { itinerary, hotels, flights } = useSelector((state) => state.itinerary);
  const dispatch = useDispatch();
  const [selectedCity, setSelectedCity] = useState(itinerary?.cities?.[0]);
  const [focusedActivity, setFocusedActivity] = useState(null);
  const [cityImages, setCityImages] = useState({});

  useEffect(() => {
    const isHotelsFilled = hotels && Object.keys(hotels).length > 0;
    const isFlightsFilled = flights && Array.isArray(flights) && flights.length > 0;

    if (isHotelsFilled && isFlightsFilled) {
      setflightHotelsLoading(false);
    }
  }, [hotels, flights]);

  useEffect(() => {
    dispatch(setHasSubmitted(false));
  }, []);

  useEffect(() => {
    async function fetchHotelsAndFlights() {
      try {
        const res = await fetch('/api/savedTrips_hotels_flights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trip: itinerary }),
        });

        const result = await res.json();

        if (
          res.ok &&
          Array.isArray(result.hotels) &&
          typeof result.flights === 'object' &&
          result.flights !== null
        ) {
          const cityWiseHotels = {};
          result.hotels.forEach(h => {
            if (!cityWiseHotels[h.city]) cityWiseHotels[h.city] = [];
            const hotelList = h.hotels?.results || [];
            cityWiseHotels[h.city].push(...hotelList);
          });

          dispatch(setItineraryData({
            itinerary,
            hotels: cityWiseHotels,
            flights: result.flights,
          }));

          setflightHotelsLoading(false);
          setHasFetched(true);
        } else {
          console.error("Invalid hotels or flights data format:", result);
          setflightHotelsLoading(false);
        }
      } catch (error) {
        console.error("API error:", error);
        setflightHotelsLoading(false);
      }
    }

    if (itinerary && !hasFetched && (!hotels || !flights)) {
      fetchHotelsAndFlights();
    }
  }, [itinerary, hotels, flights, hasFetched]);



  useEffect(() => {
    async function fetchImages() {
      const images = {};

      await Promise.all(
        itinerary.cities.map(async (city) => {
          const img = await fetchUnsplashImage(city.name);
          images[city.name] = {
            url: img.url,
            photographerName: img.photographerName,
            photographerProfile: img.photographerProfile,
          };
        })
      );

      setCityImages(images);
    }

    fetchImages();
  }, [itinerary]);


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

  function formatTo12HourTime(dateString) {
    const date = new Date(dateString); // use as-is

    if (isNaN(date)) return 'Invalid Date'; // handle bad input

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12 || 12; // convert 0 to 12
    const minutesStr = minutes.toString().padStart(2, '0');

    return `${hours}:${minutesStr} ${ampm}`;
  }
  function formatToDayMonthYear(dateString) {
    const date = new Date(dateString);

    if (isNaN(date)) return 'Invalid Date';

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  if (status !== 'authenticated' || !session?.user || !itinerary || session.user.id !== itinerary.userId) {
    return (
      <div>
        <div className='flex flex-col justify-center items-center gap-4 mt-20'>
          <h1 className='text-xl font-semibold'>No Trips Found</h1>
          <p className='text-sm text-gray-400'>Start planning your next adventure!</p>
          <Link className='cursor-pointer' href="/itinerary-form"><button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 cursor-pointer dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Plan Your Trip
          </button></Link>
        </div>
      </div>);
  }

  return (
    <>
      <div className="flex flex-col xl:flex-row p-4 gap-4 overflow-auto scrollbar-hide">

        <div
          className={`
          order-1 xl:order-2 h-[250px]
          xl:w-[670px] xl:h-[695px]
          rounded-2xl overflow-hidden
          sticky xl:top-0
          hover:shadow-xl transition-all
        `}
        >
          {/* Expand button - visible only on small screens */}
          
          <Map_display city={selectedCity} focusedActivity={focusedActivity} />
          
        </div>
        <div className="order-2 xl:order-1 w-full xl:w-[55%] hover:shadow-xl transition-transform hover:scale-[1.01] h-auto xl:h-[80vh]">
          <div className='rounded-2xl overflow-hidden shadow-lg'>

            {/* trip overview */}
            <div className="text-white rounded-2xl overflow-hidden relative w-full h-72 mb-4">
              <div className="relative w-full h-[290px] rounded-2xl overflow-hidden">
                <Image
                  fill
                  src={itinerary.bannerImageUrl || '/images/america.jpg'}
                  alt="Trip Banner"
                  className="w-full h-full object-cover rounded-2xl"
                  sizes="100vw"
                />
                {itinerary.bannerPhotographerName && itinerary.bannerPhotographerProfile && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs rounded px-2 py-1">
                    Photo by{' '}
                    <a
                      href={itinerary.bannerPhotographerProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      {itinerary.bannerPhotographerName}
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

              <div className="absolute bottom-0 flex justify-between left-0 right-0 bg-black/40 p-4">
                <div className='flex flex-col'>
                  <h2 className="text-2xl font-bold">
                    {itinerary.tripName || itinerary.title}
                  </h2>
                  <p className="text-lg">{itinerary.startDate} - {itinerary.endDate}</p>
                </div>
              </div>
            </div>

            {/*trip details  */}
            <div className='flex flex-col gap-4'>
              {itinerary.cities.map((city, idx1) => (
                <div key={idx1} className='shadow-lg rounded-xl bg-[#F6FCFE] p-2'>

                  <div className='flex flex-col gap-4'>
                    <div className='flex flex-row h-[180px] w-full gap-4'>
                      <div className="overflow-hidden h-44 w-60 rounded-md relative">
                        <Image
                          fill
                          src={cityImages[city.name]?.url || "/images/newyork.avif"}
                          alt={city.name}
                          className="object-cover rounded-md"
                          sizes="240px"
                        />

                        {/* Attribution inside image (Only if Unsplash image exists) */}
                        {cityImages[city.name]?.photographerName && cityImages[city.name]?.photographerProfile && (
                          <div className="absolute bottom-1 right-1 bg-black/70 bg-opacity-50 text-white text-[10px] rounded px-1.5 py-0.5">
                            Photo by{' '}
                            <a
                              href={cityImages[city.name].photographerProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline"
                            >
                              {cityImages[city.name].photographerName}
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


                      <div className='flex flex-col flex-1 p-1'>
                        <div className='flex flex-row justify-between'>
                          <h1 className='text-xl font-bold'>{city.name} </h1>
                          <span className='text-md text-[#626262]'>{city.startDate} - {city.endDate}</span>

                        </div>
                        <hr className='my-4 border-1 border-[#b7b6b6]' />

                        {itinerary.hotels.filter(hotel => hotel.city === city.name).map((hotel, idx3) => (
                          <div key={idx3} className="flex flex-row gap-3 mb-2.5 items-center group">
                            <Image height={50} width={30} className='h-[40px]' src="/images/hotel.png" alt="" />
                            <span className="w-[350px] text-wrap line-clamp-2">
                              {hotel.notes}
                            </span>
                          </div>
                        ))}
                        {itinerary.travelling.filter(travel => travel.to === city.name).filter(travel => travel.modeOfTransport === "Flight").map((flight, idx3) => (
                          <div key={idx3} className='flex flex-row gap-3 items-center text-center mb-1.5'>
                            <Image height={30} width={30} src="/images/airplane.png" alt="" />
                            <span className='font-normal '>{flight.from} - {flight.to}</span>

                          </div>
                        ))}

                        <div className="flex flex-row justify-between flex-1">
                          <a
                            href={`https://www.lonelyplanet.com/search?q=${encodeURIComponent(city.name.split(',')[0])}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Explore more about {city.name.split(',')[0]}
                          </a>
                          <button
                            onClick={() => setSelectedCity(city)}
                            className={`px-4 cursor-pointer py-1 rounded-lg text-sm font-semibold transition-colors duration-200 ${selectedCity.name === city.name
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              }`}
                          >
                            {selectedCity.name === city.name ? 'Showing on map' : 'View on Map'}
                          </button>
                        </div>


                      </div>
                    </div>
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-blue-100 group-hover:shadow-md transition duration-200'>
                      <h1 className='text-xl font-bold'>Hotel Recommendation</h1>
                      {itinerary.hotels.filter(h => h.city === city.name).map((h) => (
                        <div key={h} className='mt-1'>
                          <span className='text-gray-500 text-sm' >
                            {h.notes}
                          </span>
                        </div>
                      ))}
                      <hr className='my-2 border-1 border-[#d6d5d5]' />

                      {flightHotelsLoading ? (
                        <div className="relative h-[200px] w-[740px] justify-center items-center"><BlurAreaLoader /></div>
                      ) : (<div className="flex flex-row overflow-x-auto overflow-y-hidden  gap-5 scrollbar-hide">
                        {hotels[city.name]?.length > 0 ? (
                          hotels[city.name]
                            .slice()
                            .sort((a, b) =>
                              (b.basicPropertyData?.reviews?.totalScore || 0) -
                              (a.basicPropertyData?.reviews?.totalScore || 0)
                            )
                            .map((hotel, idx4) => {
                              const data = hotel.basicPropertyData;
                              const photoUrl = data?.photos?.main?.highResUrl?.relativeUrl
                                ? `https://cf.bstatic.com${data.photos.main.highResUrl.relativeUrl}`
                                : "/images/placeholder.png";
                              const starRating = data?.starRating?.value;
                              const reviewScore = data?.reviews?.totalScore;
                              const reviewText = data?.reviews?.totalScoreTextTag?.translation;
                              const location = hotel.location?.displayLocation;
                              const freeCancel = hotel.policies?.showFreeCancellation;
                              const priceStay = hotel.priceDisplayInfoIrene?.displayPrice?.amountPerStay?.amount;
                              const priceNight = hotel.priceDisplayInfoIrene?.averagePricePerNight?.amount;

                              return (
                                <div
                                  key={`${data?.id}-${idx4}`}
                                  className="flex flex-col overflow-hidden shrink-0 pt-2 pb-2 hover:shadow-xl transition-transform hover:scale-[1.01]"
                                >

                                  <Image height={210} width={232} className="h-[210px] w-[232px] object-cover rounded-xl" src={photoUrl} alt={hotel.displayName?.text || "Hotel image"} />
                                  <div className="w-[225px] mt-2 flex flex-col gap-1.5 px-1 relative ml-1">
                                    <span className="truncate text-md font-semibold">
                                      {hotel.displayName?.text}
                                    </span>

                                    {starRating && (
                                      <span className="text-xs text-yellow-600">{`${starRating}★ Hotel`}</span>
                                    )}

                                    <div className="flex flex-row gap-2 items-center">
                                      <Image width={13} height={13} src="/images/star.png" alt="rating" />
                                      <span className="text-sm">
                                        {reviewScore || "N/A"} - {reviewText || "No reviews"}
                                      </span>
                                    </div>

                                    {location && (
                                      <span className="text-xs text-gray-500">{location}</span>
                                    )}

                                    <span className="text-sm font-semibold text-green-600">
                                      {priceStay ? `Total: ${priceStay}` : ""}
                                    </span>

                                    <span className="text-xs text-gray-500">
                                      {priceNight ? `Avg per night: ${priceNight}` : ""}
                                    </span>
                                    <a
                                      href={`https://www.booking.com/hotel/${hotel.id}.html`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline text-xs"
                                    >
                                      <span>Book Now</span>
                                    </a>
                                    {freeCancel && (
                                      <span className="sho top-[-40px] absolute text-xs text-white rounded-md font-medium mt-1 bg-black/55 p-1 ">
                                        ✅ Free cancellation
                                      </span>
                                    )}

                                  </div>
                                </div>
                              );
                            })
                        ) : (
                          <div>
                            <span className="text-gray-500 italic">No hotel offers found.</span>
                          </div>
                        )}
                      </div>)}

                    </div>
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-blue-100 group-hover:shadow-md transition duration-200'>
                      <h1 className='text-xl font-bold'>Flights offers</h1>
                      {itinerary.travelling.filter(t => t.to === city.name).map((t) => (
                        <div key={t} className='mt-1'>
                          <span className='text-gray-500 text-sm' >
                            {t.notes}
                          </span>
                        </div>
                      ))}
                      <hr className='my-2 mb-4 border-1 border-[#d6d5d5]' />
                      {flightHotelsLoading ? (
                        <div className="relative h-[200px] w-[740px] justify-center items-center"><BlurAreaLoader /></div>
                      ) : <div className='flex flex-row overflow-x-auto overflow-y-hidden gap-[10px] scrollbar-hide'>

                        {flights.some(f => f.to === city.name && f.flights?.data?.length > 0) ? (
                          flights
                            .filter(f => f.to === city.name)
                            .map(flight =>
                              flight.flights.data.map(flightOffer => (

                                <div key={flightOffer.id} className='flex flex-col rounded-xl border-[#d6d5d5] overflow-hidden min-w-[370px] shrink-0 hover:shadow-xl transition-transform hover:scale-[1.01] hover:border-2'>
                                  <div className='flex flex-col px-4 pt-2 pb-2'>
                                    <div className='flex flex-row gap-2'>
                                      <Image height={25} width={25} src="/images/airplane.png" alt="" />
                                      <span className='font-semibold text-sm'>
                                        {flight.flights.dictionaries.carriers[flightOffer.validatingAirlineCodes]}
                                      </span>
                                    </div>
                                    <div className='my-2 flex flex-row gap-9'>
                                      <div className='flex flex-col gap-1'>
                                        <span className='font-bold text-[17px]'>{formatTo12HourTime(flightOffer.itineraries[0].segments[0].departure.at)}</span>
                                        <span className='text-[13px] font-semibold'>{formatToDayMonthYear(flightOffer.itineraries[0].segments[0].departure.at)}</span>
                                        <span className='text-[13px] font-semibold'>{flight.from}</span>
                                      </div>
                                      <div className='flex flex-col items-center'>
                                        <div className='flex flex-row items-center'>
                                          <hr className='border-1 border-[#979696] w-[25px] mr-2' />
                                          <span className='font-semibold'>{flightOffer.itineraries[0].duration.replace("PT", "").replace("H", "h ").replace("M", "m")}</span>
                                          <hr className='border-1 border-[#979696] w-[25px] ml-2' />
                                        </div>
                                        <div>
                                          {(flightOffer.itineraries[0].segments.length - 1 === 0) ?
                                            (<div>
                                              <span className='text-center font-semibold text-[13px]'>No stops</span>
                                            </div>) :
                                            (<div>
                                              <span className='text-center font-semibold text-[13px]'>{flightOffer.itineraries[0].segments.length - 1} Stop</span>
                                            </div>)}
                                        </div>
                                      </div>
                                      <div className='flex flex-col gap-1'>
                                        <span className='font-bold text-[17px]'>{formatTo12HourTime(flightOffer.itineraries[0].segments[flightOffer.itineraries[0].segments.length - 1].arrival.at)}</span>
                                        <span className='text-[13px] font-semibold'>{formatToDayMonthYear(flightOffer.itineraries[0].segments[flightOffer.itineraries[0].segments.length - 1].arrival.at)}</span>
                                        <span className='text-[13px] font-semibold'>{flight.to}</span>
                                      </div>
                                    </div>
                                    {flightOffer.itineraries[0].segments.length > 1 ? (
                                      <div className='flex flex-row gap-2 items-center'>
                                        <div className='bg-orange-400 rounded-full w-[5px] h-[5px]'></div>
                                        <span className='text-center font-semibold text-[15px]'>
                                          {
                                            flightOffer.itineraries[0].segments.slice(0, -1).map((seg, idx) => {
                                              const arrivalTime = new Date(seg.arrival.at);
                                              const nextDepartureTime = new Date(flightOffer.itineraries[0].segments[idx + 1].departure.at);

                                              const diffMs = nextDepartureTime - arrivalTime;
                                              const hours = Math.floor(diffMs / (1000 * 60 * 60));
                                              const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                                              const duration = `${hours}h ${minutes}m`;
                                              const airport = seg.arrival.iataCode;

                                              return `${duration} layover at ${airport}${idx !== flightOffer.itineraries[0].segments.length - 2 ? ', ' : ''}`;
                                            })
                                          }
                                        </span>

                                      </div>
                                    ) : <div className='my-[11.5px]'></div>}
                                  </div>
                                  <div className='bg-[#e0f5fd] py-1.5 flex justify-between px-4'>
                                    <span className='font-semibold text-xl'>{flightOffer.travelerPricings.filter(t => t.travelerType !== "HELD_INFANT").length} Seats</span>
                                    <span className='font-semibold text-xl'>Rs {flightOffer.price.grandTotal}</span>
                                  </div>
                                </div>
                              ))
                            )
                        ) : (
                          <div>
                            <span className='text-gray-500 italic'>No flight offers found.</span>
                          </div>
                        )}

                      </div>}
                    </div>
                  </div>
                  {(() => {
                    let counter = 1;

                    return city.activities.map((activity, idx2) => (
                      <div key={idx2} className="bg-gradient-to-r from-[#EAF6FB] to-[#F6FCFE] shadow-xl rounded-2xl my-6 p-6">
                        {/* Day Header */}
                        <h2 className="text-3xl font-semibold text-blue-800 mb-6">
                          Day {activity.day}
                        </h2>

                        {/* Timeline as flex column */}
                        <div className="relative border-l-4 border-blue-200 pl-6 flex flex-col gap-8">
                          {activity.plan.map((item, idx3) => {
                            const activityId = `${city.name}-day${activity.day}-activity${idx3}`;
                            return (
                              <React.Fragment key={activityId}>
                                {/* Activity Info */}
                                <div
                                  onClick={() => {
                                    setFocusedActivity(item);
                                    setSelectedCity(city);
                                  }}
                                  className="cursor-pointer"
                                  id={activityId}
                                >
                                  <ActivityCard item={item} counter={counter++} delay={idx3 * 800} />
                                </div>




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
                            )
                          })}
                        </div>
                      </div>
                    ));
                  })()}

                </div>
              ))}
            </div>


          </div>
        </div>

      </div>
    </>
  );
};

export default withAuth(AiDisplay);
