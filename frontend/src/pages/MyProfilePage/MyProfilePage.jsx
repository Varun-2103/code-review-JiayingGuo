import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import RoommateCard from "../../components/RoommateCard/RoommateCard.jsx";
import {
  deleteRoommate,
  getMyRoommate,
  setRoommateHidden,
} from "../../api/roommatesApi.js";
import "./MyProfilePage.css";

// The logged-in student's own roommate profile. Each student has at most
// one, so this shows one card, or a link to create it.
function MyProfilePage() {
  const [result, setResult] = useState({
    loaded: false,
    profile: null,
    error: null,
  });
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let ignore = false;
    getMyRoommate()
      .then((profile) => {
        if (!ignore) setResult({ loaded: true, profile, error: null });
      })
      .catch((error) => {
        if (!ignore) setResult({ loaded: true, profile: null, error });
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function handleToggleHidden() {
    const { profile } = result;
    setBusy(true);
    setActionError("");
    try {
      const updated = await setRoommateHidden(profile._id, !profile.hidden);
      setResult((r) => ({ ...r, profile: updated }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete your profile? This cannot be undone.")) return;
    setBusy(true);
    setActionError("");
    try {
      await deleteRoommate(result.profile._id);
      setResult((r) => ({ ...r, profile: null }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const { loaded, profile, error } = result;

  return (
    <section className="my-profile-page">
      <header className="my-profile-header">
        <h1>My profile</h1>
        <p className="status-message">
          Hidden profiles do not show up in search, and nobody else can open
          them.
        </p>
      </header>

      {!loaded && <p className="status-message">Loading...</p>}
      {error && (
        <p className="error-message" role="alert">
          {error.message}
        </p>
      )}
      {actionError && (
        <p className="error-message" role="alert">
          {actionError}
        </p>
      )}

      {loaded && !error && !profile && (
        <div className="my-profile-empty">
          <h2>You do not have a roommate profile yet</h2>
          <p>
            Tell other students your budget and how you live, so the right
            roommate can find you.
          </p>
          <Link to="/roommates/new" className="button">
            Create my profile
          </Link>
        </div>
      )}

      {profile && (
        <div className="my-profile-card">
          <p className="my-profile-status">
            <span
              className={`status-badge ${
                profile.hidden
                  ? "status-badge-rented"
                  : "status-badge-available"
              }`}
            >
              {profile.hidden ? "Hidden from search" : "Shown in search"}
            </span>
          </p>
          <RoommateCard roommate={profile}>
            <button
              type="button"
              className="button"
              onClick={handleToggleHidden}
              disabled={busy}
            >
              {profile.hidden ? "Show in search" : "Hide from search"}
            </button>
            <Link
              to={`/roommates/${profile._id}`}
              className="button button-secondary"
            >
              View
            </Link>
            <Link
              to={`/roommates/${profile._id}/edit`}
              className="button button-secondary"
            >
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
          </RoommateCard>
        </div>
      )}
    </section>
  );
}

MyProfilePage.propTypes = {};

export default MyProfilePage;
