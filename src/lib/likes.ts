const STORAGE_KEY = "motion-course-liked";
const TOTAL_KEY = "motion-course-likes-total";
const BASE_TOTAL = 128; // número de arranque, mientras no hay backend

export function hasLiked(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "1";
}

export function getTotalLikes(): number {
  const stored = localStorage.getItem(TOTAL_KEY);
  return stored ? Number(stored) : BASE_TOTAL;
}

// TODO: reemplazar por un POST a Firebase cuando esté conectado.
// Debe devolver el total actualizado.
export function addLike(): number {
  if (hasLiked()) return getTotalLikes();
  localStorage.setItem(STORAGE_KEY, "1");
  const total = getTotalLikes() + 1;
  localStorage.setItem(TOTAL_KEY, String(total));
  return total;
}
