// The search filters live in the URL, so a search can be shared, refreshed
// and reached with the back button. These helpers convert between the URL
// and the values the filter form uses.

export const EMPTY_FILTERS = {
  neighborhoods: [],
  minRent: "",
  maxRent: "",
  moveIn: "",
  moveOut: "",
  furnished: false,
  sort: "newest",
};

export function filtersFromParams(params) {
  return {
    neighborhoods: params.getAll("neighborhood"),
    minRent: params.get("minRent") ?? "",
    maxRent: params.get("maxRent") ?? "",
    moveIn: params.get("moveIn") ?? "",
    moveOut: params.get("moveOut") ?? "",
    furnished: params.get("furnished") === "true",
    sort: params.get("sort") ?? "newest",
  };
}

// Repeated keys (neighborhood=A&neighborhood=B) are what the server reads
// as a list. Empty values are left out to keep the URL short.
export function paramsFromFilters(filters) {
  const params = new URLSearchParams();
  filters.neighborhoods.forEach((n) => params.append("neighborhood", n));
  for (const key of ["minRent", "maxRent", "moveIn", "moveOut"]) {
    if (filters[key] !== "") params.set(key, filters[key]);
  }
  if (filters.furnished) params.set("furnished", "true");
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  return params;
}
