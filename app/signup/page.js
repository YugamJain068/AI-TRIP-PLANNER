"use client";
import { React, useEffect, useState } from 'react'
import AutoScrollAdventure from '@/components/AutoScrollAdventure'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

const signup = () => {
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
                        <img className='h-[70px]' src="/images/logo.avif" alt="logo" />
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
                            <img className='h-[30px] cursor-pointer' src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/800px-Google_%22G%22_logo.svg.png" alt="google" />
                            <span className='text-[#626262]'>Google</span>
                        </button>
                        <button className='h-[50px] flex justify-center items-center gap-3 cursor-pointer border border-[#e3dede] rounded-md p-2 w-[170px]'>
                            <img className='h-[30px] cursor-pointer' src="data:image/png;base64,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" alt="facebook" />
                            <span className='text-[#626262]'>Facebook</span>
                        </button>
                        <button className='h-[50px] flex justify-center items-center gap-3 cursor-pointer border border-[#e3dede] rounded-md p-2 w-[170px]'>
                            <img className='h-[30px] cursor-pointer' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC_ps_PWPSsQ0ZeX7Zsqvtu_30qFYpdmW-0g&s" alt="apple" />
                            <span className='text-[#626262]'>Apple</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default signup
