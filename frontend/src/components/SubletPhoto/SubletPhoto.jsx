import { useState } from "react";
import PropTypes from "prop-types";
import "./SubletPhoto.css";

const PLACEHOLDER = "/placeholder-room.svg";

// Shows the listing photo, or a placeholder if there is no link or the
// link is broken.
function SubletPhoto({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = !src || failed;

  return (
    <img
      className={`sublet-photo ${className}`.trim()}
      src={showPlaceholder ? PLACEHOLDER : src}
      alt={showPlaceholder ? "No photo available" : alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

SubletPhoto.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default SubletPhoto;
