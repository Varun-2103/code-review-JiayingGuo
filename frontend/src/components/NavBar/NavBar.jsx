import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../context/useAuth.js";
import "./NavBar.css";

function NavBar() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  // Leave the current page first. Otherwise a protected page would see the
  // user disappear and send them to the login page instead of home.
  async function handleLogout() {
    setLoggingOut(true);
    navigate("/");
    try {
      await logout();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <img src="/favicon.svg" alt="" width="28" height="28" />
          SubletBoard
        </Link>

        <nav className="navbar-links" aria-label="Main">
          {user && <NavLink to="/my-listings">My Listings</NavLink>}
        </nav>

        <div className="navbar-account">
          {loading ? null : user ? (
            <>
              <span className="navbar-user">Hi, {user.name}</span>
              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/signup" className="navbar-signup">
                Sign up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

NavBar.propTypes = {};

export default NavBar;
