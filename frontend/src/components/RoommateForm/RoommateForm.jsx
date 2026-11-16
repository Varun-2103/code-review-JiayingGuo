import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { NEIGHBORHOODS } from "../../constants/neighborhoods.js";
import "./RoommateForm.css";

const EMPTY_VALUES = {
  budget: "",
  moveInDate: "",
  neighborhoods: [],
  sleepSchedule: "",
  pets: "",
  smoking: false,
  bio: "",
};

const MAX_NEIGHBORHOODS = 3;
const BIO_MAX = 500;

// Same rules as the server, so most mistakes are shown before sending.
function checkValues(v) {
  const budget = Number(v.budget);
  if (
    v.budget === "" ||
    !Number.isInteger(budget) ||
    budget < 1 ||
    budget > 10000
  ) {
    return "Budget must be a whole number from 1 to 10000.";
  }
  if (!v.moveInDate) return "Please choose a move-in date.";
  if (v.neighborhoods.length < 1) {
    return "Please choose at least one neighborhood.";
  }
  if (v.neighborhoods.length > MAX_NEIGHBORHOODS) {
    return `Please choose at most ${MAX_NEIGHBORHOODS} neighborhoods.`;
  }
  if (!v.sleepSchedule) return "Please choose your sleep schedule.";
  if (!v.pets) return "Please choose an option for pets.";
  if (!v.bio.trim()) return "Please write a few words about yourself.";
  if (v.bio.trim().length > BIO_MAX) {
    return `About me must be at most ${BIO_MAX} characters.`;
  }
  return "";
}

// Create and edit form for a roommate profile. onSubmit gets clean values
// (budget as a number) and returns a promise; if it fails, its message is
// shown.
function RoommateForm({ initialValues, onSubmit, submitLabel, cancelTo }) {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const errorRef = useRef(null);

  // The message is at the top of a long form, so bring it into view.
  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ block: "center" });
  }, [error]);

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  };

  // Keeps the list order, so the saved list matches the order on screen.
  const handleNeighborhood = (event) => {
    const { value, checked } = event.target;
    setValues((v) => ({
      ...v,
      neighborhoods: NEIGHBORHOODS.filter((n) =>
        n === value ? checked : v.neighborhoods.includes(n),
      ),
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const message = checkValues(values);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit({
        budget: Number(values.budget),
        moveInDate: values.moveInDate,
        neighborhoods: values.neighborhoods,
        sleepSchedule: values.sleepSchedule,
        pets: values.pets,
        smoking: values.smoking,
        bio: values.bio.trim(),
      });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  const full = values.neighborhoods.length >= MAX_NEIGHBORHOODS;

  return (
    <form className="roommate-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <p className="error-message" role="alert" ref={errorRef}>
          {error}
        </p>
      )}

      <label htmlFor="roommate-budget">
        Monthly budget ($)
        <span className="hint">
          The most you can pay for your share of the rent.
        </span>
        <input
          id="roommate-budget"
          name="budget"
          type="number"
          min="1"
          max="10000"
          step="1"
          inputMode="numeric"
          required
          value={values.budget}
          onChange={handleChange}
        />
      </label>

      <label htmlFor="roommate-move-in">
        Move-in date
        <span className="hint">The day you want to move in.</span>
        <input
          id="roommate-move-in"
          name="moveInDate"
          type="date"
          required
          value={values.moveInDate}
          onChange={handleChange}
        />
      </label>

      <fieldset className="roommate-form-wide">
        <legend>
          Preferred neighborhoods
          <span className="hint">
            Choose up to {MAX_NEIGHBORHOODS}. ({values.neighborhoods.length}{" "}
            chosen)
          </span>
        </legend>
        <div className="roommate-form-hoods">
          {NEIGHBORHOODS.map((n) => {
            const checked = values.neighborhoods.includes(n);
            return (
              <label key={n} className="roommate-form-check">
                <input
                  type="checkbox"
                  value={n}
                  checked={checked}
                  disabled={full && !checked}
                  onChange={handleNeighborhood}
                />
                {n}
              </label>
            );
          })}
        </div>
      </fieldset>

      <label htmlFor="roommate-sleep">
        Sleep schedule
        <select
          id="roommate-sleep"
          name="sleepSchedule"
          required
          value={values.sleepSchedule}
          onChange={handleChange}
        >
          <option value="">Choose one</option>
          <option value="early">Early bird (bed before 11 PM)</option>
          <option value="late">Night owl (bed after midnight)</option>
          <option value="flexible">Flexible</option>
        </select>
      </label>

      <label htmlFor="roommate-pets">
        Pets
        <select
          id="roommate-pets"
          name="pets"
          required
          value={values.pets}
          onChange={handleChange}
        >
          <option value="">Choose one</option>
          <option value="has">I have a pet</option>
          <option value="ok">I am fine with pets</option>
          <option value="no">No pets please</option>
        </select>
      </label>

      <label className="roommate-form-check roommate-form-wide">
        <input
          name="smoking"
          type="checkbox"
          checked={values.smoking}
          onChange={handleChange}
        />
        I smoke
      </label>

      <label htmlFor="roommate-bio" className="roommate-form-wide">
        About me
        <span className="hint">
          Your program, habits, and what you want in a roommate.
        </span>
        <textarea
          id="roommate-bio"
          name="bio"
          rows={6}
          maxLength={BIO_MAX}
          required
          value={values.bio}
          onChange={handleChange}
        />
        <span className="hint roommate-form-count">
          {values.bio.length} / {BIO_MAX}
        </span>
      </label>

      <div className="roommate-form-wide roommate-form-actions">
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
        <Link to={cancelTo}>Cancel</Link>
      </div>
    </form>
  );
}

RoommateForm.propTypes = {
  initialValues: PropTypes.shape({
    budget: PropTypes.string,
    moveInDate: PropTypes.string,
    neighborhoods: PropTypes.arrayOf(PropTypes.string),
    sleepSchedule: PropTypes.string,
    pets: PropTypes.string,
    smoking: PropTypes.bool,
    bio: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
  cancelTo: PropTypes.string.isRequired,
};

export default RoommateForm;
