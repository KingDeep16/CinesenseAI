import { supabase } from '../lib/supabase';
import SearchBar from './SearchBar';
import MovieCard from './MovieCard';
import Filters from './filters';

export default async function Home({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string, p?: string, g?: string, r?: string, c?: string }> 
}) {
  // 1. Await and extract all filter parameters
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const genre = resolvedParams.g || '';
  const minRating = resolvedParams.r || '';
  const castSearch = resolvedParams.c || '';
  const page = parseInt(resolvedParams.p || '1');
  
  const itemsPerPage = 10; 
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // 2. Initialize the Supabase query
  let dbQuery = supabase
    .from('Movies')
    .select('*', { count: 'exact' });

  // 3. Conditional Filter Chaining
  if (query) {
    dbQuery = dbQuery.ilike('Title', `%${query}%`);
  }
  
if (genre) {
  // We use ilike to find the genre even if it's buried between other pipes
  // Example: %Horror% will find "|Horror|" or "Action|Horror"
  dbQuery = dbQuery.ilike('Genre', `%${genre}%`);
}

// 3. Fetch the dynamic genre list
// Ensure this also points to the updated SQL function
const { data: genreData } = await supabase.rpc('get_unique_genres');
const genres = genreData?.map((g: any) => g.genre_name) || [];

  if (minRating) {
    dbQuery = dbQuery.gte('TMDBRating', parseFloat(minRating));
  }

  if (castSearch) {
    // Note: Use .contains('Cast', [castSearch]) if your column is a Postgres Array
    dbQuery = dbQuery.ilike('Cast', `%${castSearch}%`);
  }

  // 4. Finalize with ordering and range
  const { data: movies, count, error } = await dbQuery
    .order('TMDBRating', { ascending: false })
    .range(from, to);

  const totalCount = count || 0;
  const hasNextPage = to < totalCount - 1; 
  const hasPreviousPage = page > 1;

  if (error) return <div className="text-red-500 p-10 text-center font-mono">Error: {error.message}</div>;

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 p-6 md:p-12">
      <header className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-6xl font-black tracking-tighter mb-4 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          CineSense AI
        </h1>
        <p className="text-slate-400 mb-8 font-medium italic">Intelligent cinematic discovery.</p>
        
        <SearchBar />
        <Filters genres={genres} />

        {/* Clear All Results button */}
        {(query || genre || minRating || castSearch) && (
          <div className="mt-4">
            <a href="/" className="text-xs font-bold text-cyan-400 hover:underline">
              ✕ Clear All Filters
            </a>
          </div>
        )}
      </header>
      
      {/* Grid with 5 columns for the smaller card size */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies?.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {/* Pagination with support for all search params */}
      <div className="mt-20 flex justify-center items-center gap-8 pb-20">
        {hasPreviousPage && (
          <a 
            href={`/?p=${page - 1}${query ? `&q=${query}` : ''}${genre ? `&g=${genre}` : ''}${minRating ? `&r=${minRating}` : ''}${castSearch ? `&c=${castSearch}` : ''}`} 
            className="px-6 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all border border-slate-700 text-sm font-bold"
          >
            ← Prev
          </a>
        )}
        
        <span className="text-blue-400 font-black text-lg">{page}</span>

        {hasNextPage && (
          <a 
            href={`/?p=${page + 1}${query ? `&q=${query}` : ''}${genre ? `&g=${genre}` : ''}${minRating ? `&r=${minRating}` : ''}${castSearch ? `&c=${castSearch}` : ''}`} 
            className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-all text-sm font-bold shadow-lg shadow-blue-900/40"
          >
            Next →
          </a>
        )}
      </div>
    </main>
  );
}