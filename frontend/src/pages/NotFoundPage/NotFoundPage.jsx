import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section>
      <h1>Page not found</h1>
      <p>We could not find the page you were looking for.</p>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </section>
  );
}

NotFoundPage.propTypes = {};

export default NotFoundPage;
