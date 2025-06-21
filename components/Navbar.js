'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [status, router]);

    return (
        <div className='flex border-b-2 border-gray-200 h-16 p-4 justify-around'>
            <Link href="/" className='profile flex items-center gap-2 ml-10'>
                    <img width="50" height="50" src="/images/logo.avif" alt="Logo" />
                    <span className='font-bold text-[#F99262] text-2xl'>AI Planner</span>
            </Link>

            <ul className='flex items-center gap-4 relative'>
                <li>
                    <Link className='cursor-pointer' href="/ai_page"><button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 cursor-pointer dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Save Trips
                    </button></Link>
                </li>
                <li>
                    <Link className='cursor-pointer' href="/ai_page"><button type="button" className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 cursor-pointer dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        AI Planner
                    </button></Link>
                </li>

                {/* Profile dropdown */}
                <li className='relative' ref={dropdownRef}>
                    <div
                        className='flex items-center gap-2 cursor-pointer select-none'
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <img width="30" height="30" src="/images/profile-user.png" alt="profile" />
                        {status === 'authenticated' && session?.user && (
                            <h1 className='text-lg'>{session.user.username}</h1>
                        )}
                    </div>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                            <Link
                                href="/profile"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Profile
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Sign out
                            </button>
                        </div>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default Navbar;
