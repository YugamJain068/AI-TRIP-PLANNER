"use client";
import { React, useEffect, useState } from 'react'
import AutoScrollAdventure from '@/components/AutoScrollAdventure'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import DesignerLoader from '@/components/DesignerLoader';
import { signIn } from "next-auth/react";

const Signup = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [form, setform] = useState({ username: '', email: '', password: '', confirm_password: '' });
    const [msg, setMsg] = useState('');

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const handleOAuthLogin = async (provider) => {
        setLoading(true);
        await signIn(provider, {
            callbackUrl: `/oauth-callback?provider=${provider}`,
        });
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        if (!form.username || !form.email || !form.password || !form.confirm_password) {
            setMsg('All fields are required');
            setLoading(false)
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setMsg('Invalid email format');
            setLoading(false)
            return;
        }

        if (form.password.length < 6) {
            setMsg('Password must be at least 6 characters');
            setLoading(false)
            return;
        }
        if (form.password !== form.confirm_password) {
            setMsg('Passwords do not match');
            setLoading(false)
            return;
        }
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        const data = await res.json();
        if (data.error) {
            console.error("Registration error:", data.error);
            setMsg(data.error);
            setLoading(false)
        } else {
            setMsg('Registration successful! Redirecting to login...');
            setTimeout(() => {
                router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/login`);
            }, 2000);
        }
    }
    return (
        <>

            <div className={`flex flex-row`}>
                <div className="hidden lg:block w-full lg:w-[55%]">
                    <AutoScrollAdventure
                        padding="p-20"
                    />
                </div>
                <div className="h-screen w-full lg:w-[45%] px-4 lg:px-20 py-10 flex flex-col items-center justify-center">
                    <Link href="/">
                        <span className="flex justify-center items-center gap-2 text-[#F99262] font-semibold text-2xl sm:text-3xl">
                            <div className="h-[60px] w-[60px] sm:h-[70px] sm:w-[70px] overflow-hidden relative">
                                <Image
                                    sizes="(max-width: 640px) 60px, 70px"
                                    priority
                                    fill
                                    className="object-cover"
                                    src="/images/logo.avif"
                                    alt="logo"
                                />
                            </div>
                            TripForge-AI
                        </span>
                    </Link>

                    <h1 className="text-3xl sm:text-5xl mt-6 font-semibold text-center">
                        Welcome to <span className="text-[#F99262]">Travelling</span>
                    </h1>

                    <p className="mt-4 text-center text-[#626262] text-sm sm:text-base">
                        Login to access travel deals, manage your booking, and place your vacation hassle free
                    </p>

                    <form className="mt-6 gap-4 flex flex-col w-full max-w-[475px]" onSubmit={handleSubmit}>
                        <input
                            value={form.username || ""}
                            onChange={handleChange}
                            className="border border-[#e3dede] text-[#626262] rounded-md p-2 h-[50px]"
                            placeholder="Username"
                            type="text"
                            name="username"
                            id="username"
                        />
                        <input
                            value={form.email || ""}
                            onChange={handleChange}
                            className="border border-[#e3dede] text-[#626262] rounded-md p-2 h-[50px]"
                            placeholder="Email"
                            type="text"
                            name="email"
                            id="email"
                        />
                        <input
                            value={form.password || ""}
                            onChange={handleChange}
                            className="border border-[#e3dede] text-[#626262] rounded-md p-2 h-[50px]"
                            placeholder="Password"
                            type="password"
                            name="password"
                            id="password"
                        />
                        <input
                            value={form.confirm_password || ""}
                            onChange={handleChange}
                            className="border border-[#e3dede] text-[#626262] rounded-md p-2 h-[50px]"
                            placeholder="Confirm Password"
                            type="password"
                            name="confirm_password"
                            id="confirm_password"
                        />
                        {msg && <span className="text-red-500">{msg}</span>}
                        {!loading ? (
                            <button
                                type="submit"
                                className="bg-[#F99262] text-white rounded-2xl p-2 h-[45px] cursor-pointer"
                            >
                                Register
                            </button>
                        ) : (
                            <div className="flex justify-center scale-60">
                                <DesignerLoader />
                            </div>
                        )}
                    </form>

                    <span className="mt-3 text-[#626262] text-sm sm:text-base">
                        Already have an account?
                        <span className="text-[#F99262] font-semibold cursor-pointer">
                            <Link href="/login"> Log In</Link>
                        </span>
                    </span>

                    <div className="w-full max-w-[475px] flex items-center mt-8">
                        <hr className="flex-1 border-t border-gray-300" />
                        <span className="text-[#626262] mx-4 whitespace-nowrap text-sm sm:text-base">or Continue with</span>
                        <hr className="flex-1 border-t border-gray-300" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mt-6 w-full max-w-[475px]">
                        <button
                            onClick={() => handleOAuthLogin("google")}
                            className="h-[50px] flex justify-center items-center gap-3 cursor-pointer border border-[#e3dede] rounded-md p-2 w-full sm:w-[150px]"
                        >
                            <div className="h-[30px] w-[30px] relative overflow-hidden">
                                <Image
                                    fill
                                    sizes="30px"
                                    className="object-cover"
                                    src="/images/google.png"
                                    alt="google"
                                />
                            </div>
                            <span className="text-[#626262]">Google</span>
                        </button>

                        <button
                            onClick={() => handleOAuthLogin("facebook")}
                            className="h-[50px] flex justify-center items-center gap-3 cursor-pointer border border-[#e3dede] rounded-md p-2 w-full sm:w-[150px]"
                        >
                            <div className="h-[30px] w-[30px] relative overflow-hidden">
                                <Image
                                    fill
                                    sizes="30px"
                                    className="object-cover"
                                    src="/images/facebook-app-symbol.png"
                                    alt="facebook"
                                />
                            </div>
                            <span className="text-[#626262]">Facebook</span>
                        </button>

                        <button
                            onClick={() => handleOAuthLogin("github")}
                            className="h-[50px] flex justify-center items-center gap-3 cursor-pointer border border-[#e3dede] rounded-md p-2 w-full sm:w-[150px]"
                        >
                            <div className="h-[30px] w-[30px] relative overflow-hidden">
                                <Image
                                    fill
                                    sizes="30px"
                                    className="object-cover"
                                    src="/images/github-logo.png"
                                    alt="github"
                                />
                            </div>
                            <span className="text-[#626262]">GitHub</span>
                        </button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Signup
