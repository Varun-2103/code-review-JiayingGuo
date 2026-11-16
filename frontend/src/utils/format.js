// Dates are saved as midnight UTC, so they are always shown in UTC.
// Otherwise Boston (UTC-5) would show Jan 1 as Dec 31.
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateRange(startIso, endIso) {
  return `${formatDate(startIso)} – ${formatDate(endIso)}`;
}

export function formatRent(rent) {
  return `$${rent.toLocaleString("en-US")}`;
}

// Value for <input type="date">: "YYYY-MM-DD".
export function toDateInputValue(iso) {
  return iso ? new Date(iso).toISOString().slice(0, 10) : "";
}
