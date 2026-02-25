import Dexie from "dexie";

export const db = new Dexie("animerate_offline");

db.version(1).stores({
  // catálogo
  animes: "_id, title, updatedAt",

  // detalle de anime
  animeDetails: "_id, updatedAt",

  // comentarios por anime (guardamos un objeto por animeId)
  commentsByAnime: "animeId, updatedAt",

  // mi lista (guardamos status y el objeto anime para mostrar offline)
  myList: "animeId, status, updatedAt",

  // rating por anime
  ratingsByAnime: "animeId, updatedAt",

  // status por anime (si quieres acceso rápido sin traer toda la lista)
  listStatusByAnime: "animeId, updatedAt"
});