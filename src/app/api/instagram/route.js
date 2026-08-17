import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const rapidApiKey = 'ebdb0595f3msha43bdfa1b67348bp10f9bejsn4d2477b63799';
  const rapidApiHost = 'instagram120.p.rapidapi.com';

  if (!rapidApiKey) {
    return NextResponse.json({ 
      error: 'RAPIDAPI_KEY is not set in environment variables',
      instructions: 'Please get an API key from https://rapidapi.com/junioroangel/api/instagram-scraper and add RAPIDAPI_KEY to your .env.local file. Also set RAPIDAPI_HOST to the correct host provided by RapidAPI.' 
    }, { status: 500 });
  }

  try {
    const userUrl = `https://${rapidApiHost}/api/instagram/userInfo`;
    const postsUrl = `https://${rapidApiHost}/api/instagram/posts`;
    
    const baseHeaders = {
      'x-rapidapi-key': rapidApiKey,
      'x-rapidapi-host': rapidApiHost,
      'Content-Type': 'application/json'
    };

    const userOptions = {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify({ username: username })
    };

    const postsOptions = {
      method: 'POST',
      headers: baseHeaders,
      body: JSON.stringify({ username: username, maxId: "" })
    };

    const [userRes, postsRes] = await Promise.all([
      fetch(userUrl, userOptions),
      fetch(postsUrl, postsOptions)
    ]);

    const userData = await userRes.json();
    const postsData = await postsRes.json();

    return NextResponse.json({
      userInfo: userData,
      postsData: postsData
    });
    
    // Fallback: If this specific endpoint doesn't work out of the box because junioroangel uses a different path, 
    // we return the raw response anyway so the user can debug/update the URL in this route.js
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    return NextResponse.json({ error: 'Failed to fetch Instagram profile' }, { status: 500 });
  }
}
