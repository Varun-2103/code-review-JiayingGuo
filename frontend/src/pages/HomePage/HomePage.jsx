import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth.js";
import "./HomePage.css";

function HomePage() {
  const { user } = useAuth();

  return (
    <section className="home-hero">
      <h1>Sublets and roommates for Northeastern students</h1>
      <p>
        Going on co-op? Find someone to take your room. New to Boston? Find a
        short-term place near campus.
      </p>
      {!user && (
        <p className="home-actions">
          <Link to="/signup" className="home-primary">
            Create an account
          </Link>
          <Link to="/login">Log in</Link>
        </p>
      )}
    </section>
  );
}

HomePage.propTypes = {};

export default HomePage;
