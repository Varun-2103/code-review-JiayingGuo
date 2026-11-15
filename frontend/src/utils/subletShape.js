import PropTypes from "prop-types";

// PropTypes shape for a listing as the API returns it.
export const subletShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  neighborhood: PropTypes.string.isRequired,
  rent: PropTypes.number.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  furnished: PropTypes.bool.isRequired,
  commuteMinutes: PropTypes.number.isRequired,
  photoUrl: PropTypes.string,
  status: PropTypes.oneOf(["available", "rented"]).isRequired,
});
