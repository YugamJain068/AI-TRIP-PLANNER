import React, { useEffect, useState } from 'react';
import { getUnsplashImage } from '@/lib/getUnsplashImage';

const ActivityCard = ({ item, delay = 0 }) => {
    const [imageUrl, setImageUrl] = useState('/images/america.jpg');

    // useEffect(() => {
    //     const fetchImage = async () => {
    //         await new Promise(resolve => setTimeout(resolve, delay));
    //         const url = await getUnsplashImage(item.name || item.location);
    //         setImageUrl(url);
    //     };
    //     fetchImage();
    // }, [item.name, item.location, delay]);
    return (
        <div className="relative group flex flex-row items-start gap-4">
            {/* Timeline dot */}
            <div className="absolute -left-3 top-6 w-4 h-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 shadow-md" />

            {/* Info & Image */}
            <div className="flex flex-row flex-1 bg-white rounded-xl p-4 shadow-sm border border-blue-100 group-hover:shadow-md transition duration-200 justify-between">
                <div className="flex flex-col">
                    <p className="text-sm text-blue-500 font-medium">{item.time}</p>
                    <h3 className="text-lg font-semibold text-gray-800 mt-1">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.location}</p>
                </div>

                <div className="overflow-hidden h-40 w-40 rounded-xl shadow-md border border-gray-100">
                    <img className="object-cover h-full w-full" src={imageUrl} alt={item.name} />
                </div>
            </div>
        </div>
    )
}

export default ActivityCard
