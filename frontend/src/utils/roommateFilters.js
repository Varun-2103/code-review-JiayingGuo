// The roommate search filters live in the URL, so a search can be shared,
// refreshed and reached with the back button. These helpers convert between
// the URL and the values the filter form uses. Same idea as subletFilters.js.

export const EMPTY_ROOMMATE_FILTERS = {
  neighborhoods: [],
  minBudget: "",
  maxBudget: "",
  moveInFrom: "",
  moveInTo: "",
  sleep: "",
  pets: "",
  smoking: "",
  sort: "newest",
};

const TEXT_KEYS = [
  "minBudget",
  "maxBudget",
  "moveInFrom",
  "moveInTo",
  "sleep",
  "pets",
  "smoking",
];

export function roommateFiltersFromParams(params) {
  const filters = {
    neighborhoods: params.getAll("neighborhood"),
    sort: params.get("sort") ?? "newest",
  };
  for (const key of TEXT_KEYS) filters[key] = params.get(key) ?? "";
  return filters;
}

// Repeated keys (neighborhood=A&neighborhood=B) are what the server reads
// as a list. Empty values are left out to keep the URL short.
export function paramsFromRoommateFilters(filters) {
  const params = new URLSearchParams();
  filters.neighborhoods.forEach((n) => params.append("neighborhood", n));
  for (const key of TEXT_KEYS) {
    if (filters[key] !== "") params.set(key, filters[key]);
  }
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  return params;
}
