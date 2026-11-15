import "./SubletCardSkeleton.css";

// A grey placeholder shaped like a SubletCard, shown while results load.
function SubletCardSkeleton() {
  return (
    <div className="sublet-skeleton" aria-hidden="true">
      <div className="sublet-skeleton-block sublet-skeleton-photo" />
      <div className="sublet-skeleton-block sublet-skeleton-price" />
      <div className="sublet-skeleton-block sublet-skeleton-title" />
      <div className="sublet-skeleton-block sublet-skeleton-line" />
    </div>
  );
}

SubletCardSkeleton.propTypes = {};

export default SubletCardSkeleton;
