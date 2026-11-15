import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import SubletPhoto from "../../components/SubletPhoto/SubletPhoto.jsx";
import StatusBadge from "../../components/StatusBadge/StatusBadge.jsx";
import useAuth from "../../context/useAuth.js";
import {
  deleteSublet,
  getSublet,
  setSubletStatus,
} from "../../api/subletsApi.js";
import { formatDateRange, formatRent } from "../../utils/format.js";
import "./SubletDetailPage.css";

function SubletDetailPage() {
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
    getSublet(id)
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

  async function handleToggleStatus() {
    const sublet = result.data;
    const next = sublet.status === "available" ? "rented" : "available";
    setBusy(true);
    setActionError("");
    try {
      const updated = await setSubletStatus(sublet._id, next);
      setResult((r) => ({ ...r, data: updated }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("Delete this listing? This cannot be undone.")) return;
    setBusy(true);
    setActionError("");
    try {
      await deleteSublet(result.data._id);
      navigate("/my-listings");
    } catch (err) {
      setActionError(err.message);
      setBusy(false);
    }
  }

  if (result.key !== key) return <p className="status-message">Loading...</p>;

  if (result.error) {
    const notFound = result.error.status === 404;
    return (
      <section className="sublet-detail-error">
        <h1>{notFound ? "Listing not found" : "Something went wrong"}</h1>
        <p className="error-message">
          {notFound
            ? "This listing may have been deleted."
            : result.error.message}
        </p>
        <Link to="/sublets">Back to search</Link>
      </section>
    );
  }

  const sublet = result.data;

  return (
    <article className="sublet-detail">
      <p className="sublet-detail-back">
        <Link to="/sublets">← Back to search</Link>
      </p>

      <div className="sublet-detail-layout">
        <SubletPhoto
          src={sublet.photoUrl}
          alt={`Photo of ${sublet.title}`}
          className="sublet-detail-photo"
        />

        <div className="sublet-detail-info">
          <p className="sublet-detail-status">
            <StatusBadge status={sublet.status} />
            {sublet.furnished && <span>Furnished</span>}
          </p>
          <h1>{sublet.title}</h1>
          <p className="sublet-detail-rent">
            <strong>{formatRent(sublet.rent)}</strong> / month
          </p>

          <dl className="sublet-detail-facts">
            <div>
              <dt>Neighborhood</dt>
              <dd>{sublet.neighborhood}</dd>
            </div>
            <div>
              <dt>Dates</dt>
              <dd>{formatDateRange(sublet.startDate, sublet.endDate)}</dd>
            </div>
            <div>
              <dt>Commute to campus</dt>
              <dd>{sublet.commuteMinutes} minutes</dd>
            </div>
            <div>
              <dt>Furnished</dt>
              <dd>{sublet.furnished ? "Yes" : "No"}</dd>
            </div>
          </dl>

          <section className="sublet-detail-contact" aria-label="Contact">
            <h2>Contact</h2>
            <p>Posted by {sublet.authorName}</p>
            {sublet.authorEmail ? (
              <p>
                <a href={`mailto:${sublet.authorEmail}`}>
                  {sublet.authorEmail}
                </a>
              </p>
            ) : sublet.status === "rented" ? (
              <p className="status-message">
                This room has already been rented.
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

          {sublet.isOwner && (
            <section
              className="sublet-detail-owner"
              aria-label="Manage listing"
            >
              <h2>Your listing</h2>
              {actionError && (
                <p className="error-message" role="alert">
                  {actionError}
                </p>
              )}
              <div className="sublet-detail-actions">
                <Link to={`/sublets/${sublet._id}/edit`} className="button">
                  Edit
                </Link>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={handleToggleStatus}
                  disabled={busy}
                >
                  {sublet.status === "available"
                    ? "Mark as rented"
                    : "Mark as available"}
                </button>
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
        </div>
      </div>

      <section className="sublet-detail-description">
        <h2>About this place</h2>
        <p>{sublet.description}</p>
      </section>
    </article>
  );
}

SubletDetailPage.propTypes = {};

export default SubletDetailPage;
