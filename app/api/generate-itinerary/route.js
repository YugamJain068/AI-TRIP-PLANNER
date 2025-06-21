import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDb from "@/db/connectDb";
import Trip from "@/db/models/Trip";
import { searchFlights } from "@/lib/search_flights";
import { searchHotels } from "@/lib/search_hotels";
import { search_hotel } from '@/lib/search_hotel2';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const cleanAndParseJSON = (rawString) => {
  try {
    const cleaned = rawString
      .replace(/^```json\n?/, '')
      .replace(/```$/, '')
      .trim();

    const lastBraceIndex = cleaned.lastIndexOf('}');
    if (lastBraceIndex !== -1) {
      const jsonString = cleaned.substring(0, lastBraceIndex + 1);
      return JSON.parse(jsonString);
    }

    throw new Error("No valid closing brace in JSON string");
  } catch (err) {
    console.error('Error parsing JSON:', err);
    return null;
  }
};

function validateItinerary(parsedItinerary, expectedDays, departure) {
  const errors = [];

  // 1. JSON Structure Check
  if (
    !parsedItinerary ||
    !parsedItinerary.cities ||
    !parsedItinerary.travelling ||
    !Array.isArray(parsedItinerary.cities) ||
    !Array.isArray(parsedItinerary.travelling)
  ) {
    errors.push("Itinerary structure is invalid.");
    return { valid: false, errors };
  }

  const cities = parsedItinerary.cities.map(c => c.name);
  const travellingCities = new Set([
    ...parsedItinerary.travelling.map(t => t.to),
    ...parsedItinerary.travelling.map(t => t.from)
  ]);

  // 2. Check all travelling cities are in cities array
  for (const city of travellingCities) {
    if (city === departure) continue; // Skip validating the departure city
    if (!cities.includes(city)) {
      errors.push(`City "${city}" in 'travelling' is missing from 'cities' array.`);
    }
  }


  // 3. Validate exact number of trip days from all activity days
  // let activityDayCount = 0;
  // for (const city of parsedItinerary.cities) {
  //   if (!Array.isArray(city.activities)) continue;
  //   for (const day of city.activities) {
  //     activityDayCount++;
  //   }
  // }

  // if (activityDayCount !== expectedDays) {
  //   errors.push(
  //     `Mismatch in total days: expected ${expectedDays}, but found ${activityDayCount} activity days.`
  //   );
  // }

  // 4. Validate transportFromPrevious: first activity null, rest must not be
  for (const city of parsedItinerary.cities) {
    for (const day of city.activities || []) {
      const plans = day.plan || [];
      plans.forEach((activity, index) => {
        const tfp = activity.transportFromPrevious;
        if (index === 0 && tfp !== null) {
          errors.push(
            `Day ${day.day} in "${city.name}": First activity must have transportFromPrevious as null.`
          );
        }
        if (index > 0 && (!tfp || tfp === null)) {
          errors.push(
            `Day ${day.day} in "${city.name}": Activity #${index + 1} must have valid transportFromPrevious.`
          );
        }
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

async function generateAndValidateItinerary(prompt, expectedDays, departure, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    let parsedItinerary;
    try {
      parsedItinerary = cleanAndParseJSON(text);
    } catch (e) {
      console.warn(`JSON parsing failed on attempt ${attempt}:`, e.message);
      if (attempt === maxRetries) throw new Error("Failed to parse valid JSON from Gemini.");
      continue; // try again
    }

    const { valid, errors } = validateItinerary(parsedItinerary, expectedDays, departure);
    if (valid) {
      return parsedItinerary;
    } else {
      console.warn(`Validation failed on attempt ${attempt}:`, errors);
      if (attempt === maxRetries) {
        throw new Error("Itinerary failed validation: " + errors.join("; "));
      }
    }
  }
}

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
  const budgetMap = {
    low: "$0–$1000",
    medium: "$1000–$2500",
    high: "$2500+"
  };


  try {
    await connectDb();
    const formData = await req.json();
    const readableBudget = budgetMap[formData.selected_budget];
    const userPrompt = `
You are a professional AI travel planner.

Create a detailed, multi-city travel itinerary in **EXACTLY** the following JSON format. The itinerary is for "${formData.selected_member}" traveler(s), going on a ${formData.days}-day trip, starting from "${formData.departure}" and visiting: ${formData.destination}. Their interests include: ${formData.selectedActivities.join(", ")}. The budget is "${readableBudget}".

If you break ANY rule below, the entire output is INVALID and will be discarded. This itinerary will be machine-validated.

IMPORTANT RULES (you MUST follow all of these):
1. ONLY return valid **minified JSON**. Do NOT include markdown, comments, explanations, or formatting. No line breaks or extra content.
2. Wrap everything in a top-level JSON object matching the format below.
3. Use double quotes for all keys and string values. Use **null** (without quotes) where applicable.
4. ⚠️ You MUST return **EXACTLY ${formData.days} activity days** across all cities. NO MORE, NO LESS. 
   - If you return fewer or more days, the response is INVALID.
   - Total activity days = total number of objects in all cities[].activities[]
   - Every day must contain at least 1 plan item.
5. All cities in the "travelling" array MUST also appear in the "cities" array.
6. Use sequential day numbering across all cities: e.g., City A = Days 1–3, City B = Days 4–6.
7. Activities must be chronologically accurate — no time overlaps. Every day must start with a 'transportFromPrevious: null'.
8. For additional plans on the same day, each one must include a valid 'transportFromPrevious' object.
9. Valid transportFromPrevious.mode values (within cities): "Walk", "Car", "Metro", "Bus", "Bike", "Taxi"
10. Valid travelling.modeOfTransport values (between cities): "Flight", "Train", "Bus", "Car"
11. If travelling.modeOfTransport is "Flight", you MUST include valid "departure_airport_city_IATAcode" and "destination_airport_city_IATAcode". If not a flight, both should be null (not string "null").
12. Provide realistic durations for all transport entries (e.g., "10 mins", "45 mins")
13. Do not include any trailing commas or extra content.

"${formData.departure}" is the starting point — only include it in the "cities" array if it's also one of the visit destinations.

JSON FORMAT TO FOLLOW EXACTLY (must be minified in output):

{
  "tripName": "Trip Title",
  "startDate": "${formData.date}",
  "endDate": "YYYY-MM-DD",
  "cities": [
    {
      "name": "City Name",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "activities": [
        {
          "day": 1,
          "plan": [
            {
              "name": "Activity Title",
              "location": "Location Name",
              "time": "10:00 AM",
              "transportFromPrevious": null
            },
            {
              "name": "Next Activity",
              "location": "Next Location",
              "time": "1:00 PM",
              "transportFromPrevious": {
                "mode": "Taxi",
                "from": "Previous Location",
                "to": "Next Location",
                "duration": "15 mins"
              }
            }
          ]
        }
      ],
      "notes": "Hotel area suggestions or city-specific tips"
    }
  ],
  "hotels": [
    {
      "city": "City Name",
      "cityCode": "cityCode",
      "checkIn": "YYYY-MM-DD",
      "checkOut": "YYYY-MM-DD",
      "notes": "Suggestions based on a ${readableBudget} budget"
    }
  ],
  "travelling": [
    {
      "from": "${formData.departure}",
      "to": "City A",
      "date": "YYYY-MM-DD",
      "modeOfTransport": "Flight",
      "departure_airport_city_IATAcode": "DEL",
      "destination_airport_city_IATAcode": "SYD",
      "notes": "Tips for this leg"
    },
    {
      "from": "City A",
      "to": "City B",
      "date": "YYYY-MM-DD",
      "modeOfTransport": "Bus",
      "departure_airport_city_IATAcode": null,
      "destination_airport_city_IATAcode": null,
      "notes": "Tips for this leg"
    }
  ]
}
`.trim();


    const parsedItinerary = await generateAndValidateItinerary(userPrompt, formData.days, formData.departure);


    // const flightRequests = parsedItinerary.travelling
    //   .filter(segment => segment.modeOfTransport === "Flight")
    //   .map(async (segment) => {
    //     const fromIATA = segment.departure_airport_city_IATAcode;
    //     const toIATA = segment.destination_airport_city_IATAcode;

    //     if (!fromIATA || !toIATA) {
    //       console.warn(`Missing IATA code for: ${segment.from} or ${segment.to}`);
    //       return null;
    //     }

    //     try {
    //       const flights = await searchFlights({
    //         from: fromIATA,
    //         to: toIATA,
    //         departureDate: segment.date,
    //         adults: formData.adults,
    //         children: formData.children,
    //         infants: formData.infants
    //       });

    //       return {
    //         from: segment.from,
    //         to: segment.to,
    //         date: segment.date,
    //         flights,

    //       };
    //     } catch (err) {
    //       console.error("Error fetching flights for:", segment, err);
    //       return null;
    //     }
    //   });

    // const flightResults = (await Promise.all(flightRequests)).filter(Boolean);

    // const hotelResults = [];

    // for (const segment of parsedItinerary.hotels) {
    //   try {
    //     const hotels = await fetchWithRetry(() =>
    //       searchHotels({
    //         city: segment.city,
    //         checkInDate: segment.checkIn,
    //         checkOutDate: segment.checkOut,
    //         adults: formData.adults,
    //       })
    //     );

    //     hotelResults.push({
    //       checkInDate: segment.checkIn,
    //       checkOutDate: segment.checkOut,
    //       city: segment.city,
    //       hotels,
    //     });
    //   } catch (err) {
    //     console.error("Error fetching hotels for:", segment.city, err.message || err);
    //     hotelResults.push({
    //       checkInDate: segment.checkIn,
    //       checkOutDate: segment.checkOut,
    //       city: segment.city,
    //       hotels: [],
    //     });
    //   }

    //   await delay(150); // Throttle between each request to respect 10 TPS
    // }

    // console.log(hotelResults)

    // adjust import path as needed

    // const hotelResults = [];

    // for (const segment of parsedItinerary.hotels) {
    //   try {
    //     const hotels = await fetchWithRetry(() =>
    //       search_hotel({
    //         cityCode: segment.cityCode, // must be IATA code like 'LON'
    //         checkInDate: segment.checkIn,
    //         checkOutDate: segment.checkOut,
    //         adults: formData.adults,
    //       })
    //     );

    //     hotelResults.push({
    //       checkInDate: segment.checkIn,
    //       checkOutDate: segment.checkOut,
    //       city: segment.city,
    //       hotels,
    //     });
    //   } catch (err) {
    //     console.error("Error fetching hotels for:", segment.city, err.message || err);
    //     hotelResults.push({
    //       checkInDate: segment.checkIn,
    //       checkOutDate: segment.checkOut,
    //       city: segment.city,
    //       hotels: [],
    //     });
    //   }

    //   await delay(150); // Respect Amadeus TPS limits
    // }

    // console.log(hotelResults);


    const newTrip = await Trip.create({
      userId: formData.userID,
      title: parsedItinerary.tripName,
      adults: formData.adults,
      children: formData.children,
      infants: formData.infants,
      startDate: parsedItinerary.startDate,
      endDate: parsedItinerary.endDate,
      budget: formData.selected_budget,
      travelerType: formData.selected_member,
      cities: parsedItinerary.cities,
      hotels: parsedItinerary.hotels,
      travelling: parsedItinerary.travelling
    });




    return new Response(JSON.stringify({
      itinerary: parsedItinerary,
      hotels: [],
      flights: []
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Gemini error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate itinerary" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
