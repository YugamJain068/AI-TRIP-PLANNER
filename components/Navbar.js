'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter} from 'next/navigation';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ hideBorder = false }) => {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`w-full ${hideBorder ? '' : 'border-b-2 border-gray-200'} px-4 py-3`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image width={40} height={40} src="/images/logo.avif" alt="Logo" />
          <span className="font-bold text-[#F99262] text-xl sm:text-2xl">TripForge-AI</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-4">
          <li>
            <Link href="/save_trips_page">
              <button className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Saved Trips
              </button>
            </Link>
          </li>
          <li>
            <Link href="/itinerary-form">
              <button className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                Plan Your Trip
              </button>
            </Link>
          </li>
          <li className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <Image width={30} height={30} src="/images/profile-user.png" alt="Profile" />
              {status === 'authenticated' && session?.user && (
                <span className="text-sm">{session.user.username}</span>
              )}
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                {status === 'authenticated' ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Log in
                  </Link>
                )}
              </div>
            )}
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu Items */}
      {menuOpen && (
        <div className="md:hidden mt-4 space-y-4 text-center flex flex-col gap-2">
          <Link href="/save_trips_page" onClick={() => setMenuOpen(false)}>
            <button className="w-full text-white bg-gradient-to-br from-pink-500 to-orange-400 font-medium rounded-lg text-sm px-5 py-2.5">
              Saved Trips
            </button>
          </Link>
          <Link href="/itinerary-form" onClick={() => setMenuOpen(false)}>
            <button className="w-full text-white bg-gradient-to-br from-pink-500 to-orange-400 font-medium rounded-lg text-sm px-5 py-2.5">
              Plan Your Trip
            </button>
          </Link>
          <div className="flex items-center justify-center gap-2">
            <Image width={30} height={30} src="/images/profile-user.png" alt="Profile" />
            {status === 'authenticated' && session?.user && (
              <span>{session.user.username}</span>
            )}
            {status === 'authenticated' ? (
            <button
              onClick={() => {
                handleSignOut();
                setMenuOpen(false);
              }}
              className="w-full text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Log in</span>
            </Link>
          )}
          </div>
          
        </div>
      )}
    </nav>
  );
};

export default Navbar;
