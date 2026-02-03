// TOKEN
export function saveUserToken(userToken) {
  localStorage.setItem("userToken", userToken);
}

export function getUserToken() {
  return localStorage.getItem("userToken");
}

export function removeUserToken() {
  localStorage.removeItem("userToken");
}

export function isAuthenticated() {
  return !!localStorage.getItem("userToken");
}

// FAVORITES
export function getUserFav() {
  return JSON.parse(localStorage.getItem("userFav")) || [];
}
export function getUserFavLength() {
  return JSON.parse(localStorage.getItem("userFav")).length || 0
}

export function addUserFav(item) {
  const favs = getUserFav();
  const exists = favs.find((f) => f.id === item.id);

  if (!exists) {
    localStorage.setItem("userFav", JSON.stringify([...favs, item]));
  }
}

export function removeUserFav(id) {
  const favs = getUserFav().filter((f) => f.id !== id);
  localStorage.setItem("userFav", JSON.stringify(favs));
}

export function isFav(id) {
  return getUserFav().some((f) => f.id === id);
}
