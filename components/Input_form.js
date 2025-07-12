"use client"
import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { setFormData } from '../store/formSlice';
import { setHasSubmitted } from '@/store/formSlice';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useMapsLibrary } from "@vis.gl/react-google-maps";


const Input_form = () => {
    const dispatch = useDispatch();
    const placesLibrary = useMapsLibrary('places');

    const searchParams = useSearchParams();
    const { data: session, status } = useSession();
    const [inputType, setInputType] = useState('text');
    const [date, setDate] = useState("");
    const [days, setDays] = useState('1');
    const [adults, setAdults] = useState('1');
    const [children, setChildren] = useState('0');
    const [infants, setInfants] = useState('0');
    const [selected_budget, setSelected_budget] = useState('');
    const [selected_member, setSelected_member] = useState('');
    const [selectedActivities, setSelectedActivities] = useState([]);
    const [destination, setDestination] = useState("");
    const [departure, setDeparture] = useState("");
    const [destinationInput, setDestinationInput] = useState("");
    const [departureInput, setDepartureInput] = useState("");
    const [placeSelected, setPlaceSelected] = useState(false);
    const [placeSelected2, setPlaceSelected2] = useState(false);
    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const departureInputRef = useRef(null);
    const departureAutocompleteRef = useRef(null);
    const [formData, setForm] = useState({
        userID: "",
        departure: "",
        destination: "",
        date: "",
        selectedActivities: [],
        selected_budget: "",
        selected_member: "",
        days: "1",
        adults: "1",
        children: "0",
        infants: "0"
    });

    useEffect(() => {
        const destination = searchParams.get('destination');
        if (destination) {
            setDestinationInput(destination);
            setDestination(destination);  // <-- Fix here
            setPlaceSelected(true);
        }
    }, [searchParams]);

    const options = [
        { label: 'Low', value: 'low', range: '₹0 – ₹2,00,000' },
        { label: 'Medium', value: 'medium', range: '₹2,00,000 – ₹5,00,000' },
        { label: 'High', value: 'high', range: '₹5,00,000+' },
    ];
    const members = [
        { label: 'Solo', value: 'solo', image: '/images/solo.png' },
        { label: 'Couple', value: 'couple', image: '/images/couple.png' },
        { label: 'Family', value: 'family', image: '/images/family.png' },
        { label: 'Friends', value: 'friends', image: '/images/friends.png' },
    ];
    const activities = [
        { label: 'Beach Escapes', value: 'beach_escapes', image: '/images/chair.png' },
        { label: 'Cultural & Heritage', value: 'cultural_heritage', image: '/images/worldwide.png' },
        { label: 'Adventure Sports', value: 'adventure_sports', image: '/images/hiking.png' },
        { label: 'Festivals & Events', value: 'festivals_events', image: '/images/fireworks.png' },
        { label: 'Food & Wine', value: 'food_wine', image: '/images/wine.png' },
        { label: 'Nightlife & Entertainment', value: 'nightlife_entertainment', image: '/images/night-club.png' },
        { label: 'Shopping & Local Markets', value: 'shopping_local_markets', image: '/images/shopping-cart.png' },
        { label: 'Nature & Wildlife', value: 'nature_wildlife', image: '/images/wildlife.png' },
        { label: 'Eco & Sustainable Travel', value: 'eco_travel', image: '/images/eco-tourism.png' }
    ];


    useEffect(() => {
        if (!placesLibrary || !inputRef.current) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
            { types: ["(regions)"] }
        );

        autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();
            if (place && place.name) {
                const value = place.formatted_address || place.name;
                setDestination(value);
                setDestinationInput(value);
                setPlaceSelected(true);
            }
        });

        return () => window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
    }, [placesLibrary]);

    useEffect(() => {
        if (!placesLibrary || !departureInputRef.current) return;

        departureAutocompleteRef.current = new window.google.maps.places.Autocomplete(
            departureInputRef.current,
            { types: ["(regions)"] }
        );

        departureAutocompleteRef.current.addListener("place_changed", () => {
            const place = departureAutocompleteRef.current.getPlace();
            if (place && place.name) {
                const value = place.formatted_address || place.name;
                setDeparture(value);
                setDepartureInput(value);
                setPlaceSelected2(true);
            }
        });

        return () => window.google.maps.event.clearInstanceListeners(departureAutocompleteRef.current);
    }, [placesLibrary]);

    const toggleActivity = (value) => {
        setSelectedActivities((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    // Add form validation
    const isFormValid = () => {
        return (
            departure.trim() !== "" &&
            destination.trim() !== "" &&
            date !== "" &&
            selected_budget !== "" &&
            selected_member !== "" &&
            selectedActivities.length > 0
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Only submit if form is valid
        if (!isFormValid()) {
            alert("Please fill in all required fields before submitting.");
            return;
        }

        if (session) {
            dispatch(setFormData(formData));
            dispatch(setHasSubmitted(true));
        }
    };

    const handleBlur = () => {
        if (!placeSelected) {
            setDestination("");
            inputRef.current.value = "";
        }
        setPlaceSelected(false);
    };

    const handleDepartureBlur = () => {
        if (!placeSelected2) {
            setDeparture("");
            departureInputRef.current.value = "";
        }
        setPlaceSelected2(false);
    };

    // Handle card clicks for budget selection
    const handleBudgetSelect = (value) => {
        setSelected_budget(value);
    };

    // Handle card clicks for member selection
    const handleMemberSelect = (value) => {
        setSelected_member(value);
    };

    useEffect(() => {
        if (session && session.user) {
            setForm({
                userID: session.user.id,
                departure,
                destination,
                date,
                selectedActivities,
                selected_budget,
                selected_member,
                days,
                adults,
                children,
                infants
            });
        }
    }, [session, departure, destination, date, selectedActivities, selected_budget, selected_member, days, adults, children, infants]);

    return (
        <>
            <div>
                <h1 className='font-bold text-4xl'>Tell us your travel preferences</h1>
                <p className='text-[#626262] mt-3 mb-10'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>
                <form className='flex flex-col' onSubmit={handleSubmit}>

                    <label className='text-2xl font-semibold mb-6'>Where are you departing from?</label>
                    <input
                        ref={departureInputRef}
                        className='h-10 px-3 rounded-md border border-[#626262]'
                        type="text"
                        placeholder="Enter Departure Location"
                        value={departureInput}
                        onChange={(e) => {
                            setDepartureInput(e.target.value);
                            setPlaceSelected2(false);
                        }}
                        onBlur={handleDepartureBlur}
                    />

                    <hr className="my-20 border-1 border-[#efecec]" />

                    <label className='text-2xl font-semibold mb-6'>What is destination of choice?</label>
                    <input
                        ref={inputRef}
                        className='h-10 px-3 rounded-md border border-[#626262]'
                        type="text"
                        placeholder="Enter Destination"
                        value={destinationInput}
                        onChange={(e) => {
                            setDestinationInput(e.target.value);
                            setPlaceSelected(false);
                        }}
                        onBlur={handleBlur}
                    />

                    <hr className="my-20 border-1 border-[#efecec]" />

                    <label className='text-2xl font-semibold mb-6 ' htmlFor="">When are you planning to travel?</label>
                    <input
                        className='h-10 rounded-md border border-[#626262] mb-6 px-3 text-[#626262]'
                        type={inputType}
                        placeholder='Select date'
                        onFocus={() => setInputType('date')}
                        onBlur={(e) => {
                            if (!e.target.value) setInputType('text');
                        }}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <hr className='my-20 border-1 border-[#efecec]' />

                    <label className='text-2xl font-semibold mb-6 ' htmlFor="">How many days are you planning to travel?</label>
                    <div className='flex justify-between'>
                        <span className='self-center text-xl'>Days</span>
                        <div className='flex justify-center items-center gap-2'>
                            <button type='button' className="text-4xl border rounded-full h-10 w-10 flex items-center justify-center" onClick={() => setDays((prev) => Math.max(1, Number(prev) - 1))}> <span className='text-2xl'>-</span></button>
                            <input className='h-10 text-center w-16' type="text" value={days} onChange={(e) => setDays(e.target.value)} />
                            <button type='button' className='text-4xl border rounded-full h-10 w-10 flex items-center justify-center' onClick={() => setDays((prev) => Math.min(30, Number(prev) + 1))}> <span className='text-2xl'>+</span></button>
                        </div>
                    </div>

                    <hr className='my-20 border-1 border-[#efecec]' />

                    <label className='text-2xl font-semibold' htmlFor="">Members Information - </label>
                    <p className='text-[#626262] mt-3 mb-10'>Please fill the details of members for flights and hotels recommendations</p>
                    <div className='flex justify-between'>
                        <span className='self-center text-xl'>Adults</span>
                        <div className='flex justify-center items-center gap-2'>
                            <button type='button' className="text-4xl border rounded-full h-10 w-10 flex items-center justify-center" onClick={() => setAdults((prev) => Math.max(1, Number(prev) - 1))}> <span className='text-2xl'>-</span></button>
                            <input className='h-10 text-center w-16' type="text" value={adults} onChange={(e) => setAdults(e.target.value)} />
                            <button type='button' className='text-4xl border rounded-full h-10 w-10 flex items-center justify-center' onClick={() => setAdults((prev) => Math.min(30, Number(prev) + 1))}> <span className='text-2xl'>+</span></button>
                        </div>
                    </div>

                    <div className='mt-2 flex justify-between'>
                        <span className='self-center text-xl'>Children</span>
                        <div className='flex justify-center items-center gap-2'>
                            <button type='button' className="text-4xl border rounded-full h-10 w-10 flex items-center justify-center" onClick={() => setChildren((prev) => Math.max(0, Number(prev) - 1))}> <span className='text-2xl'>-</span></button>
                            <input className='h-10 text-center w-16' type="text" value={children} onChange={(e) => setChildren(e.target.value)} />
                            <button type='button' className='text-4xl border rounded-full h-10 w-10 flex items-center justify-center' onClick={() => setChildren((prev) => Math.min(30, Number(prev) + 1))}> <span className='text-2xl'>+</span></button>
                        </div>
                    </div>

                    <div className='mt-2 flex justify-between'>
                        <span className='self-center text-xl'>Infants</span>
                        <div className='flex justify-center items-center gap-2'>
                            <button type='button' className="text-4xl border rounded-full h-10 w-10 flex items-center justify-center" onClick={() => setInfants((prev) => Math.max(0, Number(prev) - 1))}> <span className='text-2xl'>-</span></button>
                            <input className='h-10 text-center w-16' type="text" value={infants} onChange={(e) => setInfants(e.target.value)} />
                            <button type='button' className='text-4xl border rounded-full h-10 w-10 flex items-center justify-center' onClick={() => setInfants((prev) => Math.min(30, Number(prev) + 1))}> <span className='text-2xl'>+</span></button>
                        </div>
                    </div>

                    <hr className='my-20 border-1 border-[#efecec]' />

                    <label className='text-2xl font-semibold ' htmlFor="">What is your budget?</label>
                    <p className='text-[#626262] mt-1 mb-6'>The budget is exclusively allocated for activities and dining purposes.</p>

                    <div className="flex space-x-6">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`border rounded-xl p-6 w-64 cursor-pointer text-center transition-all duration-200 ${selected_budget === option.value ? 'bg-gray-100 border-black shadow-md' : 'hover:shadow-md'
                                    }`}
                                onClick={() => handleBudgetSelect(option.value)}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 relative">
                                        <Image
                                            src="/images/money.png"
                                            alt="money"
                                            fill
                                            sizes='32px'
                                            className="object-contain"
                                        />
                                    </div>
                                    <h2 className="text-lg font-semibold">{option.label}</h2>
                                    <p className="text-gray-500">{option.range}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className='my-20 border-1 border-[#efecec]' />

                    <label className='text-2xl font-semibold mb-6 ' htmlFor="">Who do you plan on traveling with on your next adventure?</label>

                    <div className="flex space-x-6">
                        {members.map((member) => (
                            <div
                                key={member.value}
                                className={`border rounded-xl p-6 w-64 cursor-pointer text-center transition-all duration-200 ${selected_member === member.value ? 'bg-gray-100 border-black shadow-md' : 'hover:shadow-md'
                                    }`}
                                onClick={() => handleMemberSelect(member.value)}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 relative">
                                        <Image
                                            src={member.image}
                                            alt={member.label}
                                            fill
                                            sizes='32px'
                                            className="object-contain"
                                        />
                                    </div>
                                    <h2 className="text-lg font-semibold">{member.label}</h2>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className='my-20 border-1 border-[#efecec]' />

                    <label className='text-2xl font-semibold mb-6 ' htmlFor="">Which activities are you interested in?</label>
                    <div className="flex flex-wrap gap-6">
                        {activities.map((activity) => (
                            <div
                                key={activity.value}
                                className={`border rounded-xl p-6 w-50 h-40 cursor-pointer text-center transition-all duration-200 ${selectedActivities.includes(activity.value)
                                    ? 'bg-gray-100 border-black shadow-md'
                                    : 'hover:shadow-md'
                                    }`}
                                onClick={() => toggleActivity(activity.value)}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-8 h-8 relative">
                                        <Image
                                            src={activity.image}
                                            alt={activity.label}
                                            fill
                                            sizes='32px'
                                            className="object-contain"
                                        />
                                    </div>
                                    <h2 className="text-lg font-semibold">{activity.label}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                    {!isFormValid() ? <span className='mt-10 ml-2 text-red-500 font-semibold'>* all fields are required</span> : null}
                    <button
                        type="submit"
                        disabled={!isFormValid()}
                        className={`text-white my-10 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-200 ${isFormValid()
                            ? 'bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 cursor-pointer'
                            : 'bg-gray-400 cursor-not-allowed'
                            }`}
                    >
                        Generate Itinerary
                    </button>
                </form>
            </div>
        </>
    )
}

export default Input_form