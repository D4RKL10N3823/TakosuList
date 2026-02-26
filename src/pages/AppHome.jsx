import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import PageHeader from "../components/ui/PageHeader";
import { cacheAnimes, getCachedAnimes } from "../offline/cache";
import { useNetworkStatus } from "../offline/useNetworkStatus";

export default function AppHome() {
  const online = useNetworkStatus();

  const [animes, setAnimes] = useState([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 1) Offline-first: cargar desde IndexedDB lo más rápido posible
      const cached = await getCachedAnimes();
      if (!cancelled && cached?.length) {
        setAnimes(cached);
      }

      // 2) Intentar remoto; si funciona, actualizar UI y cache local
      try {
        const { data } = await api.get("/api/animes");
        if (!cancelled) {
          setAnimes(data);
          setMsg("");
        }
        await cacheAnimes(data);
      } catch (err) {
        // 3) Si falla remoto, nos quedamos con lo cacheado
        if (!cancelled) {
          if (!cached?.length) {
            setMsg("Sin conexión y sin caché local: abre la app en línea al menos una vez.");
          } else {
            setMsg("Modo offline: mostrando catálogo guardado localmente.");
          }
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return animes;
    return animes.filter((a) => (a.title || "").toLowerCase().includes(qq));
  }, [animes, q]);

  return (
    <div className="fade-up">
      <PageHeader
        title="Inicio"
        subtitle={online ? "Explora y califica animes" : "Modo offline — mostrando datos locales"}
      />

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar anime..."
          className="w-full sm:max-w-md px-4 py-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-white outline-none"
        />

        {msg && (
          <div className="text-xs text-orange-200 font-semibold tracking-wide">
            {msg}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-muted)]">
          <p className="font-semibold">No hay resultados</p>
          <p className="text-sm mt-1">Prueba con otro título.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((a) => (
            <Link
              key={a._id}
              to={`/app/anime/${a._id}`}
              className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-purple-500/40 transition-all group flex flex-col gap-3"
            >
              <div className="w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-[var(--color-border)] flex-shrink-0">
                {a.coverUrl ? (
                  <img
                    src={a.coverUrl}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">🐙</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-white truncate">{a.title}</div>
                {a.genres?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {a.genres.slice(0, 3).map((g) => (
                      <span
                        key={g}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-200 border border-purple-500/20"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-[var(--color-muted)] mt-2">Sin géneros</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}