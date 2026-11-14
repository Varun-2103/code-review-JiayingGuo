import { useState } from "react";
import PropTypes from "prop-types";
import { NEIGHBORHOODS } from "../../constants/neighborhoods.js";
import { EMPTY_FILTERS } from "../../utils/subletFilters.js";
import "./SubletFilters.css";

function checkFilters(f) {
  if (f.minRent !== "" && f.maxRent !== "" && +f.minRent > +f.maxRent) {
    return "Minimum rent cannot be more than maximum rent.";
  }
  if (f.moveIn && f.moveOut && f.moveOut <= f.moveIn) {
    return "Move-out date must be after the move-in date.";
  }
  return "";
}

// Search form. The page passes the current values from the URL and gets
// the new values back in onApply. Changing the sort applies right away.
function SubletFilters({ initialValues, onApply }) {
  const [values, setValues] = useState(initialValues);
  const [error, setError] = useState("");
  // Only decides whether the neighborhood list starts open. After that the
  // user opens and closes it.
  const [neighborhoodsOpen] = useState(initialValues.neighborhoods.length > 0);

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
    setValues(EMPTY_FILTERS);
    setError("");
    onApply(EMPTY_FILTERS);
  }

  const selectedCount = values.neighborhoods.length;

  return (
    <form
      className="sublet-filters"
      onSubmit={handleSubmit}
      aria-label="Search sublets"
    >
      <label htmlFor="filter-sort">
        Sort by
        <select
          id="filter-sort"
          value={values.sort}
          onChange={handleSortChange}
        >
          <option value="newest">Newest</option>
          <option value="rent_asc">Price: low to high</option>
          <option value="rent_desc">Price: high to low</option>
        </select>
      </label>

      <details className="filters-neighborhoods" open={neighborhoodsOpen}>
        <summary>
          Neighborhoods{selectedCount > 0 && ` (${selectedCount} selected)`}
        </summary>
        <fieldset>
          <legend className="visually-hidden">Neighborhoods</legend>
          {NEIGHBORHOODS.map((name) => (
            <label key={name} className="filters-check">
              <input
                type="checkbox"
                checked={values.neighborhoods.includes(name)}
                onChange={() => toggleNeighborhood(name)}
              />
              {name}
            </label>
          ))}
        </fieldset>
      </details>

      <fieldset className="filters-row">
        <legend>Monthly rent ($)</legend>
        <label htmlFor="filter-min-rent">
          Min
          <input
            id="filter-min-rent"
            type="number"
            min="0"
            step="50"
            inputMode="numeric"
            value={values.minRent}
            onChange={(e) => setField("minRent", e.target.value)}
          />
        </label>
        <label htmlFor="filter-max-rent">
          Max
          <input
            id="filter-max-rent"
            type="number"
            min="0"
            step="50"
            inputMode="numeric"
            value={values.maxRent}
            onChange={(e) => setField("maxRent", e.target.value)}
          />
        </label>
      </fieldset>

      <fieldset className="filters-row">
        <legend>Your dates</legend>
        <label htmlFor="filter-move-in">
          Move in
          <input
            id="filter-move-in"
            type="date"
            value={values.moveIn}
            onChange={(e) => setField("moveIn", e.target.value)}
          />
        </label>
        <label htmlFor="filter-move-out">
          Move out
          <input
            id="filter-move-out"
            type="date"
            value={values.moveOut}
            onChange={(e) => setField("moveOut", e.target.value)}
          />
        </label>
      </fieldset>

      <label className="filters-check">
        <input
          type="checkbox"
          checked={values.furnished}
          onChange={(e) => setField("furnished", e.target.checked)}
        />
        Furnished only
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

SubletFilters.propTypes = {
  initialValues: PropTypes.shape({
    neighborhoods: PropTypes.arrayOf(PropTypes.string).isRequired,
    minRent: PropTypes.string.isRequired,
    maxRent: PropTypes.string.isRequired,
    moveIn: PropTypes.string.isRequired,
    moveOut: PropTypes.string.isRequired,
    furnished: PropTypes.bool.isRequired,
    sort: PropTypes.string.isRequired,
  }).isRequired,
  onApply: PropTypes.func.isRequired,
};

export default SubletFilters;
