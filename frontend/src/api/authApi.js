import { request } from "./request.js";

export function getMe() {
  return request("/api/auth/me");
}

export function login(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function signup(name, email, password) {
  return request("/api/auth/signup", {
    method: "POST",
    body: { name, email, password },
  });
}

export function logout() {
  return request("/api/auth/logout", { method: "POST" });
}
