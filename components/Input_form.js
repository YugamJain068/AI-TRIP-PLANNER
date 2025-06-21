import React from 'react'
import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setFormData } from '../store/formSlice';
import { Loader } from "@googlemaps/js-api-loader";
import { setHasSubmitted } from '@/store/formSlice';
import Image from 'next/image';


const Input_form = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [googleLoaded, setGoogleLoaded] = useState(false);

    const { data: session, status } = useSession();
    const [inputType, setInputType] = useState('text');
    const [days, setDays] = useState('1');
    const [adults, setAdults] = useState('1');
    const [children, setChildren] = useState('1');
    const [infants, setInfants] = useState('1');
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
        children: "1",
        infants: "1"
    });

    const options = [
        { label: 'Low', value: 'low', range: '0 – 1000 USD' },
        { label: 'Medium', value: 'medium', range: '1000 – 2500 USD' },
        { label: 'High', value: 'high', range: '2500+ USD' },
    ];
    const members = [
        { label: 'Solo', value: 'solo', image: '/images/solo.png' },
        { label: 'Couple', value: 'couple', image: '/images/couple.png' },
        { label: 'Family', value: 'family', image: '/images/family.png' },
        { label: 'Friends', value: 'friends', image: '/images/friends.png' },
    ];
    const activities = [
        { label: 'Beaches', value: 'beaches', image: '/images/beaches.png' },
        { label: 'City sightseeing', value: 'city_sightseeing', image: '/images/city.png' },
        { label: 'Outdoor adventures', value: 'outdoor_adventures', image: '/images/outdoor.png' },
        { label: 'Festivals/events', value: 'festivals', image: '/images/festival.png' },
        { label: 'Food exploration', value: 'food_exploration', image: '/images/food.png' },
        { label: 'Nightlife', value: 'nightlife', image: '/images/nightlife.png' },
        { label: 'Shopping', value: 'shopping', image: '/images/shopping.png' },
        { label: 'Spa wellness', value: 'spa_wellness', image: '/images/spa.png' },
    ];

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (!googleLoaded || !inputRef.current) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ["(regions)"]
        });

        const listener = autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();
            if (place && place.name) {
                setDestination(place.formatted_address || place.name);
                setDestinationInput(place.formatted_address || place.name);
                setPlaceSelected(true);
            }
        });

        return () => window.google.maps.event.removeListener(listener);
    }, [googleLoaded]);




    useEffect(() => {
        if (!googleLoaded || !departureInputRef.current) return;

        departureAutocompleteRef.current = new window.google.maps.places.Autocomplete(departureInputRef.current, {
            types: ["(regions)"]
        });

        const listener = departureAutocompleteRef.current.addListener("place_changed", () => {
            const place = departureAutocompleteRef.current.getPlace();
            if (place && place.name) {
                setDeparture(place.formatted_address || place.name);
                setDepartureInput(place.formatted_address || place.name);
                setPlaceSelected2(true);
            }
        });

        return () => window.google.maps.event.removeListener(listener);
    }, [googleLoaded]);


    useEffect(() => {
        const loader = new Loader({
            apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY,
            libraries: ["places"],
        });

        loader.load().then(() => {
            setGoogleLoaded(true);
        });
    }, []);

    const toggleActivity = (value) => {
        setSelectedActivities((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (session) {
            console.log("Submitting form...");
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

    useEffect(() => {
        if (session && session.user) {
            setForm((prev) => ({
                ...prev,
                userID: session.user.id,
                departure,
                destination,
                date: prev.date,
                selectedActivities,
                selected_budget,
                selected_member,
                days,
                adults,
                children,
                infants
            }));
        }
    }, [session, departure, destination, selectedActivities, selected_budget, selected_member, days, adults, children, infants]);

    return (
        <>
            {!googleLoaded ? (
                <div className="text-center text-gray-500 py-10">Loading map inputs...</div>
            ) : (

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
                            value={formData.date}
                            onChange={(e) => setForm({ ...formData, date: e.target.value })}
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
                                <button type='button' className="text-4xl border rounded-full h-10 w-10 flex items-center justify-center" onClick={() => setChildren((prev) => Math.max(1, Number(prev) - 1))}> <span className='text-2xl'>-</span></button>
                                <input className='h-10 text-center w-16' type="text" value={children} onChange={(e) => setChildren(e.target.value)} />
                                <button type='button' className='text-4xl border rounded-full h-10 w-10 flex items-center justify-center' onClick={() => setChildren((prev) => Math.min(30, Number(prev) + 1))}> <span className='text-2xl'>+</span></button>
                            </div>
                        </div>

                        <div className='mt-2 flex justify-between'>
                            <span className='self-center text-xl'>Infants</span>
                            <div className='flex justify-center items-center gap-2'>
                                <button type='button' className="text-4xl border rounded-full h-10 w-10 flex items-center justify-center" onClick={() => setInfants((prev) => Math.max(1, Number(prev) - 1))}> <span className='text-2xl'>-</span></button>
                                <input className='h-10 text-center w-16' type="text" value={infants} onChange={(e) => setInfants(e.target.value)} />
                                <button type='button' className='text-4xl border rounded-full h-10 w-10 flex items-center justify-center' onClick={() => setInfants((prev) => Math.min(30, Number(prev) + 1))}> <span className='text-2xl'>+</span></button>
                            </div>
                        </div>

                        <hr className='my-20 border-1 border-[#efecec]' />

                        <label className='text-2xl font-semibold ' htmlFor="">What is your budget?</label>
                        <p className='text-[#626262] mt-1 mb-6'>The budget is exclusively allocated for activities and dining purposes.</p>

                        <div className="flex space-x-6">
                            {options.map((option) => (
                                <label
                                    key={option.value}
                                    className={`border rounded-xl p-6 w-64 cursor-pointer text-center transition-all duration-200 ${selected_budget === option.value ? 'bg-gray-100 border-black shadow-md' : 'hover:shadow-md'
                                        }`}>

                                    <input
                                        type="radio"
                                        name="budget"
                                        value={option.value}
                                        className="sr-only"
                                        checked={selected_budget === option.value}
                                        onChange={() => setSelected_budget(option.value)} />

                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 relative">
                                            <Image
                                                src="/images/money.png"
                                                alt="money"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <h2 className="text-lg font-semibold">{option.label}</h2>
                                        <p className="text-gray-500">{option.range}</p>
                                    </div>
                                </label>
                            ))}
                        </div>


                        <hr className='my-20 border-1 border-[#efecec]' />

                        <label className='text-2xl font-semibold mb-6 ' htmlFor="">Who do you plan on traveling with on your next adventure?</label>

                        <div className="flex space-x-6">
                            {members.map((member) => (
                                <label
                                    key={member.value}
                                    className={`border rounded-xl p-6 w-64 cursor-pointer text-center transition-all duration-200 ${selected_member === member.value ? 'bg-gray-100 border-black shadow-md' : 'hover:shadow-md'
                                        }`}>

                                    <input
                                        type="radio"
                                        name="budget"
                                        value={member.value}
                                        className="sr-only"
                                        checked={selected_member === member.value}
                                        onChange={() => setSelected_member(member.value)} />

                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 relative">
                                            <Image
                                                src={member.image}
                                                alt={member.label}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <h2 className="text-lg font-semibold">{member.label}</h2>
                                    </div>
                                </label>
                            ))}
                        </div>

                        <hr className='my-20 border-1 border-[#efecec]' />

                        <label className='text-2xl font-semibold mb-6 ' htmlFor="">Which activities are you interested in?</label>
                        <div className="flex flex-wrap gap-6">
                            {activities.map((activity) => (
                                <label
                                    key={activity.value}
                                    className={`border rounded-xl p-6 w-50 h-40 cursor-pointer text-center transition-all duration-200 ${selectedActivities.includes(activity.value)
                                        ? 'bg-gray-100 border-black shadow-md'
                                        : 'hover:shadow-md'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        value={activity.value}
                                        checked={selectedActivities.includes(activity.value)}
                                        onChange={() => toggleActivity(activity.value)}
                                        className="sr-only"
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-8 h-8 relative">
                                            <Image
                                                src={activity.image}
                                                alt={activity.label}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <h2 className="text-lg font-semibold">{activity.label}</h2>
                                    </div>
                                </label>
                            ))}
                        </div>
                        <button type="submit" className="text-white my-10 bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 cursor-pointer dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                            Generate Itinerary
                        </button>
                    </form>
                </div>
            )}
        </>
    )
}

export default Input_form
