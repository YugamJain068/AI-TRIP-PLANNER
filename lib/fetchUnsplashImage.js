export async function fetchUnsplashImage(query) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/unsplash`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) throw new Error('Failed to fetch Unsplash image');

    return await res.json();
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return {
      url: '/images/america.jpg',
      photographerName: '',
      photographerProfile: '',
      download_location: '',
    };
  }
}

