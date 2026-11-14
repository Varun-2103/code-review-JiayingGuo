import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SubletCard from "../../components/SubletCard/SubletCard.jsx";
import {
  deleteSublet,
  getMySublets,
  setSubletStatus,
} from "../../api/subletsApi.js";
import "./MyListingsPage.css";

function MyListingsPage() {
  const [result, setResult] = useState({
    loaded: false,
    items: [],
    error: null,
  });
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let ignore = false;
    getMySublets()
      .then((data) => {
        if (!ignore)
          setResult({ loaded: true, items: data.items, error: null });
      })
      .catch((error) => {
        if (!ignore) setResult({ loaded: true, items: [], error });
      });
    return () => {
      ignore = true;
    };
  }, []);

  function replaceItem(updated) {
    setResult((r) => ({
      ...r,
      items: r.items.map((s) => (s._id === updated._id ? updated : s)),
    }));
  }

  async function handleToggleStatus(sublet) {
    const next = sublet.status === "available" ? "rented" : "available";
    setBusyId(sublet._id);
    setActionError("");
    try {
      replaceItem(await setSubletStatus(sublet._id, next));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(sublet) {
    if (!window.confirm(`Delete "${sublet.title}"? This cannot be undone.`)) {
      return;
    }
    setBusyId(sublet._id);
    setActionError("");
    try {
      await deleteSublet(sublet._id);
      setResult((r) => ({
        ...r,
        items: r.items.filter((s) => s._id !== sublet._id),
      }));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const { loaded, items, error } = result;
  const rentedCount = items.filter((s) => s.status === "rented").length;

  return (
    <section>
      <header className="my-listings-header">
        <div>
          <h1>My Listings</h1>
          {loaded && !error && (
            <p className="status-message">
              {items.length} {items.length === 1 ? "listing" : "listings"},{" "}
              {rentedCount} rented. Rented listings are hidden from search.
            </p>
          )}
        </div>
        <Link to="/sublets/new" className="button">
          Post a sublet
        </Link>
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

      {loaded && !error && items.length === 0 && (
        <div className="my-listings-empty">
          <p>You have not posted any sublets yet.</p>
          <Link to="/sublets/new">Post your first sublet</Link>
        </div>
      )}

      <div className="my-listings-grid">
        {items.map((sublet) => (
          <SubletCard key={sublet._id} sublet={sublet}>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => handleToggleStatus(sublet)}
              disabled={busyId === sublet._id}
            >
              {sublet.status === "available"
                ? "Mark as rented"
                : "Mark as available"}
            </button>
            <Link
              to={`/sublets/${sublet._id}/edit`}
              className="button button-secondary"
            >
              Edit
            </Link>
            <button
              type="button"
              className="button button-danger"
              onClick={() => handleDelete(sublet)}
              disabled={busyId === sublet._id}
            >
              Delete
            </button>
          </SubletCard>
        ))}
      </div>
    </section>
  );
}

MyListingsPage.propTypes = {};

export default MyListingsPage;
