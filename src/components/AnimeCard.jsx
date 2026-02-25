import { Link } from "react-router-dom";

/**
 * AnimeCard — tarjeta de anime para la cuadrícula del Home
 * Props: anime ({ _id, title, synopsis, coverUrl, genres })
 */
export default function AnimeCard({ anime }) {
  return (
    <Link
      to={`/app/anime/${anime._id}`}
      className="anime-card group block no-underline"
      style={{ color: "inherit" }}
    >
      {/* Cover image */}
      <div className="relative h-52 bg-gradient-to-br from-cyan-900/30 to-sky-900/30 overflow-hidden">
        {anime.coverUrl ? (
          <img
            src={anime.coverUrl}
            alt={anime.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-25">🐙</span>
          </div>
        )}
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />

        {/* Genres overlay — top right */}
        {anime.genres?.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {anime.genres.slice(0, 1).map((g) => (
              <span
                key={g}
                className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 font-medium backdrop-blur-sm"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5">
        <h3 className="font-bold text-[var(--color-text)] text-sm leading-tight line-clamp-1 group-hover:text-cyan-400 transition-colors">
          {anime.title}
        </h3>

        {anime.synopsis && (
          <p className="text-xs text-[var(--color-muted)] mt-1.5 line-clamp-2 leading-relaxed">
            {anime.synopsis}
          </p>
        )}

        {/* Arrow */}
        <div className="mt-3 flex items-center gap-1 text-xs text-[var(--color-muted)] group-hover:text-cyan-400 transition-colors">
          <span>Ver detalles</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
