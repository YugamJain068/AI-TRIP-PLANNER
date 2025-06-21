import { NextResponse } from 'next/server';
import amadeus from "@/lib/amadeus";

export async function POST(request) {
  const { from, to, departureDate } = await request.json();

  if (!departureDate) {
    return NextResponse.json({ error: 'Missing departureDate' }, { status: 400 });
  }

  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: from,
      destinationLocationCode: to,
      departureDate,
      adults: 1,
      max: 5
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Amadeus API error:", error);
    return NextResponse.json({ error: 'Flight search failed' }, { status: 500 });
  }
}
