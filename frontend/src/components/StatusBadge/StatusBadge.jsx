import PropTypes from "prop-types";
import "./StatusBadge.css";

const LABELS = { available: "Available", rented: "Rented" };

function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-badge-${status}`}>
      {LABELS[status]}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(["available", "rented"]).isRequired,
};

export default StatusBadge;
