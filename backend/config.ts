// Deployment settings read from the environment (see .env.example).

const clean = (s: string) => s.trim().replace(/\/+$/, "");

/** Browser origins allowed to call the API: FRONTEND_URL, optionally several separated by commas. */
export const frontendOrigins: string[] = (process.env.FRONTEND_URL ?? "").split(",").map(clean).filter(Boolean);

/**
 * Value for the `origin` option of cors and Socket.IO. With FRONTEND_URL set, only those origins are accepted;
 * without it (local development, where Vite proxies the API) every origin is.
 */
export const corsOrigin: string[] | true = frontendOrigins.length ? frontendOrigins : true;

/** The public address of the web app, used in shareable level links. */
export const publicBaseUrl = (requestOrigin?: string) =>
  process.env.PUBLIC_URL ? clean(process.env.PUBLIC_URL) : (frontendOrigins[0] ?? requestOrigin ?? "http://localhost:5173");
