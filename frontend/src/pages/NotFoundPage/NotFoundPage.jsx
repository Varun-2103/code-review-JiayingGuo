import { Link } from "react-router-dom";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <section className="not-found-page">
      <p className="not-found-code">404</p>
      <h1>Page not found</h1>
      <p>We could not find the page you were looking for.</p>
      <p className="not-found-actions">
        <Link to="/sublets" className="button">
          Find a sublet
        </Link>{" "}
        <Link to="/" className="button button-secondary">
          Go to the home page
        </Link>
      </p>
    </section>
  );
}

NotFoundPage.propTypes = {};

export default NotFoundPage;
