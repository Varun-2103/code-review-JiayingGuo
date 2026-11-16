import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../context/useAuth.js";
import { deleteRoommate, getRoommate } from "../../api/roommatesApi.js";
import { formatDate, formatRent } from "../../utils/format.js";
import {
  PETS_LABELS,
  SLEEP_LABELS,
  initials,
  smokingLabel,
} from "../../utils/roommateLabels.js";
import "./RoommateDetailPage.css";

// Longer words for the facts list. The tags use the short labels.
const SLEEP_DETAILS = {
  early: "Early bird (goes to bed before 11 PM)",
  late: "Night owl (goes to bed after midnight)",
  flexible: "Flexible",
};

function RoommateDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  // Load again when the user logs in or out: the email depends on it.
  const key = `${id}:${user?._id ?? ""}`;

  useEffect(() => {
    let ignore = false;
    getRoommate(id)
      .then((data) => {
        if (!ignore) setResult({ key, data, error: null });
      })
      .catch((error) => {
        if (!ignore) setResult({ key, data: null, error });
      });
    return () => {
      ignore = true;
    };
  }, [id, key]);

  async function handleDelete() {
    if (!window.confirm("Delete your profile? This cannot be undone.")) return;
    setBusy(true);
    setActionError("");
    try {
      await deleteRoommate(result.data._id);
      navigate("/roommates");
    } catch (err) {
      setActionError(err.message);
      setBusy(false);
    }
  }

  if (result.key !== key) return <p className="status-message">Loading...</p>;

  if (result.error) {
    const notFound = result.error.status === 404;
    return (
      <section className="roommate-detail-error">
        <h1>{notFound ? "Profile not found" : "Something went wrong"}</h1>
        <p className="error-message">
          {notFound
            ? "This profile may have been deleted or hidden from search."
            : result.error.message}
        </p>
        <Link to="/roommates">Back to search</Link>
      </section>
    );
  }

  const profile = result.data;

  return (
    <article className="roommate-detail">
      <p className="roommate-detail-back">
        <Link to="/roommates">← Back to search</Link>
      </p>

      <div className="roommate-detail-layout">
        <div className="roommate-detail-info">
          <header className="roommate-detail-head">
            <span className="roommate-detail-avatar" aria-hidden="true">
              {initials(profile.authorName)}
            </span>
            <div>
              <h1>{profile.authorName}</h1>
              <p className="roommate-detail-budget">
                <strong>{formatRent(profile.budget)}</strong> / month budget
              </p>
            </div>
          </header>

          <ul className="roommate-detail-tags" aria-label="Lifestyle">
            <li>{SLEEP_LABELS[profile.sleepSchedule]}</li>
            <li>{PETS_LABELS[profile.pets]}</li>
            <li>{smokingLabel(profile.smoking)}</li>
          </ul>

          <dl className="roommate-detail-facts">
            <div>
              <dt>Preferred neighborhoods</dt>
              <dd>{profile.neighborhoods.join(", ")}</dd>
            </div>
            <div>
              <dt>Move-in date</dt>
              <dd>{formatDate(profile.moveInDate)}</dd>
            </div>
            <div>
              <dt>Sleep schedule</dt>
              <dd>{SLEEP_DETAILS[profile.sleepSchedule]}</dd>
            </div>
            <div>
              <dt>Pets</dt>
              <dd>{PETS_LABELS[profile.pets]}</dd>
            </div>
            <div>
              <dt>Smoking</dt>
              <dd>{smokingLabel(profile.smoking)}</dd>
            </div>
          </dl>
        </div>

        <aside className="roommate-detail-side">
          <section className="roommate-detail-box" aria-label="Contact">
            <h2>Contact</h2>
            <p>{profile.authorName}</p>
            {profile.authorEmail ? (
              <p>
                <a href={`mailto:${profile.authorEmail}`}>
                  {profile.authorEmail}
                </a>
              </p>
            ) : (
              <p>
                <Link to="/login" state={{ from: location }}>
                  Log in
                </Link>{" "}
                to see the contact email.
              </p>
            )}
          </section>

          {profile.isOwner && (
            <section className="roommate-detail-box" aria-label="Your profile">
              <h2>Your profile</h2>
              <p>
                {profile.hidden
                  ? "Hidden from search. Only you can open this page."
                  : "Shown in search. Other students can find you."}
              </p>
              {actionError && (
                <p className="error-message" role="alert">
                  {actionError}
                </p>
              )}
              <div className="roommate-detail-actions">
                <Link to={`/roommates/${profile._id}/edit`} className="button">
                  Edit
                </Link>
                <button
                  type="button"
                  className="button button-danger"
                  onClick={handleDelete}
                  disabled={busy}
                >
                  Delete
                </button>
              </div>
            </section>
          )}
        </aside>
      </div>

      <section className="roommate-detail-bio">
        <h2>About me</h2>
        <p>{profile.bio}</p>
      </section>
    </article>
  );
}

RoommateDetailPage.propTypes = {};

export default RoommateDetailPage;
