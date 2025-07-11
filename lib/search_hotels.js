import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const CACHE_FILE = path.join(process.cwd(), 'destIdCache.json');
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const ENABLE_LOGGING = true; // Set false in prod

let destIdCache = {};

// 🔁 Load cache from file at server start
if (fs.existsSync(CACHE_FILE)) {
  try {
    const fileData = fs.readFileSync(CACHE_FILE, 'utf-8');
    destIdCache = JSON.parse(fileData);
    if (ENABLE_LOGGING) console.log("✔ Loaded dest_id cache from file.");
  } catch (err) {
    console.error("❌ Failed to read cache file:", err);
  }
}

function log(...args) {
  if (ENABLE_LOGGING) console.log(...args);
}

async function getLocationId(cityName) {
  const query = cityName.split(',')[0].trim().toLowerCase(); // Normalize

  // 1. Check in-memory cache first
  if (destIdCache[query]) {
    log(`🔁 Using cached dest_id for: ${query}`);
    return destIdCache[query];
  }

  // 2. Fetch from RapidAPI
  const url = `https://booking-com18.p.rapidapi.com/web/stays/auto-complete?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'booking-com18.p.rapidapi.com',
      },
    });

    const data = await res.json();
    if (!data?.data?.length) {
      console.warn(`⚠️ No results for query: ${query}`);
      return null;
    }

    // 🧠 Try exact match on city label1
    const exactMatch = data.data.find(
      item => item.dest_type === 'city' && item.label1?.toLowerCase() === query
    );

    // 🧠 Fallback: any city-type result
    const fallbackCity = data.data.find(item => item.dest_type === 'city');

    const selected = exactMatch || fallbackCity;

    const destId = selected?.dest_id || null;

    if (destId) {
      destIdCache[query] = destId;
      fs.writeFileSync(CACHE_FILE, JSON.stringify(destIdCache, null, 2));
      log(`💾 Cached dest_id for ${query}: ${destId}`);
    } else {
      console.warn(`⚠️ No dest_id found for: ${query}`);
    }

    return destId;
  } catch (error) {
    console.error("❌ Error fetching dest_id:", error);
    return null;
  }
}

export async function searchHotels({
  cityName,
  checkInDate,
  checkOutDate,
  adults = 1,
  currency = 'INR',
  sort = 'popularity',
}) {
  try {
    const rooms = Math.ceil(adults / 2);
    const locationId = await getLocationId(cityName);
    const destType = 'city';

    if (!locationId) {
      console.warn(`❌ City not found: ${cityName}`);
      return [];
    }

    const params = new URLSearchParams({
      destId: locationId,
      destType,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults: adults.toString(),
      rooms: rooms.toString(),
      currency,
      sort,
      language: 'en-us',
      page: '1',
    });

    const searchUrl = `https://booking-com18.p.rapidapi.com/web/stays/search?${params.toString()}`;

    const searchRes = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'booking-com18.p.rapidapi.com',
        'accept': 'application/json',
      },
    });

    const searchData = await searchRes.json();

    if (!searchData || !searchData.data) {
      console.warn('No hotel results found');
      return [];
    }

    return searchData.data;
  } catch (err) {
    console.error('Hotel Search Error:', err.message || err);
    return [];
  }
}

    
