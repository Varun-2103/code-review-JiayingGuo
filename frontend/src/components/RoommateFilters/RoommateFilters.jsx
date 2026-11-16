import { useState } from "react";
import PropTypes from "prop-types";
import { NEIGHBORHOODS } from "../../constants/neighborhoods.js";
import { EMPTY_ROOMMATE_FILTERS } from "../../utils/roommateFilters.js";
import { PETS_LABELS, SLEEP_LABELS } from "../../utils/roommateLabels.js";
// Same sidebar look as the sublet search, so the two searches match.
import "../SubletFilters/SubletFilters.css";

function checkFilters(f) {
  if (f.minBudget !== "" && f.maxBudget !== "" && +f.minBudget > +f.maxBudget) {
    return "Minimum budget cannot be more than maximum budget.";
  }
  if (f.moveInFrom && f.moveInTo && f.moveInFrom > f.moveInTo) {
    return "The first move-in date must be before the last one.";
  }
  return "";
}

// Search form for roommate profiles. The page passes the current values
// from the URL and gets the new values back in onApply. Changing the sort
// applies right away.
function RoommateFilters({ initialValues, onApply }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");

  const setField = (field, value) =>
    setValues((v) => ({ ...v, [field]: value }));

  function toggleNeighborhood(name) {
    setValues((v) => ({
      ...v,
      neighborhoods: v.neighborhoods.includes(name)
        ? v.neighborhoods.filter((n) => n !== name)
        : [...v.neighborhoods, name],
    }));
  }

  function apply(next) {
    const message = checkFilters(next);
    setError(message);
    if (!message) onApply(next);
  }

  function handleSubmit(event) {
    event.preventDefault();
    apply(values);
  }

  function handleSortChange(event) {
    const next = { ...values, sort: event.target.value };
    setValues(next);
    apply(next);
  }

  function handleReset() {
    setValues(EMPTY_ROOMMATE_FILTERS);
    setError("");
    onApply(EMPTY_ROOMMATE_FILTERS);
  }

  const selectedCount = values.neighborhoods.length;

  return (
    <form
      className="sublet-filters"
      onSubmit={handleSubmit}
      aria-label="Search roommates"
    >
      <label htmlFor="roommate-sort">
        Sort by
        <select
          id="roommate-sort"
          value={values.sort}
          onChange={handleSortChange}
        >
          <option value="newest">Newest</option>
          <option value="budget_asc">Budget: low to high</option>
          <option value="budget_desc">Budget: high to low</option>
          <option value="movein_asc">Move-in date: soonest</option>
        </select>
      </label>

      {/* Toggle buttons: a profile matches if any of its neighborhoods is picked. */}
      <fieldset className="filters-neighborhoods">
        <legend>
          Neighborhoods
          {selectedCount > 0 && (
            <span className="filters-selected"> {selectedCount} selected</span>
          )}
        </legend>
        <div className="filters-chips">
          {NEIGHBORHOODS.map((name) => (
            <button
              key={name}
              type="button"
              className="filters-chip"
              aria-pressed={values.neighborhoods.includes(name)}
              onClick={() => toggleNeighborhood(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="filters-row">
        <legend>Monthly budget ($)</legend>
        <label htmlFor="roommate-min-budget">
          Min
          <input
            id="roommate-min-budget"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={values.minBudget}
            onChange={(e) => setField("minBudget", e.target.value)}
          />
        </label>
        <label htmlFor="roommate-max-budget">
          Max
          <input
            id="roommate-max-budget"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={values.maxBudget}
            onChange={(e) => setField("maxBudget", e.target.value)}
          />
        </label>
      </fieldset>

      <fieldset className="filters-row">
        <legend>Moving in between</legend>
        <label htmlFor="roommate-move-in-from">
          From
          <input
            id="roommate-move-in-from"
            type="date"
            value={values.moveInFrom}
            onChange={(e) => setField("moveInFrom", e.target.value)}
          />
        </label>
        <label htmlFor="roommate-move-in-to">
          To
          <input
            id="roommate-move-in-to"
            type="date"
            value={values.moveInTo}
            onChange={(e) => setField("moveInTo", e.target.value)}
          />
        </label>
      </fieldset>

      <label htmlFor="roommate-sleep">
        Sleep schedule
        <select
          id="roommate-sleep"
          value={values.sleep}
          onChange={(e) => setField("sleep", e.target.value)}
        >
          <option value="">Any</option>
          {Object.entries(SLEEP_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="roommate-pets">
        Pets
        <select
          id="roommate-pets"
          value={values.pets}
          onChange={(e) => setField("pets", e.target.value)}
        >
          <option value="">Any</option>
          {Object.entries(PETS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="roommate-smoking">
        Smoking
        <select
          id="roommate-smoking"
          value={values.smoking}
          onChange={(e) => setField("smoking", e.target.value)}
        >
          <option value="">Any</option>
          <option value="no">Non-smokers only</option>
          <option value="yes">Smokers only</option>
        </select>
      </label>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <div className="filters-actions">
        <button type="submit" className="button">
          Search
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={handleReset}
        >
          Clear
        </button>
      </div>
    </form>
  );
}

RoommateFilters.propTypes = {
  initialValues: PropTypes.shape({
    neighborhoods: PropTypes.arrayOf(PropTypes.string).isRequired,
    minBudget: PropTypes.string.isRequired,
    maxBudget: PropTypes.string.isRequired,
    moveInFrom: PropTypes.string.isRequired,
    moveInTo: PropTypes.string.isRequired,
    sleep: PropTypes.string.isRequired,
    pets: PropTypes.string.isRequired,
    smoking: PropTypes.string.isRequired,
    sort: PropTypes.string.isRequired,
  }).isRequired,
  onApply: PropTypes.func.isRequired,
};

export default RoommateFilters;
