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
                <AutoScrollAdventure
                    width="w-[55%]"
                    right="right-[180px]"
                    scale="scale-100"
                />
                <div className='h-screen p-20 w-[45%] flex flex-col items-center'>
                    <Link href="/">
                        <span className='flex justify-center items-center gap-2 text-[#F99262] font-semibold text-3xl'>
                            <div className='h-[70px] w-[70px] overflow-hidden relative'>
                                <Image sizes='70px' priority fill className='h-[70px] object-cover' src="/images/logo.avif" alt="logo" />
                            </div>
                            TripForge-AI
                        </span>
                    </Link>
                    <h1 className='text-5xl mt-8 font-semibold'>Welcome to <span className='text-[#F99262]'>Travelling</span></h1>
                    <p className='mt-4 text-center text-[#626262]'>Login to access travel deals, manage your booking, and place your vacation hassle free</p>
                    <form className='mt-6 gap-4 flex flex-col' onSubmit={handleSubmit}>
                        <input value={form.email ? form.email : ""} onChange={handleChange} className='border border-[#e3dede] text-[#626262] rounded-md p-2 w-[475px] h-[50px]' placeholder='Email' type="text" name="email" id="email" />
                        <input value={form.password ? form.password : ""} onChange={handleChange} className='border border-[#e3dede] text-[#626262] rounded-md p-2 w-[475px] h-[50px]' placeholder='Password' type="password" name="password" id="password" />
                        {msg && <span className='text-red-500'>{msg}</span>}
                        {!loading ? (<button type="submit" className='bg-[#F99262] text-white rounded-2xl p-2 w-[475px] h-[45px] cursor-pointer'>Log In</button>) : (
                            <div className='flex justify-center scale-60'><DesignerLoader /></div>
                        )}
                    </form>

                    <span className='mt-5 text-[#626262]'>Don&apos;t have an account?
                        <span className='text-[#F99262] font-semibold cursor-pointer'>
                            <Link href="/signup"> Sign Up</Link></span>
                    </span>
                    <div className=" w-full flex items-center mt-8">
                        <hr className="flex-1 border-t border-gray-300" />
                        <span className=" text-[#626262] mx-4 whitespace-nowrap">or Continue with</span>
                        <hr className="flex-1 border-t border-gray-300" />
                    </div>
                    <div className='flex gap-4 mt-6'>
                        <button onClick={() => handleOAuthLogin("google")} className='h-[50px] flex justify-center items-center gap-3 cursor-pointer border border-[#e3dede] rounded-md p-2 w-[170px]'>
                            <div className='h-[30px] w-[30px] relative overflow-hidden'>
                                <Image fill sizes='30px' className='h-[30px] cursor-pointer object-cover' src="/images/google.png" alt="google" />
                            </div>
                            <span className='text-[#626262]'>Google</span>
                        </button>
                        <button onClick={() => handleOAuthLogin("facebook")} className='h-[50px] flex justify-center items-center gap-3 cursor-pointer border border-[#e3dede] rounded-md p-2 w-[170px]'>
                            <div className='h-[30px] w-[30px] relative overflow-hidden'>
                                <Image fill sizes='30px' className='h-[30px] cursor-pointer object-cover' src="/images/facebook-app-symbol.png" alt="facebook" />
                            </div>
                            <span className='text-[#626262]'>Facebook</span>
                        </button>
                        <button onClick={() => handleOAuthLogin("github")} className='h-[50px] flex justify-center items-center gap-3 cursor-pointer border border-[#e3dede] rounded-md p-2 w-[170px]'>
                            <div className='h-[30px] w-[30px] relative overflow-hidden'>
                                <Image fill sizes='30px' className='h-[30px] cursor-pointer object-cover' src="/images/github-logo.png"
                                    alt="apple" />
                            </div>
                            <span className='text-[#626262]'>GitHub</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
