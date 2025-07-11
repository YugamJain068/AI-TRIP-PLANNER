"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OAuthCallback = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const provider = searchParams.get("provider");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        const checkSession = async () => {
            const res = await fetch('/api/auth/session');
            const session = await res.json();

            if (error) {
                if (error === "EmailExistsWithPassword") {
                    setMsg("Email already registered with password login. Please use your password.");
                } else if (error === "UseProvider" && provider) {
                    setMsg(`Please login using ${provider}.`);
                } else {
                    setMsg("Login failed. Please try again.");
                }
            } else if (session?.error) {
                setMsg(session.error);
            } else {
                router.push("/");  // ✅ Redirect to homepage or dashboard on success
            }
        };

        checkSession();
    }, []);

    return (
        <div className="flex flex-col gap-4 items-center justify-center h-screen">
            {msg ? (
                <>
                    <p className="text-red-500 text-xl text-center">{msg}</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="bg-[#F99262] text-white px-4 py-2 rounded-md hover:bg-[#f2763f] transition"
                    >
                        Back to Login
                    </button>
                </>
            ) : (
                <p className="text-gray-600 text-xl">
                    Logging you in...
                </p>
            )}
        </div>
    );
};

export default OAuthCallback;
