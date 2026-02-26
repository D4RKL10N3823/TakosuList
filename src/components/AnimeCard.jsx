import { Link } from "react-router-dom";

/**
 * AnimeCard — tarjeta de anime para la cuadrícula del Home
 * Props: anime ({ _id, title, synopsis, coverUrl, genres })
 */
export default function AnimeCard({ anime }) {
  return (
    <Link
      to={`/app/anime/${anime._id}`}
      className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-cyan-500/40 hover:shadow-[0_4px_20px_rgb(6,182,212,0.1)] transition-all group flex flex-col gap-3.5 no-underline"
      style={{ color: "inherit" }}
    >
      {/* Cover image container */}
      <div className="w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-900/30 to-sky-900/30 border border-[var(--color-border)] flex-shrink-0 relative">
        {anime.coverUrl ? (
          <img
            src={anime.coverUrl}
            alt={anime.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-20 drop-shadow-md">🐙</span>
          </div>
        )}
      </div>

      {/* Body content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Genres */}
        {anime.genres?.length > 0 ? (
          <div className="mb-2.5 flex flex-wrap gap-1.5">
            {anime.genres.map((g) => (
              <span
                key={g}
                className="text-[10px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold tracking-wide"
              >
                {g}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-xs text-[var(--color-muted)] mb-2.5 italic">Sin géneros</div>
        )}
        
        {/* Title */}
        <h3 className="font-extrabold text-[var(--color-text)] text-base leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors drop-shadow-sm">
          {anime.title}
        </h3>
        
        {/* Action arrow to signify it's clickable (optional, neat detail) */}
        <div className="mt-auto pt-3 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-muted)] group-hover:text-cyan-400 transition-colors">
          <span>Ver detalles</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
