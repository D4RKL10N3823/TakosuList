import { Link } from "react-router-dom";

/**
 * AnimeCard — tarjeta de anime premium para la cuadrícula del Home
 * Props: anime ({ _id, title, synopsis, coverUrl, genres })
 */
export default function AnimeCard({ anime }) {
  return (
    <Link
      to={`/app/anime/${anime._id}`}
      className="anime-card group relative no-underline flex flex-col h-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-[0_8px_30px_rgb(6,182,212,0.15)] transition-all duration-300"
      style={{ color: "inherit" }}
    >
      {/* Cover image container */}
      <div className="relative aspect-[3/4] w-full bg-gradient-to-br from-cyan-900/40 to-sky-900/40 overflow-hidden flex-shrink-0">
        {anime.coverUrl ? (
          <img
            src={anime.coverUrl}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-20 drop-shadow-md">🐙</span>
          </div>
        )}
        
        {/* Soft elegant vignette gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1020] via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-75" />

        {/* Genres overlay — top right with glass effect */}
        {anime.genres?.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pr-3">
            {anime.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-[10px] px-2.5 py-1 rounded-full bg-black/40 text-cyan-100 border border-cyan-500/30 font-semibold backdrop-blur-md shadow-sm"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body content */}
      <div className="p-4 flex flex-col flex-1 z-10 -mt-8 relative">
        <h3 className="font-extrabold text-[var(--color-text)] text-base tracking-tight leading-snug line-clamp-2 md:line-clamp-1 group-hover:text-cyan-400 transition-colors drop-shadow-sm">
          {anime.title}
        </h3>

        {anime.synopsis ? (
          <p className="text-xs text-[var(--color-muted)] mt-2 line-clamp-3 leading-relaxed flex-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {anime.synopsis}
          </p>
        ) : (
          <div className="flex-1" />
        )}

        {/* Action / Arrow */}
        <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-semibold text-[var(--color-muted)] group-hover:text-cyan-400 transition-colors">
          <span className="tracking-wide uppercase">Ver detalles</span>
          <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
