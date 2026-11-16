import PropTypes from "prop-types";

// Words shown for the stored roommate values. The keys match the values
// the API saves and the search filters send.

export const SLEEP_LABELS = {
  early: "Early bird",
  late: "Night owl",
  flexible: "Flexible",
};

export const PETS_LABELS = {
  has: "Has pets",
  ok: "Fine with pets",
  no: "No pets please",
};

export const smokingLabel = (smoking) => (smoking ? "Smoker" : "Non-smoker");

// "Priya Patel" -> "PP", "Cher" -> "C".
export function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

// PropTypes shape for a profile as the search API returns it.
export const roommateShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
  budget: PropTypes.number.isRequired,
  neighborhoods: PropTypes.arrayOf(PropTypes.string).isRequired,
  moveInDate: PropTypes.string.isRequired,
  sleepSchedule: PropTypes.oneOf(["early", "late", "flexible"]).isRequired,
  pets: PropTypes.oneOf(["has", "ok", "no"]).isRequired,
  smoking: PropTypes.bool.isRequired,
  bio: PropTypes.string.isRequired,
});
