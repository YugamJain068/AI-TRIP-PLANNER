"use client";
import { React, useState } from 'react'
import AutoScrollAdventure from '@/components/AutoScrollAdventure'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import Image from 'next/image';
import DesignerLoader from '@/components/DesignerLoader';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [form, setform] = useState({ email: '', password: '' });
    const [msg, setMsg] = useState('');


    const handleOAuthLogin = async (provider) => {
        setLoading(true);
        await signIn(provider, {
            callbackUrl: `/oauth-callback?provider=${provider}`,
        });
    };

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");

        if (!form.email || !form.password) {
            setMsg('All fields are required');
            setLoading(false);
            return;
        }

        const res = await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
        });

        if (res.ok) {
            router.push(`${process.env.NEXT_PUBLIC_BASE_URL}`);
        } else {
            // ✅ Show backend error message here
            if (res.error) {
                if (res.error.startsWith("UseOAuth:")) {
                    const provider = res.error.split(":")[1];
                    setMsg(`Please login using ${provider.charAt(0).toUpperCase() + provider.slice(1)}`);
                } else if (res.error === "UserNotFound") {
                    setMsg("User not found. Please register first.");
                } else if (res.error === "IncorrectPassword") {
                    setMsg("Incorrect password. Try again.");
                } else {
                    setMsg("Login failed. Please try again.");
                }
            } else {
                setMsg("Invalid credentials");
            }
            setLoading(false);
        }
    };

    return (
        <>

            <div className={`flex flex-row`}>
                <div className="hidden lg:block w-full lg:w-[55%]">
                    <AutoScrollAdventure
                        padding="p-20"
                    />
                </div>
                <div className="w-full lg:w-[45%] h-screen p-6 sm:p-10 md:p-20 flex flex-col items-center">
                    <Link href="/">
                        <span className='flex justify-center items-center gap-2 text-[#F99262] font-semibold text-2xl sm:text-3xl'>
                            <div className='h-[60px] w-[60px] sm:h-[70px] sm:w-[70px] overflow-hidden relative'>
                                <Image sizes='70px' priority fill className='object-cover' src="/images/logo.avif" alt="logo" />
                            </div>
                            <span>TripForge-AI</span>
                        </span>
                    </Link>

                    <h1 className='text-3xl sm:text-4xl md:text-5xl mt-8 font-semibold text-center'>
                        Welcome to <span className='text-[#F99262]'>Travelling</span>
                    </h1>

                    <p className='mt-4 text-center text-[#626262] text-sm sm:text-base'>
                        Login to access travel deals, manage your booking, and place your vacation hassle free
                    </p>

                    <form className='mt-6 gap-4 flex flex-col w-full sm:w-[400px] md:w-[475px]' onSubmit={handleSubmit}>
                        <input
                            value={form.email || ""}
                            onChange={handleChange}
                            className='border border-[#e3dede] text-[#626262] rounded-md p-2 h-[50px]'
                            placeholder='Email'
                            type="text"
                            name="email"
                            id="email"
                        />
                        <input
                            value={form.password || ""}
                            onChange={handleChange}
                            className='border border-[#e3dede] text-[#626262] rounded-md p-2 h-[50px]'
                            placeholder='Password'
                            type="password"
                            name="password"
                            id="password"
                        />
                        {msg && <span className='text-red-500'>{msg}</span>}
                        {!loading ? (
                            <button type="submit" className='bg-[#F99262] text-white rounded-2xl p-2 h-[45px]'>
                                Log In
                            </button>
                        ) : (
                            <div className='flex justify-center scale-60'><DesignerLoader /></div>
                        )}
                    </form>

                    <span className='mt-5 text-[#626262] text-sm sm:text-base'>
                        Don&apos;t have an account?
                        <span className='text-[#F99262] font-semibold cursor-pointer'>
                            <Link href="/signup"> Sign Up</Link>
                        </span>
                    </span>

                    <div className="w-full sm:w-[400px] md:w-[475px] flex items-center mt-8">
                        <hr className="flex-1 border-t border-gray-300" />
                        <span className="text-[#626262] mx-4 whitespace-nowrap text-sm sm:text-base">or Continue with</span>
                        <hr className="flex-1 border-t border-gray-300" />
                    </div>

                    <div className='flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto'>
                        {[
                            { provider: "google", label: "Google", src: "/images/google.png" },
                            { provider: "facebook", label: "Facebook", src: "/images/facebook-app-symbol.png" },
                            { provider: "github", label: "GitHub", src: "/images/github-logo.png" },
                        ].map(({ provider, label, src }) => (
                            <button
                                key={provider}
                                onClick={() => handleOAuthLogin(provider)}
                                className='h-[50px] flex justify-center items-center gap-3 cursor-pointer border border-[#e3dede] rounded-md p-2 w-full sm:w-[170px]'
                            >
                                <div className='h-[30px] w-[30px] relative overflow-hidden'>
                                    <Image fill sizes='30px' className='object-cover' src={src} alt={label} />
                                </div>
                                <span className='text-[#626262]'>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </>
    )
}

export default Login
