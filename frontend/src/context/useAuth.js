import { useContext } from "react";
import { AuthContext } from "./AuthContext.js";

// Returns { user, loading, login, signup, logout }.
// user is null when logged out. loading is true until /api/auth/me answers.
export default function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth must be used inside AuthProvider");
  return auth;
}
