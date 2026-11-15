import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import AuthCard from "../../components/AuthCard/AuthCard.jsx";
import useAuth from "../../context/useAuth.js";

function LoginPage() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Go back to the page that sent the user here, or to the home page.
  const from = location.state?.from?.pathname || "/";

  // Once logged in (or if already logged in) leave this page.
  if (user) return <Navigate to={from} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Log in"
      footer={
        <>
          New to SubletBoard?{" "}
          <Link to="/signup" state={location.state}>
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
        <label htmlFor="login-email">
          Email
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="login-password">
          Password
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
}

LoginPage.propTypes = {};

export default LoginPage;
