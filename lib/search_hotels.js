import fetch from 'node-fetch';

const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

// Utility delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getAccessToken() {
  const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: AMADEUS_API_KEY,
      client_secret: AMADEUS_API_SECRET,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export async function search_hotel({ cityCode, checkInDate, checkOutDate, adults = 1 }) {
  try {
    const token = await getAccessToken();

    // Step 1: Get hotel IDs by city
    const hotelListRes = await fetch(
      `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const hotelListData = await hotelListRes.json();
    const hotelIds = (hotelListData.data || []).map(hotel => hotel.hotelId);

    if (hotelIds.length === 0) {
      console.warn("No hotels found for city:", cityCode);
      return [];
    }

    // Step 2: Get hotel offers by hotelId
    const hotelOffers = [];

    for (const hotelId of hotelIds.slice(0, 10)) { // Limit to 10 hotels
      const offerUrl = `https://test.api.amadeus.com/v3/shopping/hotel-offers?hotelIds=${hotelId}&adults=${adults}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;

      const offerRes = await fetch(offerUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const offerData = await offerRes.json();
      if (offerData.data && offerData.data.length > 0) {
        hotelOffers.push(...offerData.data);
      }

      await delay(300); // 🔁 Delay between requests to avoid API rate limit (10 TPS max)
    }

    return hotelOffers;

  } catch (err) {
    console.error("Amadeus Hotel Search Error:", err.message || err);
    return [];
  }
}
