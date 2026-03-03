# CineSense AI – Intelligent Cinematic Discovery
CineSense AI is a full-stack movie discovery platform that leverages LLMs to provide instant, witty critical analysis. Built with a focus on high-performance data fetching, dynamic filtering, and a seamless AI user experience.

#  Tech Stack
Frontend: Next.js 15 (App Router), Tailwind CSS, TypeScript.

Backend: Supabase (PostgreSQL), Next.js API Routes.

AI Engine: Google Gemini 2.5 Flash.

Data: TMDB API (Poster Proxying), Custom Movies Dataset.

#  Key Features
AI Critic Integration: Real-time generation of movie "verdicts" using Gemini 2.5 with a custom typewriter UI effect.

Complex Filtering: Server-side filtering by Genre, Cast, and Minimum Rating using URL search parameters for bookmarkable states.

Dynamic Data Fetching: Custom SQL functions to unnest and aggregate pipe-separated (|) genre data from a relational database.

Secure API Proxying: Server-side image fetching and AI calls to protect sensitive API keys from the client-side.

#  Engineering Challenges & Solutions
1. Handling Non-Standard Data Structures
Challenge: The movie dataset utilized a pipe-separated string format for genres (Action|Sci-Fi), making standard SQL filtering inefficient.
Solution: Developed a PostgreSQL function (get_unique_genres) using unnest and string_to_array to dynamically generate a clean, unique genre list for the UI directly from the database.

2. Synchronizing Frontend & Database Schema
Challenge: Faced a mismatch between frontend property names and a case-sensitive legacy database schema (e.g., Genre vs Genres).
Solution: Refactored the data access layer in Next.js 15 to align with strict PostgreSQL naming conventions and implemented a robust "No Results" state to handle edge cases.

4. UI/UX: The "AI Lobby" Problem
Challenge: AI responses can take 1-2 seconds, which can feel like "lag" to a user.
Solution: Implemented a custom typewriter effect and loading states that provide immediate visual feedback, making the AI feel like it's "thinking" in real-time rather than just loading data.

#  Database Schema
The project uses a structured PostgreSQL table (Movies) with the following core fields:

Title (text)

Genre (text, pipe-separated: Action|Adventure)

TMDBRating (float8)

Runtime (int4)

Cast (text)

Description (text)

Setup steps:

Clone the repo: git clone <your-repo-url>

Install dependencies: npm install

Setup Supabase database using schema provided in supabase folder and recreate database by importing csv found in the data folder.

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

