"use client";
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Destination_homepage = () => {
  const router = useRouter();

  const destinations = [
    { src: '/images/bangkok.jpg', alt: 'Bangkok', label: 'Bangkok, Thailand' },
    { src: '/images/london.jpeg', alt: 'London', label: 'London, UK' },
    { src: '/images/paris.jpg', alt: 'Paris', label: 'Paris, France' },
    { src: '/images/dubai.webp', alt: 'Dubai', label: 'Dubai - United Arab Emirates' },
  ];

  const handleClick = (destination) => {
    router.push(`/itinerary-form?destination=${encodeURIComponent(destination)}`);
  };

  return (
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:flex xl:flex-row xl:gap-8 xl:relative'>

        {/* First Image */}
        <div
          onClick={() => handleClick(destinations[0].label)}
          className='relative group cursor-pointer xl:h-[500px] xl:w-[500px] h-[250px] w-[250px]'
        >
          <Image
            width={500}
            height={500}
            className='rounded-2xl xl:w-[500px] xl:h-[500px] w-[250px] h-[250px] object-cover transition-transform duration-500 group-hover:scale-[1.03]'
            src={destinations[0].src}
            alt={destinations[0].alt}
          />
          <div className='absolute inset-0 bg-black/30 backdrop-brightness-75 opacity-0 group-hover:opacity-100 transition-transform flex items-center justify-center rounded-2xl group-hover:scale-[1.03] duration-500'>
            <p className='text-white text-xl font-semibold'>{destinations[0].label}</p>
          </div>
        </div>

        {/* Second Image */}
        <div
          onClick={() => handleClick(destinations[1].label)}
          className='relative group cursor-pointer xl:hidden block h-[250px] w-[250px]'
        >
          <Image
            width={450}
            height={300}
            className='rounded-2xl w-[250px] h-[250px] object-cover transition-transform duration-500 group-hover:scale-[1.03]'
            src={destinations[1].src}
            alt={destinations[1].alt}
          />
          <div className='absolute inset-0 bg-black/30 backdrop-brightness-75 opacity-0 group-hover:opacity-100 transition-transform flex items-center justify-center rounded-2xl group-hover:scale-[1.03] duration-500'>
            <p className='text-white text-xl font-semibold'>{destinations[1].label}</p>
          </div>
        </div>

        {/* Third Image */}
        <div
          onClick={() => handleClick(destinations[2].label)}
          className='relative group cursor-pointer xl:hidden block h-[250px] w-[250px]'
        >
          <Image
            width={450}
            height={500}
            className='rounded-2xl w-[250px] h-[250px] object-cover transition-transform duration-500 group-hover:scale-[1.03]'
            src={destinations[2].src}
            alt={destinations[2].alt}
          />
          <div className='absolute inset-0 bg-black/30 backdrop-brightness-75 opacity-0 group-hover:opacity-100 transition-transform flex items-center justify-center rounded-2xl group-hover:scale-[1.03] duration-500'>
            <p className='text-white text-xl font-semibold'>{destinations[2].label}</p>
          </div>
        </div>

        {/* Fourth Image */}
        <div
          onClick={() => handleClick(destinations[3].label)}
          className='relative group cursor-pointer xl:fixed xl:top-[532px] h-[250px] w-[250px] xl:w-[500px]'
        >
          <Image
            width={500}
            height={300}
            className='rounded-2xl xl:w-[500px] xl:h-[300px] w-[250px] h-[250px] object-cover transition-transform duration-500 group-hover:scale-[1.03]'
            src={destinations[3].src}
            alt={destinations[3].alt}
          />
          <div className='absolute inset-0 bg-black/30 backdrop-brightness-75 opacity-0 group-hover:opacity-100 transition-transform flex items-center justify-center rounded-2xl group-hover:scale-[1.03] duration-500'>
            <p className='text-white text-xl font-semibold'>{destinations[3].label}</p>
          </div>
        </div>

        {/* Second & Third Images for XL screens */}
        <div className='flex flex-col gap-8 not-xl:hidden'>
          {destinations.slice(1, 3).map((dest, index) => (
            <div
              key={index}
              onClick={() => handleClick(dest.label)}
              className='relative group cursor-pointer'
            >
              <Image
                width={450}
                height={index === 0 ? 300 : 500}
                className={`rounded-2xl w-[450px] h-[${index === 0 ? '300' : '500'}px] object-cover transition-transform duration-500 group-hover:scale-[1.03]`}
                src={dest.src}
                alt={dest.alt}
              />
              <div className='absolute inset-0 bg-black/30 backdrop-brightness-75 opacity-0 group-hover:opacity-100 transition-transform flex items-center justify-center rounded-2xl group-hover:scale-[1.03] duration-500'>
                <p className='text-white text-xl font-semibold'>{dest.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default Destination_homepage;
