import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../services/api";

import CommentThread from "../components/CommentThread";
import RatingWidget from "../components/RatingWidget";
import ListStatusWidget from "../components/ListStatusWidget";
import Button from "../components/ui/Button";
import Card, { CardHeader, CardTitle } from "../components/ui/Card";

import { useNetworkStatus } from "../offline/useNetworkStatus";
import {
  cacheAnimeDetail,
  getCachedAnimeDetail,
  cacheComments,
  getCachedComments,
  cacheRating,
  getCachedRating,
  cacheListStatus,
  getCachedListStatus
} from "../offline/cache";

function vibrate() {
  if ("vibrate" in navigator) navigator.vibrate(50);
}

async function shareAnime(anime) {
  if (!navigator.share) return;
  await navigator.share({
    title: anime.title,
    text: "Mira este anime",
    url: window.location.href
  });
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 fade-up">
      <div className="glass border border-purple-500/30 text-sm px-4 py-3 rounded-xl text-white shadow-xl shadow-purple-500/20 flex items-center gap-2">
        <span className="text-green-400">✓</span>
        {msg}
      </div>
    </div>
  );
}

export default function AnimeDetail() {
  const { id } = useParams();
  const [search] = useSearchParams();
  const focus = search.get("focus");

  const online = useNetworkStatus();

  const [anime, setAnime] = useState(null);
  const [score, setScore] = useState(null);
  const [status, setStatus] = useState("pendiente");
  const [comments, setComments] = useState([]);
  const [msg, setMsg] = useState("");

  const showToast = (text) => {
    setMsg(text);
    window.setTimeout(() => setMsg(""), 3000);
  };

  const load = async () => {
    // Cargar primero lo local (para que sea instantáneo en offline y rápido en online)
    const cachedAnime = await getCachedAnimeDetail(id);
    if (cachedAnime) setAnime(cachedAnime);

    const cachedComments = await getCachedComments(id);
    if (cachedComments?.length) setComments(cachedComments);

    const cachedScore = await getCachedRating(id);
    if (cachedScore != null) setScore(cachedScore);

    const cachedStatus = await getCachedListStatus(id);
    if (cachedStatus) setStatus(cachedStatus);

    // Intentar remoto (si falla, nos quedamos con local)
    const [animeRes, commentsRes, ratingRes, listRes] = await Promise.allSettled([
      api.get(`/api/animes/${id}`),
      api.get(`/api/comments/anime/${id}`),
      api.get(`/api/ratings/${id}`), // si tu backend no lo tiene, quedará rejected sin romper
      api.get(`/api/list/${id}`)     // si tu backend no lo tiene, quedará rejected sin romper
    ]);

    // Anime remoto
    if (animeRes.status === "fulfilled") {
      const a = animeRes.value.data;
      setAnime(a);
      await cacheAnimeDetail(a);
    }

    // Comentarios remoto
    if (commentsRes.status === "fulfilled") {
      const c = commentsRes.value.data;
      setComments(c);
      await cacheComments(id, c);
    }

    // Rating remoto
    if (ratingRes.status === "fulfilled" && ratingRes.value.data?.score != null) {
      const s = ratingRes.value.data.score;
      setScore(s);
      await cacheRating(id, s);
    } else {
      // Si no hay rating remoto, asegura default
      if (score == null) setScore(cachedScore ?? 8);
    }

    // Status remoto
    if (listRes.status === "fulfilled" && listRes.value.data?.status) {
      const st = listRes.value.data.status;
      setStatus(st);
      await cacheListStatus(id, st);
    } else {
      if (!status) setStatus(cachedStatus ?? "pendiente");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (focus) showToast(`Enfoque: comentario ${focus}`);
    // eslint-disable-next-line
  }, [focus]);

  // ---- acciones (bloqueo en offline) ----

  const rate = async () => {
    if (!online) {
      showToast("Sin conexión: no se puede guardar la calificación.");
      return;
    }
    await api.post(`/api/ratings/${id}`, { score: Number(score) });
    await cacheRating(id, Number(score));
    vibrate();
    showToast("Calificación guardada.");
  };

  const addToList = async () => {
    if (!online) {
      showToast("Sin conexión: no se puede guardar en Mi lista.");
      return;
    }
    await api.post(`/api/list/${id}`, { status });
    await cacheListStatus(id, status);
    vibrate();
    showToast("Guardado en Mi lista.");
  };

  const createComment = async (content) => {
    if (!content?.trim()) return;
    if (!online) {
      showToast("Sin conexión: no puedes comentar. Conéctate para enviar.");
      return;
    }
    await api.post(`/api/comments/anime/${id}`, { content });
    vibrate();
    await load();
  };

  const replyComment = async (parentId, content) => {
    if (!content?.trim()) return;
    if (!online) {
      showToast("Sin conexión: no puedes responder. Conéctate para enviar.");
      return;
    }
    await api.post(`/api/comments/anime/${id}`, { content, parentId });
    vibrate();
    await load();
  };

  // ---- UI ----

  if (!anime) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[var(--color-muted)]">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500/50 border-t-purple-500 animate-spin mb-4" />
        <p className="text-sm">Cargando anime…</p>
      </div>
    );
  }

  return (
    <div className="fade-up">
      {/* Hero */}
      <div className="relative mb-8 rounded-2xl overflow-hidden border border-[var(--color-border)]">
        {/* Background */}
        <div className="h-40 bg-gradient-to-br from-purple-900/60 via-pink-900/40 to-slate-900 flex items-end">
          {anime.coverUrl && (
            <img
              src={anime.coverUrl}
              alt={anime.title}
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
          )}
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end p-6">
          <div className="flex items-end gap-4">
            <div className="w-20 h-28 rounded-xl bg-gradient-to-br from-purple-600/40 to-pink-600/40 border border-purple-500/30 flex items-center justify-center text-3xl flex-shrink-0 shadow-xl">
              {anime.coverUrl ? (
                <img
                  src={anime.coverUrl}
                  alt={anime.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                "🎌"
              )}
            </div>

            <div>
              <h1 className="text-2xl font-black text-white text-shadow">{anime.title}</h1>

              {anime.genres?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {anime.genres.map((g) => (
                    <span
                      key={g}
                      className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/20"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {!online && (
                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-orange-200">
                  Offline: mostrando datos guardados localmente
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis */}
      {anime.synopsis && (
        <p className="text-[var(--color-muted)] leading-relaxed mb-8 text-sm">
          {anime.synopsis}
        </p>
      )}

      {/* Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <RatingWidget score={score} onChange={setScore} onSave={rate} />
        <ListStatusWidget status={status} onChange={setStatus} onSave={addToList} />

        <Card>
          <CardHeader>
            <CardTitle>📤 Compartir</CardTitle>
          </CardHeader>
          <p className="text-xs text-[var(--color-muted)] mb-4">
            Recomienda este anime a tus amigos.
          </p>
          <Button variant="ghost" size="sm" onClick={() => shareAnime(anime)} className="w-full">
            Compartir enlace
          </Button>
        </Card>
      </div>

      {/* Comments */}
      <CommentThread comments={comments} onCreate={createComment} onReply={replyComment} />

      {/* Toast */}
      <Toast msg={msg} />
    </div>
  );
}