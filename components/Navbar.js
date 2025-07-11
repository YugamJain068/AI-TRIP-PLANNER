'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';

const Navbar = ({ hideBorder = false }) => {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ✅ Redirect Protection: No redirect on login/signup/home
  useEffect(() => {
    const publicPaths = ['/', '/login', '/signup'];
    if (!publicPaths.includes(pathname) && status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, pathname, router]);

  return (
    <div className={`flex h-16 p-4 justify-around ${hideBorder ? '' : 'border-b-2 border-gray-200'}`}>
      <Link href="/" className="profile flex items-center gap-2 ml-10">
        <Image width={50} height={50} src="/images/logo.avif" alt="Logo" />
        <span className="font-bold text-[#F99262] text-2xl">TripForge-AI</span>
      </Link>

      <ul className="flex items-center gap-4 relative">
        <li>
          <Link href="/save_trips_page">
            <button className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 cursor-pointer dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Saved Trips
            </button>
          </Link>
        </li>
        <li>
          <Link href="/ai_page">
            <button className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 cursor-pointer dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Plan Your Trip
            </button>
          </Link>
        </li>
        <li className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Image width={30} height={30} src="/images/profile-user.png" alt="Profile" />
            {status === 'authenticated' && session?.user && (
              <h1 className="text-lg">{session.user.username}</h1>
            )}
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
              {status === 'authenticated' ? (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Log in
                </Link>
              )}
            </div>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
