# Proof Puzzle

Write move scripts to turn the board into the target. 23 levels in five phases (basics, combinations, macros, advanced, property targets). Levels live in `frontend/src/data/levels.ts`, shared by the UI and the backend.

## Run

```bash
cd backend && npm install && npm run dev      # http://localhost:3000
cd frontend && npm install && npm run dev     # http://localhost:5173 (proxies /api)
```

## DSL

```
swap(x1, y1, x2, y2)
paint(x, y, color)        -- blue green red yellow purple
rotate(x, y)
def name(a, b, ...) := cmd; cmd   -- helper macro
```

## Engines

- **Mock (default):** `backend/engine.ts` parses, expands macros and simulates moves. Used when `lake` is not on PATH, or `USE_LEAN=0`.
- **Lean 4:** if `lake` is found, the backend writes a generated `Proof.lean` (importing `lean-project/Puzzle.lean`) and runs `lake env lean --run`. Run `lake build` in `lean-project/` first. This path is **untested** (Lean was not installed when this was built).

## Rules

- `parLimit` = max lines of code (blank lines and `--` comments are free). Going over gives "Proof too long. Use a helper macro."
- One command per line. A macro is one `def` line: up to 4 swap/paint/rotate commands, no number literals in the body (pass coordinates as parameters), no calls to other macros.
- `rotate` only works on arrow blocks (`rot` set); it turns them 90 degrees clockwise.

## Checking the levels

```bash
cd backend && npm run verify   # reference solution for each level fits par; macro levels are impossible without a helper
```

## Scoring, leaderboards, multiplayer

Routes: `/` login, then `/game`, `/builder`, `/leaderboard` (all but `/` need a signed-in player). Each page is its own route, so the Game is unmounted, not hidden, on the builder and leaderboard; leaving it pauses the level clock, and the code and solved levels are kept. A level is locked until "Start Level" is clicked, and the score is only shown after the level is solved.

Login is username-only: entering an existing name signs that player back in, a new name registers it (`POST /api/login`). There are no passwords, so anyone who knows a name can sign in as that player. The token lives in localStorage.

Data is in SQLite (`node:sqlite`, file `backend/data/proof-puzzle.db`, override with `DB_PATH`).

`points = completion 500 + optimality + speed - hints`, in `frontend/src/data/scoring.ts` (shared by the server and the UI):

- optimality = `1000 * min(1, optimalLines / your lines)`: full marks when your proof is as short as the shortest valid one
- speed = `500 * (1 - time / 5 min)`; the clock is kept server-side, from "Start Level" to a successful proof, excluding time paused away from the Game
- each hint costs 150 points and 30 seconds

`optimalLines` (in `levels.ts`, and in the `levels` table) is the length of the shortest valid proof, helper macros included; `parLimit` is only the hard cap. `npm run verify` checks each one: a reference solution of exactly that length is executed, and a lower bound `min(C, 1 + ceil(C / 4))` (C = fewest single-block commands, found by BFS; a helper holds at most 4 commands) must match, so the optimum is proven rather than assumed. `search-macros.ts` is the exhaustive search used to find the paint-level macros. For user-made levels the creator supplies "optimal lines".

| Endpoint | Purpose |
| --- | --- |
| `POST /api/login`, `GET /api/me`, `POST /api/friends` | sign in / register, current player, friends (Bearer token) |
| `GET /api/leaderboard/global`, `/friends` (`?level=`) | ranked totals; friends = you + people you added |
| `POST /api/sessions/start`, `/pause` | start/resume and pause the server clock for a level (needed for hints and scores) |
| `POST /api/evaluate` | run a proof, score it when signed in |
| `POST /api/preview` | what would one line change? (ghost overlay) |
| `POST /api/hint` | next move from the heuristic solver (costs points/time) |
| `POST /api/custom-levels` | save a user level, returns a Base64url share link |

