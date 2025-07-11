let tokenCache = null;

async function getAccessToken() {
  if (tokenCache && Date.now() < tokenCache.expires) {
    return tokenCache.token;
  }

  const response = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_API_KEY,
      client_secret: process.env.AMADEUS_API_SECRET
    })
  });

  const data = await response.json();

  tokenCache = {
    token: data.access_token,
    expires: Date.now() + data.expires_in * 1000 - 5000 // 5s buffer
  };

  return data.access_token;
}

export async function searchFlights({ from, to, departureDate, adults = 1, children = 0, infants = 0 }) {
  const token = await getAccessToken();

  const fetchFlights = async (a, c, i) => {
    const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${from}&destinationLocationCode=${to}&departureDate=${departureDate}&adults=${a}&children=${c}&infants=${i}&currencyCode=INR`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Amadeus flight error:", errText);
      throw new Error("Flight search failed");
    }

    const data = await response.json();

    // Attach self link for debug/fallback display
    data.meta = {
      ...data.meta,
      links: { self: url }
    };

    return data;
  };

  // Initial attempt
  const initial = await fetchFlights(adults, children, infants);

  const totalPassengers = adults + children + infants;

  // Retry logic: if no results and total > 9, fallback to 9 adults only
  if ((initial?.data?.length === 0 || initial?.meta?.count === 0) && totalPassengers > 9) {
    console.warn("No flights found with full group. Retrying with 9 adults only...");
    const fallback = await fetchFlights(9, 0, 0);
    return fallback;
  }

  return initial;
}

