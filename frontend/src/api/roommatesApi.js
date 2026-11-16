import { request } from "./request.js";

// Roommate profiles API (Yanli Wang). Same shape as subletsApi.js.
// The backend routes behind these are built feature by feature, so some
// of them may not exist yet.

// queryString is the page's URL search string, e.g. "neighborhood=Fenway&page=2".
export function searchRoommates(queryString) {
  return request(`/api/roommates${queryString ? `?${queryString}` : ""}`);
}

export function getRoommate(id) {
  return request(`/api/roommates/${encodeURIComponent(id)}`);
}

// The logged-in student's own profile, or null if they have none.
export function getMyRoommate() {
  return request("/api/roommates/mine");
}

export function createRoommate(profile) {
  return request("/api/roommates", { method: "POST", body: profile });
}

export function updateRoommate(id, profile) {
  return request(`/api/roommates/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: profile,
  });
}

// hidden: true hides the profile from search, false shows it again.
export function setRoommateHidden(id, hidden) {
  return request(`/api/roommates/${encodeURIComponent(id)}/visibility`, {
    method: "PATCH",
    body: { hidden },
  });
}

export function deleteRoommate(id) {
  return request(`/api/roommates/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