Property targets (levels 21-23, and the builder's "satisfy a theorem") are checked by Lean's `isValid` when Lean is installed, otherwise by the same predicate in TypeScript.

## Not what it might sound like

- The editor is Monaco, but there is **no Lean language server**: hover previews and hints come from the Node backend. Hints use a breadth-first proof search over single-block moves (not `aesop`).
- The Lean engine path (including `isValid`) has never been run: Lean is not installed on the dev machine.

## Battles, Daily Theorem, sound

- **`/battle`**: Socket.IO matchmaking queue. Two queued players get the same random puzzle (levels 5-23) and a 3 s countdown. Every "Run Proof" is compiled by the server, which sends the opponent only the resulting board (shown as a small read-only grid), never the code. First correct proof wins; leaving the page forfeits. The queue and battles live in server memory (one server process, nothing is persisted). `backend/battle-bot.ts` is a test opponent: `npx tsx battle-bot.ts erin partial|solve|idle`.
- **`/daily`**: one level per UTC day (seeded from the date with date-fns, same for everyone, levels 6-23). The best result per day is kept in `localStorage` (`pp_daily`). "Share" copies the result as emoji rows with `navigator.clipboard.writeText`; if the browser refuses, the text is shown to copy by hand.
- **Sound** (`src/soundUtils.ts`, Web Audio, no samples): `swap` is a low A-major chord, `rotate` a short tick, `paint` a chime whose pitch depends on the color (C D E G A pentatonic). It plays as the step index moves: automatic playback after a run, "Replay with sound", and the timeline slider. 🔊/🔇 toggles it (remembered).

## Look and feel

Neo-brutalism "math hacker": graph-paper background, stark ink, 2-5 px black borders, hard offset shadows (no blur, no radii) and neon yellow / magenta / cyan accents. Space Grotesk for the UI and the leaderboard, Fira Code for code, timers and coordinates (both bundled with `@fontsource-variable`, no CDN). The design system lives in `index.css` (`.panel` / `.panel-heavy` / `.panel-light`, `.btn-*`, `.tile`): every button is a "key" that lifts on hover and, when pressed, loses its shadow and sinks 4 px down and right. Board tiles are thick bevelled blocks that lift on hover. Panels deliberately differ in border weight and sit slightly off-grid and off-axis. The board (`BoardView.tsx`) still uses Framer Motion: blocks keep an identity through swaps and glide with a spring, `rotate` animates the arrow, `paint` pulses the block, and a block that caused an illegal move shakes and flashes a magenta border (errors that name no block shake the board). A perfect, optimal-length solve fires `canvas-confetti`. The editor is `@monaco-editor/react` (local Monaco bundle) with a stark black `proof-brutal` theme. Motion is reduced for players who ask their OS for it.

## How to Play

`HowToPlay.tsx`: a five-step guide (goal, the three commands with before/after boards, helpers, timer and score, tools and modes) with Back / Next and a final "Play!" that goes to the game. It opens by itself every time a player signs in, and the "? How to Play" button in the top bar reopens it from any page. Esc, ✕ and the arrow keys work too.

## Deployment

**Backend** (`backend/`): `npm run build` compiles to `dist/` and `npm start` runs `node dist/index.js`. The server imports the shared level data from `frontend/src/data`, so `tsc` keeps the repository layout (`dist/backend/index.js`) and the build writes a one-line `dist/index.js` that loads it. Settings are environment variables (see `backend/.env.example`): `PORT` (default 3000), `FRONTEND_URL` (the allowed browser origin(s) for the REST API and Socket.IO; unset allows every origin), `PUBLIC_URL` (base of shared level links, defaults to `FRONTEND_URL`), `DB_PATH` (SQLite file), `USE_LEAN=0`. `GET /api/health` is the liveness probe.

```bash
# from proof-puzzle/ (the image needs frontend/src/data, so the repository root is the build context)
docker build -f backend/Dockerfile -t proof-puzzle-backend .
docker run -p 3000:3000 -e FRONTEND_URL=https://your-app.vercel.app -v proof-puzzle-data:/data proof-puzzle-backend
```

The image uses `node:24-alpine` and the built-in mock engine. Keep `/data` on a volume, or scores and accounts vanish with the container. Run a single instance: battles and the matchmaking queue live in memory.

**Frontend** (`frontend/`): set `VITE_API_URL` to the backend's public URL (`.env.production`, or the Vercel dashboard, which takes precedence) and deploy with `npm run build`. `vercel.json` rewrites every path to `index.html` so React Router routes like `/game` survive a refresh. Without `VITE_API_URL` (local development) requests stay on the page's origin and Vite proxies `/api` and `/socket.io` to `localhost:3000` (`VITE_DEV_API` overrides).

**Database**: SQLite through `node:sqlite`, not Prisma. `db.ts` creates and migrates the tables when the server starts, so no migration command runs on deploy.

### Deploy checklist

1. **Backend**: on Render, choose New > Blueprint and pick this repository: `render.yaml` sets up the Docker build (repository root as context), one instance, a 1 GB disk at `/data` and the health check, and asks for `FRONTEND_URL` (enter the Vercel URL from step 2, or a placeholder and fix it later). The disk needs a paid plan; on a free instance accounts and scores vanish on every restart. Other Docker hosts: `docker build -f backend/Dockerfile .` with a persistent volume at `/data` and a single instance. Note the public URL, e.g. `https://proof-puzzle-api.onrender.com`.
2. **Frontend**: import this repository into Vercel, set **Root Directory** to `frontend`, add the environment variable `VITE_API_URL` = the backend URL from step 1, and deploy. Note the site URL, e.g. `https://proof-puzzle.vercel.app`.
3. **Connect them**: set `FRONTEND_URL` on the backend to the Vercel URL from step 2 and redeploy the backend (without it, browsers are not blocked, but production should list its origin).
4. **Smoke test**: open the Vercel site, sign in with an alias, solve Level 1, open `/leaderboard`, refresh on `/game` (the Vercel rewrite should keep it working), and start a battle from two browsers.
