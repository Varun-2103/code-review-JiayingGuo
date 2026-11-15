import { request } from "./request.js";

// queryString is the page's URL search string, e.g. "neighborhood=Fenway&page=2".
export function searchSublets(queryString) {
  return request(`/api/sublets${queryString ? `?${queryString}` : ""}`);
}

export function getSublet(id) {
  return request(`/api/sublets/${encodeURIComponent(id)}`);
}

export function getMySublets() {
  return request("/api/sublets/mine");
}

export function createSublet(sublet) {
  return request("/api/sublets", { method: "POST", body: sublet });
}

export function updateSublet(id, sublet) {
  return request(`/api/sublets/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: sublet,
  });
}

export function setSubletStatus(id, status) {
  return request(`/api/sublets/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    body: { status },
  });
}

export function deleteSublet(id) {
  return request(`/api/sublets/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
