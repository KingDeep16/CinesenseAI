import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const year = searchParams.get('year');

  const TMDB_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;
  
  if (!TMDB_TOKEN) {
    return NextResponse.json({ error: 'TMDB Token Missing' }, { status: 500 });
  }

  try {
    // Pass 1: Strict Search (Title + Year)
    let url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title || '')}&year=${year}`;
    let res = await fetch(url, { 
      headers: { Authorization: `Bearer ${TMDB_TOKEN.trim()}` } 
    });
    let data = await res.json();
    let posterPath = data.results?.[0]?.poster_path;

    // Pass 2: Loose Search (Title only) - Runs if Pass 1 found nothing
    if (!posterPath) {
      url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(title || '')}`;
      res = await fetch(url, { 
        headers: { Authorization: `Bearer ${TMDB_TOKEN.trim()}` } 
      });
      data = await res.json();
      posterPath = data.results?.[0]?.poster_path;
    }

    return NextResponse.json({ posterPath: posterPath || null });
  } catch (error) {
    return NextResponse.json({ posterPath: null }, { status: 500 });
  }
}