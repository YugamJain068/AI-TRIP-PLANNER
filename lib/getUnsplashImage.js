import axios from 'axios';

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_KEY;

export async function getUnsplashImage(query = '') {
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        orientation: 'landscape',
        content_filter: 'high',
        per_page: 1,
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    const results = response.data.results;
    if (results && results.length > 0) {
      return results[0].urls.regular;
    } else {
      return '/images/america.jpg'; // fallback
    }
  } catch (err) {
    console.error('Unsplash search error:', err);
    return '/images/america.jpg';
  }
}
