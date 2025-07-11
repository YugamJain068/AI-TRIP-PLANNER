import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  const { query } = await request.json();

  try {
    const res = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        orientation: 'landscape',
        per_page: 1,
      },
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_SECRET_KEY}`,
      },
    });

    const result = res.data.results[0];

    if (result) {
      return NextResponse.json({
        url: result.urls.regular,
        photographerName: result.user.name,
        photographerProfile: result.user.links.html + '?utm_source=tripforge_ai&utm_medium=referral',
        download_location: result.links.download_location,
      });
    }

    return NextResponse.json({
      url: '/images/america.jpg',
      photographerName: '',
      photographerProfile: '',
      download_location: '',
    });
  } catch (error) {
    console.error('Unsplash API error:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}
