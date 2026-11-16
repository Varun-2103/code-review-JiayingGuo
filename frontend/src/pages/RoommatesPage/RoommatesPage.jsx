import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { searchRoommates } from "../../api/roommatesApi.js";
import RoommateFilters from "../../components/RoommateFilters/RoommateFilters.jsx";
import RoommateCard from "../../components/RoommateCard/RoommateCard.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import {
  paramsFromRoommateFilters,
  roommateFiltersFromParams,
} from "../../utils/roommateFilters.js";
import "./RoommatesPage.css";

// Find a roommate (story 6). The search lives in the URL, like the sublet
// search, so refresh and the back button keep it.
function RoommatesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const key = searchParams.toString();
  // `key` says which search the result belongs to. While it differs from
  // the current URL, the new search is still loading.
  const [result, setResult] = useState({ key: null, data: null, error: null });

  useEffect(() => {
    let ignore = false;
    searchRoommates(key)
      .then((data) => {
        if (!ignore) setResult({ key, data, error: null });
      })
      .catch((error) => {
        if (!ignore) setResult({ key, data: null, error });
      });
    // A newer search replaces this one, so an old, slow answer is ignored.
    return () => {
      ignore = true;
    };
  }, [key]);

  const loading = result.key !== key;
  const data = result.data;

  function handleApply(filters) {
    setSearchParams(paramsFromRoommateFilters(filters));
  }

  function handlePageChange(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="roommates-page">
      <header className="roommates-header">
        <h1>Find a roommate</h1>
        {/* The profile form comes in a later feature. */}
        <Link to="/roommates/new" className="button button-secondary">
          Create my profile
        </Link>
      </header>

      <div className="roommates-layout">
        <aside className="roommates-sidebar">
          {/* Remounts when the URL changes (for example the back button),
              so the form always shows the current search. */}
          <RoommateFilters
            key={key}
            initialValues={roommateFiltersFromParams(searchParams)}
            onApply={handleApply}
          />
        </aside>

        <section
          className="roommates-results"
          aria-live="polite"
          aria-busy={loading}
        >
          {!loading && result.error && (
            <p className="error-message" role="alert">
              {result.error.message}
            </p>
          )}

          {loading && !data && <p className="roommates-count">Searching...</p>}

          {data && (
            <>
              <p className="roommates-count">
                {loading
                  ? "Searching..."
                  : `${data.total.toLocaleString("en-US")} ${
                      data.total === 1 ? "roommate" : "roommates"
                    } found`}
              </p>

              {data.items.length === 0 && !loading ? (
                <p className="status-message">
                  No roommates match your search. Try fewer filters.
                </p>
              ) : (
                <div
                  className={`roommates-grid ${loading ? "is-loading" : ""}`}
                >
                  {data.items.map((roommate) => (
                    <RoommateCard key={roommate._id} roommate={roommate} />
                  ))}
                </div>
              )}

              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}

RoommatesPage.propTypes = {};

export default RoommatesPage;
