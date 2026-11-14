import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { searchSublets } from "../../api/subletsApi.js";
import SubletFilters from "../../components/SubletFilters/SubletFilters.jsx";
import SubletCard from "../../components/SubletCard/SubletCard.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import {
  filtersFromParams,
  paramsFromFilters,
} from "../../utils/subletFilters.js";
import "./SubletsPage.css";

function SubletsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const key = searchParams.toString();
  // `key` says which search the result belongs to. While it differs from
  // the current URL, the new search is still loading.
  const [result, setResult] = useState({ key: null, data: null, error: null });

  useEffect(() => {
    let ignore = false;
    searchSublets(key)
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
    setSearchParams(paramsFromFilters(filters));
  }

  function handlePageChange(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0 });
  }

  return (
    <div className="sublets-page">
      <header className="sublets-header">
        <h1>Find a sublet</h1>
        <Link to="/sublets/new" className="button">
          Post a sublet
        </Link>
      </header>

      <div className="sublets-layout">
        <aside className="sublets-sidebar">
          {/* Remounts when the URL changes (for example the back button),
              so the form always shows the current search. */}
          <SubletFilters
            key={key}
            initialValues={filtersFromParams(searchParams)}
            onApply={handleApply}
          />
        </aside>

        <section
          className="sublets-results"
          aria-live="polite"
          aria-busy={loading}
        >
          {!loading && result.error && (
            <p className="error-message" role="alert">
              {result.error.message}
            </p>
          )}

          {loading && !data && <p className="status-message">Loading...</p>}

          {data && (
            <>
              <p className="sublets-count">
                {loading
                  ? "Searching..."
                  : `${data.total.toLocaleString("en-US")} ${
                      data.total === 1 ? "sublet" : "sublets"
                    } found`}
              </p>

              {data.items.length === 0 && !loading ? (
                <p className="status-message">
                  No sublets match your search. Try fewer filters or other
                  dates.
                </p>
              ) : (
                <div className={`sublets-grid ${loading ? "is-loading" : ""}`}>
                  {data.items.map((sublet) => (
                    <SubletCard key={sublet._id} sublet={sublet} />
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

SubletsPage.propTypes = {};

export default SubletsPage;
