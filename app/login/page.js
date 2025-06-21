"use client";
import { React, useEffect, useRef, useState } from 'react'
import AutoScrollAdventure from '@/components/AutoScrollAdventure'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { signIn } from "next-auth/react";
import Image from 'next/image';

const Login = () => {
    const router = useRouter();
    const [form, setform] = useState({ email: '', password: '' });
    const [msg, setMsg] = useState('');

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) {
            setMsg('All fields are required');
            return;
        }
        const res = await signIn("credentials", {
            redirect: false,
            email: form.email,
            password: form.password,
        });
        if (res.ok) {
            router.push("/");
        } else {
            setMsg("Invalid credentials");
        }
    }
    return (
        <>
            <div className='flex flex-row'>
                <AutoScrollAdventure
                          width="w-[55%]"
                          height="h-screen"
                          right="right-[180px]"
                        />
                <div className='h-screen p-20 w-[45%] flex flex-col items-center'>
                    <span className='flex justify-center items-center gap-2 text-[#F99262] font-semibold text-3xl'>
                        <div className='h-[70px] w-[70px] overflow-hidden relative'>
                        <Image fill className='h-[70px] object-cover' src="/images/logo.avif" alt="logo" />
                        </div>
                        AI Planner
                    </span>
                    <h1 className='text-5xl mt-8 font-semibold'>Welcome to <span className='text-[#F99262]'>Travelling</span></h1>
                    <p className='mt-4 text-center text-[#626262]'>Login to access travel deals, manage your booking, and place your vacation hassle free</p>
                    <form className='mt-6 gap-4 flex flex-col' onSubmit={handleSubmit}>
                        <input value={form.email ? form.email : ""} onChange={handleChange} className='border border-[#e3dede] text-[#626262] rounded-md p-2 w-[475px] h-[50px]' placeholder='Email' type="text" name="email" id="email" />
                        <input value={form.password ? form.password : ""} onChange={handleChange} className='border border-[#e3dede] text-[#626262] rounded-md p-2 w-[475px] h-[50px]' placeholder='Password' type="password" name="password" id="password" />
                        {msg && <span className='text-red-500'>{msg}</span>}
                        <button type="submit" className='bg-[#F99262] text-white rounded-2xl p-2 w-[475px] h-[45px] cursor-pointer'>Log In</button>
                    </form>
                    <div className='w-full flex justify-between items-center m-6 relative'>
                        <span className='text-[#F99262] font-semibold cursor-pointer flex absolute right-7'>Forgot Password?</span>
                    </div>

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
                        <button className='h-[50px] flex justify-center items-center gap-3 cursor-pointer border border-[#e3dede] rounded-md p-2 w-[170px]'>
                            <div className='h-[30px] w-[30px] relative overflow-hidden'>
                            <Image fill className='h-[30px] cursor-pointer object-cover' src="/images/google.png" alt="google" />
                            </div>
                            <span className='text-[#626262]'>Google</span>
                        </button>
                        <button className='h-[50px] flex justify-center items-center gap-3 cursor-pointer border border-[#e3dede] rounded-md p-2 w-[170px]'>
                            <div className='h-[30px] w-[30px] relative overflow-hidden'>
                            <Image fill className='h-[30px] cursor-pointer object-cover' src="/images/facebook-app-symbol.png" alt="facebook" />
                            </div>
                            <span className='text-[#626262]'>Facebook</span>
                        </button>
                        <button className='h-[50px] flex justify-center items-center gap-3 cursor-pointer border border-[#e3dede] rounded-md p-2 w-[170px]'>
                            <div className='h-[30px] w-[30px] relative overflow-hidden'>
                            <Image fill className='h-[30px] cursor-pointer object-cover' src="/images/apple-logo.png"
                             alt="apple" />
                             </div>
                            <span className='text-[#626262]'>Apple</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
