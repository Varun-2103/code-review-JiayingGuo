import { Link } from "react-router-dom";
import useAuth from "../../context/useAuth.js";
import "./HomePage.css";

function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <section className="home-hero">
        <h1>Sublets and roommates for Northeastern students</h1>
        <p>
          Going on co-op? Find someone to take your room. New to Boston? Find a
          short-term place near campus.
        </p>
        <p className="home-actions">
          <Link to="/sublets" className="home-primary">
            Find a sublet
          </Link>
          <Link to="/sublets/new">Post a sublet</Link>
          {!user && <Link to="/signup">Create an account</Link>}
        </p>
      </section>

      <section className="home-guide" aria-labelledby="how-to-use">
        <h2 id="how-to-use">How to use SubletBoard</h2>
        <div className="home-guide-columns">
          <div>
            <h3>Looking for a room</h3>
            <ol>
              <li>
                Open <Link to="/sublets">Find a sublet</Link>.
              </li>
              <li>
                Filter by neighborhood, monthly rent, your move-in and move-out
                dates, and furnished. Sort by newest or by price.
              </li>
              <li>Click a listing to see the details.</li>
              <li>
                <Link to="/login">Log in</Link> to see the poster&apos;s email,
                then write to them.
              </li>
            </ol>
          </div>
          <div>
            <h3>Leaving Boston for a while</h3>
            <ol>
              <li>
                <Link to="/signup">Create an account</Link> with the email you
                want students to contact.
              </li>
              <li>
                Click <Link to="/sublets/new">Post a sublet</Link> and fill in
                the rent, dates, commute time, a photo link and a description.
              </li>
              <li>
                Edit or delete your listings on{" "}
                <Link to="/my-listings">My Listings</Link>.
              </li>
              <li>
                When someone takes the room, click{" "}
                <strong>Mark as rented</strong>. The listing is hidden from
                search and your email is no longer shown.
              </li>
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}

HomePage.propTypes = {};

export default HomePage;
