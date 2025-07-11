import { searchFlights } from "@/lib/search_flights";
import { searchHotels } from "@/lib/search_hotels";

async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(fn, retries = 3, delayMs = 500) {
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        } catch (err) {
            const status = err?.response?.status || err?.response?.statusCode;
            const isRateLimit = status === 429;

            if (i === retries || !isRateLimit) {
                throw err;
            }

            console.warn(`Retry ${i + 1}/${retries} due to 429. Waiting ${delayMs * (i + 1)}ms...`);
            await delay(delayMs * (i + 1)); // Exponential backoff
        }
    }
}

export async function POST(req) {

    try {

        const request = await req.json();
        const trip = request.trip

        const hotelResults = [];

        for (const segment of trip.hotels) {
            try {
                const hotels = await fetchWithRetry(() =>
                    searchHotels({
                        cityName: segment.city,
                        checkInDate: segment.checkIn,
                        checkOutDate: segment.checkOut,
                        adults: trip.adults,
                    })
                );

                hotelResults.push({
                    checkInDate: segment.checkIn,
                    checkOutDate: segment.checkOut,
                    city: segment.city,
                    hotels,
                });
            } catch (err) {
                console.error("Error fetching hotels for:", segment.city, err.message || err);
                hotelResults.push({
                    checkInDate: segment.checkIn,
                    checkOutDate: segment.checkOut,
                    city: segment.city,
                    hotels: [],
                });
            }

            await delay(150); // Throttle between each request to respect 10 TPS
        }


        const flightResults = [];

        for (const segment of trip.travelling) {
            if (segment.modeOfTransport !== "Flight") continue;

            const fromIATA = segment.departure_airport_city_IATAcode;
            const toIATA = segment.destination_airport_city_IATAcode;

            if (!fromIATA || !toIATA) {
                console.warn(`Missing IATA code for: ${segment.from} or ${segment.to}`);
                continue;
            }

            try {
                const flights = await fetchWithRetry(() =>
                    searchFlights({
                        from: fromIATA,
                        to: toIATA,
                        departureDate: segment.date,
                        adults: trip.adults,
                        children: trip.children,
                        infants: trip.infants
                    })
                );

                flightResults.push({
                    from: segment.from,
                    to: segment.to,
                    date: segment.date,
                    flights,
                });

            } catch (err) {
                console.error("Error fetching flights for:", segment, err);
            }

            await delay(150); // Delay to respect rate limits (e.g., 10 TPS)
        }

        
        return new Response(JSON.stringify({
            hotels: hotelResults,
            flights: flightResults
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }

    catch (error) {
        console.error("error:", error);
        return new Response(JSON.stringify({ error: "Failed to search hotels and flights" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}