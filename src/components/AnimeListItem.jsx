import { Link } from "react-router-dom";

const STATUS_COLORS = {
  viendo:     "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  completado: "bg-green-500/15 text-green-300 border-green-500/25",
  pendiente:  "bg-orange-500/15 text-orange-300 border-orange-500/25",
  abandonado: "bg-red-500/15 text-red-300 border-red-500/25",
};

const STATUS_ICONS = {
  viendo: "▶",
  completado: "✓",
  pendiente: "⏳",
  abandonado: "✗",
};

/**
 * AnimeListItem — fila de item en MyList con portada
 * Props: item ({ _id, animeId: { _id, title, coverUrl, genres }, status })
 */
export default function AnimeListItem({ item }) {
  const anime = item.animeId;
  const badgeClass = STATUS_COLORS[item.status] || "bg-[var(--color-surface2)] text-[var(--color-muted)]";
  const icon = STATUS_ICONS[item.status] || "•";

  return (
    <Link
      to={`/app/anime/${anime?._id}`}
      className="flex items-center gap-4 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-cyan-500/30 hover:bg-[var(--color-surface2)] transition-all group no-underline"
      style={{ color: "inherit" }}
    >
      {/* Portada */}
      <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-cyan-900/30 to-sky-900/30 border border-[var(--color-border)]">
        {anime?.coverUrl ? (
          <img
            src={anime.coverUrl}
            alt={anime.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">🐙</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-[var(--color-text)] truncate group-hover:text-cyan-400 transition-colors">
          {anime?.title || "Anime eliminado"}
        </p>
        {anime?.genres?.length > 0 && (
          <p className="text-xs text-[var(--color-muted)] mt-0.5 truncate">
            {anime.genres.slice(0, 2).join(" · ")}
          </p>
        )}
      </div>

      {/* Badge estado */}
      <span className={`flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${badgeClass} flex items-center gap-1`}>
        <span>{icon}</span>
        <span className="capitalize">{item.status}</span>
      </span>
    </Link>
  );
}
