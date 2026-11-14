import PropTypes from "prop-types";
import "./Pagination.css";

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pages">
      <button
        type="button"
        className="button button-secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>
      <span aria-current="page">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="button button-secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </nav>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
