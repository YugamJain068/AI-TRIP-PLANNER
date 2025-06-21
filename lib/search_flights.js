import Amadeus from 'amadeus';

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY,
  clientSecret: process.env.AMADEUS_API_SECRET
});

/**
 * Search for flight offers using Amadeus API.
 * Supports adults, children, and infants.
 */
export async function searchFlights({
  from,
  to,
  departureDate,
  adults = 1,
  children = 0,
  infants = 0
}) {
  if (!from || !to || !departureDate) {
    throw new Error("Missing required parameters: from, to, departureDate");
  }

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate,
      adults,
      children,
      infants,
      max: 5
    });

    return response.data;
  } catch (error) {
    console.error("Amadeus API error:", error);
    throw new Error("Flight search failed");
  }
}

