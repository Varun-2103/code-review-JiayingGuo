import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { NEIGHBORHOODS } from "../../constants/neighborhoods.js";
import "./SubletForm.css";

const EMPTY_VALUES = {
  title: "",
  neighborhood: "",
  rent: "",
  startDate: "",
  endDate: "",
  furnished: false,
  commuteMinutes: "",
  photoUrl: "",
  description: "",
};

const DESCRIPTION_MAX = 1000;
// A web link, or one of the sample room pictures in public/rooms.
const PHOTO_PATTERN = /^(https?:\/\/\S+|\/rooms\/room-\d{1,2}\.svg)$/i;

// Same rules as the server, so most mistakes are shown before sending.
function checkValues(v) {
  const rent = Number(v.rent);
  const commute = Number(v.commuteMinutes);
  if (!v.title.trim()) return "Please add a title.";
  if (v.title.trim().length > 100)
    return "Title must be at most 100 characters.";
  if (!v.neighborhood) return "Please choose a neighborhood.";
  if (v.rent === "" || !Number.isInteger(rent) || rent < 1 || rent > 10000) {
    return "Rent must be a whole number from 1 to 10000.";
  }
  if (!v.startDate || !v.endDate)
    return "Please choose the start and end dates.";
  if (v.endDate <= v.startDate) return "End date must be after the start date.";
  if (
    v.commuteMinutes === "" ||
    !Number.isInteger(commute) ||
    commute < 0 ||
    commute > 180
  ) {
    return "Commute time must be a whole number of minutes from 0 to 180.";
  }
  if (v.photoUrl.trim() && !PHOTO_PATTERN.test(v.photoUrl.trim())) {
    return "Photo link must start with http:// or https://.";
  }
  if (!v.description.trim()) return "Please add a description.";
  if (v.description.trim().length > DESCRIPTION_MAX) {
    return `Description must be at most ${DESCRIPTION_MAX} characters.`;
  }
  return "";
}

// Create and edit form for a listing. onSubmit gets clean values (numbers
// as numbers) and returns a promise; if it fails, its message is shown.
function SubletForm({ initialValues, onSubmit, submitLabel }) {
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
        title: values.title.trim(),
        neighborhood: values.neighborhood,
        rent: Number(values.rent),
        startDate: values.startDate,
        endDate: values.endDate,
        furnished: values.furnished,
        commuteMinutes: Number(values.commuteMinutes),
        photoUrl: values.photoUrl.trim(),
        description: values.description.trim(),
      });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <form className="sublet-form" onSubmit={handleSubmit} noValidate>
      {error && (
        <p className="error-message" role="alert" ref={errorRef}>
          {error}
        </p>
      )}

      <label htmlFor="sublet-title" className="sublet-form-wide">
        Title
        <span className="hint">For example: Sunny room in Fenway, Jan–Jun</span>
        <input
          id="sublet-title"
          name="title"
          type="text"
          maxLength={100}
          required
          value={values.title}
          onChange={handleChange}
        />
      </label>

      <label htmlFor="sublet-neighborhood">
        Neighborhood
        <select
          id="sublet-neighborhood"
          name="neighborhood"
          required
          value={values.neighborhood}
          onChange={handleChange}
        >
          <option value="">Choose one</option>
          {NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="sublet-rent">
        Monthly rent ($)
        <input
          id="sublet-rent"
          name="rent"
          type="number"
          min="1"
          max="10000"
          step="1"
          inputMode="numeric"
          required
          value={values.rent}
          onChange={handleChange}
        />
      </label>

      <label htmlFor="sublet-start">
        Start date
        <input
          id="sublet-start"
          name="startDate"
          type="date"
          required
          value={values.startDate}
          onChange={handleChange}
        />
      </label>

      <label htmlFor="sublet-end">
        End date
        <input
          id="sublet-end"
          name="endDate"
          type="date"
          required
          min={values.startDate || undefined}
          value={values.endDate}
          onChange={handleChange}
        />
      </label>

      <label htmlFor="sublet-commute">
        Commute to campus (minutes)
        <span className="hint">
          Time to the Northeastern Boston campus by walking or the T
        </span>
        <input
          id="sublet-commute"
          name="commuteMinutes"
          type="number"
          min="0"
          max="180"
          step="1"
          inputMode="numeric"
          required
          value={values.commuteMinutes}
          onChange={handleChange}
        />
      </label>

      <label className="sublet-form-check">
        <input
          name="furnished"
          type="checkbox"
          checked={values.furnished}
          onChange={handleChange}
        />
        The room is furnished
      </label>

      <label htmlFor="sublet-photo" className="sublet-form-wide">
        Photo link (optional)
        <span className="hint">
          A link to a photo of the room, starting with https://
        </span>
        <input
          id="sublet-photo"
          name="photoUrl"
          type="url"
          maxLength={500}
          placeholder="https://"
          value={values.photoUrl}
          onChange={handleChange}
        />
      </label>

      <label htmlFor="sublet-description" className="sublet-form-wide">
        Description
        <span className="hint">
          The apartment, roommates, utilities and anything else people should
          know.
        </span>
        <textarea
          id="sublet-description"
          name="description"
          rows={6}
          maxLength={DESCRIPTION_MAX}
          required
          value={values.description}
          onChange={handleChange}
        />
        <span className="hint sublet-form-count">
          {values.description.length} / {DESCRIPTION_MAX}
        </span>
      </label>

      <div className="sublet-form-wide">
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

SubletForm.propTypes = {
  initialValues: PropTypes.shape({
    title: PropTypes.string,
    neighborhood: PropTypes.string,
    rent: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    furnished: PropTypes.bool,
    commuteMinutes: PropTypes.string,
    photoUrl: PropTypes.string,
    description: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
};

export default SubletForm;
