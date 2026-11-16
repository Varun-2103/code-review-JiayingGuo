import { Link } from "react-router-dom";
import { formatDate, formatRent } from "../../utils/format.js";
import {
  PETS_LABELS,
  SLEEP_LABELS,
  initials,
  roommateShape,
  smokingLabel,
} from "../../utils/roommateLabels.js";
import "./RoommateCard.css";

// One roommate profile in the search grid. The whole card opens the profile.
function RoommateCard({ roommate }) {
  return (
    <article className="roommate-card">
      <header className="roommate-card-head">
        <span className="roommate-avatar" aria-hidden="true">
          {initials(roommate.authorName)}
        </span>
        <div>
          <h2 className="roommate-card-name">
            <Link to={`/roommates/${roommate._id}`}>{roommate.authorName}</Link>
          </h2>
          <p className="roommate-card-move-in">
            Moving in {formatDate(roommate.moveInDate)}
          </p>
        </div>
      </header>

      <p className="roommate-card-budget">
        <strong>{formatRent(roommate.budget)}</strong> / month budget
      </p>
      <p className="roommate-card-areas">{roommate.neighborhoods.join(", ")}</p>

      <ul className="roommate-card-tags" aria-label="Lifestyle">
        <li>{SLEEP_LABELS[roommate.sleepSchedule]}</li>
        <li>{PETS_LABELS[roommate.pets]}</li>
        <li>{smokingLabel(roommate.smoking)}</li>
      </ul>

      <p className="roommate-card-bio">{roommate.bio}</p>
    </article>
  );
}

RoommateCard.propTypes = {
  roommate: roommateShape.isRequired,
};

export default RoommateCard;
