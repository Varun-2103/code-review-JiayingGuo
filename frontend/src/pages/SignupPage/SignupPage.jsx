import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import AuthCard from "../../components/AuthCard/AuthCard.jsx";
import useAuth from "../../context/useAuth.js";

function SignupPage() {
  const { user, signup } = useAuth();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  if (user) return <Navigate to={from} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await signup(name, email, password);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <AuthCard
      title="Create an account"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" state={location.state}>
            Log in
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
        <label htmlFor="signup-name">
          Name
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            required
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label htmlFor="signup-email">
          Email
          <span className="hint">
            Other students see this email when you post.
          </span>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label htmlFor="signup-password">
          Password
          <span className="hint">At least 8 characters.</span>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={100}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="button" disabled={submitting}>
          {submitting ? "Creating account..." : "Sign up"}
        </button>
      </form>
    </AuthCard>
  );
}

SignupPage.propTypes = {};

export default SignupPage;
