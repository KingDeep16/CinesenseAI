# AI-Movie-Review-Site-Project
A full-stack movie discovery platform featuring AI-driven sentiment analysis, automated spoiler detection, and semantic mood-based search. Built with Next.js, Supabase, and Gemini 2.5.

Setup steps:

Clone the repo: git clone <your-repo-url>

Install dependencies: npm install

Create a .env.local file: you must create this file in the root folder.

Fill in the Keys: you will need to provide your own keys for:

NEXT_PUBLIC_SUPABASE_URL (From Supabase project settings)

NEXT_PUBLIC_SUPABASE_ANON_KEY (From Supabase project settings)

TMDB_READ_ACCESS_TOKEN (The long "Read Access Token" from TMDB)

GEMINI_API_KEY (From Google AI Studio)

Run the dev server: npm run dev

Example .env.local file:

# Supabase (Public)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# TMDB API (Server-side)
TMDB_READ_ACCESS_TOKEN=your_tmdb_token_here

# Gemini AI (Server-side)
GEMINI_API_KEY=your_gemini_key_here

