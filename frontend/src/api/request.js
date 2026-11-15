// Small wrapper around fetch for our JSON API.
// - Returns null for an empty response body.
// - Does not crash when the response is not JSON (for example plain text).
// - Throws an Error with a `status` field so pages can tell 404 from 403.
export async function request(path, options = {}) {
  const { body, headers, ...rest } = options;
  const res = await fetch(path, {
    ...rest,
    headers: {
      ...(body !== undefined && { "Content-Type": "application/json" }),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    // statusText is empty over HTTP/2, so keep a final fallback message.
    const err = new Error(data?.error || res.statusText || "Request failed");
    err.status = res.status;
    throw err;
  }
  return data;
}
