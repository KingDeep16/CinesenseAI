'use client';

import { useState, useEffect } from 'react';

export default function MovieCard({ movie }: { movie: any }) {
  const [posterPath, setPosterPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    async function getPoster() {
      try {
        const response = await fetch(
          `/api/poster?title=${encodeURIComponent(movie.Title)}&year=${movie.ReleaseYear}`
        );
        const data = await response.json();
        setPosterPath(data.posterPath);
      } catch (err) {
        console.error("Poster fetch failed", err);
      } finally {
        setLoading(false);
      }
    }
    getPoster();
  }, [movie.Title, movie.ReleaseYear]);

  const getAiVerdict = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: movie.Title, 
          rating: movie.TMDBRating, 
          description: movie.Description 
        }),
      });
      const data = await res.json();
      setAiVerdict(data.verdict);
    } catch (err) {
      setAiVerdict("AI is currently offline.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="group relative bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden hover:border-cyan-500/50 transition-all duration-500 shadow-2xl flex flex-col h-full">
      {/* Poster Section */}
      <div className="aspect-[2/3] relative overflow-hidden bg-slate-900">
        {loading ? (
          <div className="flex items-center justify-center h-full animate-pulse bg-slate-800 text-slate-500 text-xs">
            Loading...
          </div>
        ) : posterPath ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500${posterPath}`} 
            alt={movie.Title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="h-full w-full">
             <img 
                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=500" 
                className="object-cover h-full w-full opacity-30 grayscale"
                alt="Cinema Placeholder"
              />
             {/* Text removed for a cleaner look */}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="font-bold text-lg truncate group-hover:text-cyan-400 transition-colors">
          {movie.Title}
        </h2>
        <div className="flex justify-between items-center mt-1 mb-4 text-sm text-slate-400">
          <span>{movie.ReleaseYear} • {movie.Runtime}m</span>
          <span className="text-cyan-400 font-bold flex items-center gap-1">
            <span className="text-yellow-500">★</span> {movie.TMDBRating}
          </span>
        </div>

        <button 
          onClick={getAiVerdict}
          disabled={isAnalyzing}
          className="mt-auto w-full py-2 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/40 hover:to-blue-600/40 border border-cyan-500/30 rounded-lg text-[10px] font-bold tracking-widest uppercase text-cyan-200 transition-all disabled:opacity-50"
        >
          {isAnalyzing ? 'Analyzing...' : aiVerdict ? 'Verdict Ready' : 'Get AI Verdict'}
        </button>

        {aiVerdict && (
          <div className="mt-3 text-xs italic text-cyan-100 bg-cyan-950/40 p-3 rounded-lg border border-cyan-500/20 animate-in fade-in slide-in-from-top-1">
            "{aiVerdict}"
          </div>
        )}
      </div>
    </div>
  );
}