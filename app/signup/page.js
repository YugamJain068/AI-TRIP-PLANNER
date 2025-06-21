"use client";
import { React, useEffect, useState } from 'react'
import AutoScrollAdventure from '@/components/AutoScrollAdventure'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Signup = () => {
    const router = useRouter();
    const [form, setform] = useState({ username: '', email: '', password: '', confirm_password: '' });
    const [msg, setMsg] = useState('');
    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.username || !form.email || !form.password || !form.confirm_password) {
            setMsg('All fields are required');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setMsg('Invalid email format');
            return;
        }

        if (form.password.length < 6) {
            setMsg('Password must be at least 6 characters');
            return;
        }
        if (form.password !== form.confirm_password) {
            setMsg('Passwords do not match');
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
        } else {
            console.log("Registration successful:", data.message);
            setMsg('Registration successful! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
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
                    <h1 className='text-5xl mt-5 font-semibold'>Welcome to <span className='text-[#F99262]'>Travelling</span></h1>
                    <p className='mt-4 text-center text-[#626262]'>Login to access travel deals, manage your booking, and place your vacation hassle free</p>
                    <form className='mt-6 gap-4 flex flex-col' onSubmit={handleSubmit}>
                        <input value={form.username ? form.username : ""} onChange={handleChange} className='border border-[#e3dede] text-[#626262] rounded-md p-2 w-[475px] h-[50px]' placeholder='Username' type="text" name="username" id="username" />
                        <input value={form.email ? form.email : ""} onChange={handleChange} className='border border-[#e3dede] text-[#626262] rounded-md p-2 w-[475px] h-[50px]' placeholder='Email' type="text" name="email" id="email" />
                        <input value={form.password ? form.password : ""} onChange={handleChange} className='border border-[#e3dede] text-[#626262] rounded-md p-2 w-[475px] h-[50px]' placeholder='Password' type="password" name="password" id="password" />
                        <input value={form.confirm_password ? form.confirm_password : ""} onChange={handleChange} className='border border-[#e3dede] text-[#626262] rounded-md p-2 w-[475px] h-[50px]' placeholder='Confirm Password' type="password" name="confirm_password" id="confirm_password" />
                        {msg && <span className='text-red-500'>{msg}</span>}
                        <button type="submit" className='bg-[#F99262] text-white rounded-2xl p-2 w-[475px] h-[45px] cursor-pointer'>Register</button>
                    </form>
                    <span className='mt-3 text-[#626262]'>Already have an account?
                        <span className='text-[#F99262] font-semibold cursor-pointer'>
                            <Link href="/login"> Log In</Link></span>
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

export default Signup
