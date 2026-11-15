import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import SubletPhoto from "../SubletPhoto/SubletPhoto.jsx";
import StatusBadge from "../StatusBadge/StatusBadge.jsx";
import { formatDateRange, formatRent } from "../../utils/format.js";
import { subletShape } from "../../utils/subletShape.js";
import "./SubletCard.css";

// One listing in a grid. `children` adds buttons under the card
// (used on the My listings page).
function SubletCard({ sublet, children }) {
  return (
    <article className="sublet-card">
      <SubletPhoto src={sublet.photoUrl} alt={`Photo of ${sublet.title}`} />
      <div className="sublet-card-body">
        <p className="sublet-card-rent">
          <strong>{formatRent(sublet.rent)}</strong> / month
        </p>
        <h2 className="sublet-card-title">
          <Link to={`/sublets/${sublet._id}`}>{sublet.title}</Link>
        </h2>
        <ul className="sublet-card-facts">
          <li>{sublet.neighborhood}</li>
          <li>{formatDateRange(sublet.startDate, sublet.endDate)}</li>
          <li>{sublet.commuteMinutes} min to campus</li>
        </ul>
        <p className="sublet-card-tags">
          <StatusBadge status={sublet.status} />
          {sublet.furnished && (
            <span className="sublet-card-tag">Furnished</span>
          )}
        </p>
        {children && <div className="sublet-card-actions">{children}</div>}
      </div>
    </article>
  );
}

SubletCard.propTypes = {
  sublet: subletShape.isRequired,
  children: PropTypes.node,
};

export default SubletCard;
