import { db } from "./db";

/** ---------------------------
 *  Catálogo (Home)
 *  -------------------------*/
export async function cacheAnimes(animes) {
  const now = Date.now();
  await db.animes.clear();
  await db.animes.bulkPut(
    (animes || []).map((a) => ({ ...a, updatedAt: now }))
  );
}

export async function getCachedAnimes() {
  return await db.animes.toArray();
}

/** ---------------------------
 *  Detalle de Anime
 *  -------------------------*/
export async function cacheAnimeDetail(anime) {
  if (!anime?._id) return;
  await db.animeDetails.put({ ...anime, updatedAt: Date.now() });
}

export async function getCachedAnimeDetail(id) {
  if (!id) return null;
  return await db.animeDetails.get(id);
}

/** ---------------------------
 *  Comentarios
 *  -------------------------*/
export async function cacheComments(animeId, comments) {
  if (!animeId) return;
  await db.commentsByAnime.put({
    animeId,
    comments: comments || [],
    updatedAt: Date.now()
  });
}

export async function getCachedComments(animeId) {
  if (!animeId) return [];
  const row = await db.commentsByAnime.get(animeId);
  return row?.comments || [];
}

/** ---------------------------
 *  Mi Lista (lista completa)
 *  -------------------------*/
export async function cacheMyList(items) {
  const now = Date.now();
  await db.myList.clear();

  // items típicamente: [{ animeId: {...} | "id", status }, ...]
  const mapped = (items || []).map((it) => ({
    animeId: it?.animeId?._id || it?.animeId,
    status: it?.status || "pendiente",
    anime: it?.animeId && typeof it.animeId === "object" ? it.animeId : null,
    updatedAt: now
  }));

  // Filtra entradas mal formadas
  const valid = mapped.filter((x) => !!x.animeId);
  await db.myList.bulkPut(valid);
}

export async function getCachedMyList() {
  return await db.myList.toArray();
}

/** ---------------------------
 *  Rating por Anime
 *  -------------------------*/
export async function cacheRating(animeId, score) {
  if (!animeId) return;
  await db.ratingsByAnime.put({
    animeId,
    score: typeof score === "number" ? score : Number(score),
    updatedAt: Date.now()
  });
}

export async function getCachedRating(animeId) {
  if (!animeId) return null;
  const row = await db.ratingsByAnime.get(animeId);
  return row?.score ?? null;
}

/** ---------------------------
 *  Estado de Lista por Anime
 *  -------------------------*/
export async function cacheListStatus(animeId, status) {
  if (!animeId) return;
  await db.listStatusByAnime.put({
    animeId,
    status: status || "pendiente",
    updatedAt: Date.now()
  });
}

export async function getCachedListStatus(animeId) {
  if (!animeId) return null;
  const row = await db.listStatusByAnime.get(animeId);
  return row?.status ?? null;
}