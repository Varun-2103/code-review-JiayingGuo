import PropTypes from "prop-types";
import "./AuthCard.css";

// Shared layout for the log in and sign up forms.
function AuthCard({ title, children, footer }) {
  return (
    <section className="auth-card" aria-labelledby="auth-card-title">
      <h1 id="auth-card-title">{title}</h1>
      {children}
      {footer && <p className="auth-card-footer">{footer}</p>}
    </section>
  );
}

AuthCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

export default AuthCard;
