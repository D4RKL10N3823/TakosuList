import { useEffect, useState } from "react";
import api from "../services/api";
import AnimeListItem from "../components/AnimeListItem";
import PageHeader from "../components/ui/PageHeader";
import { cacheMyList, getCachedMyList } from "../offline/cache";

const STATUS_TABS = ["todos", "pendiente", "viendo", "completado"];

export default function MyList() {
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState("todos");

  useEffect(() => {
    // 1) Offline-first: cargar datos locales (IndexedDB) inmediatamente
    (async () => {
      const cached = await getCachedMyList();
      if (cached?.length) {
        // cached trae: { animeId, status, anime }
        // Adaptamos al formato que tu UI espera: item.animeId como objeto anime
        setItems(
          cached.map((x) => ({
            _id: x.animeId,          // id para key estable
            animeId: x.anime,        // objeto anime guardado localmente
            status: x.status
          }))
        );
      }
    })();

    // 2) Intentar remoto y actualizar cache local
    (async () => {
      try {
        const { data } = await api.get("/api/list");
        setItems(data);
        await cacheMyList(data);
      } catch (err) {
        console.error("Error cargando lista (remoto), usando local si existe.");
      }
    })();
  }, []);

  const filtered =
    tab === "todos" ? items : items.filter((i) => i.status === tab);

  return (
    <div className="fade-up">
      <PageHeader title="Mi Lista" subtitle="Tu colección personal de animes" />

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] w-fit">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-all ${
              tab === s
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
                : "text-[var(--color-muted)] hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[var(--color-muted)]">
          <div className="text-5xl mb-4">📭</div>
          <p className="font-semibold">Esta sección está vacía</p>
          <p className="text-sm mt-1">
            {tab === "todos"
              ? "Agrega animes desde su página de detalle."
              : `No tienes animes con estado "${tab}".`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((it) => (
            <AnimeListItem key={it._id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}