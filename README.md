# Proof Puzzle

Write move scripts to turn the board into the target. 67 levels: 23 hand-designed ones in five phases (basics, combinations, macros, advanced, property targets) followed by 44 procedurally generated scrambles that grow from 3x3 to 5x5 and from 3-move to 11-move proofs. Levels live in `frontend/src/data/levels.ts`, shared by the UI and the backend.

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
cd backend && npm run verify   # every level has a reference proof within par; levels 1-23 are proven optimal
```

## Scoring, leaderboards, multiplayer

Routes: `/` login, then `/game`, `/builder`, `/leaderboard` (all but `/` need a signed-in player). Each page is its own route, so the Game is unmounted, not hidden, on the builder and leaderboard; leaving it pauses the level clock, and the code and solved levels are kept. A level is locked until "Start Level" is clicked, and the score is only shown after the level is solved.

Accounts use a **username and password**, with a Sign In / Sign Up toggle on the home screen. `POST /api/register` creates an account (409 if the username is taken) and `POST /api/login` signs in (it never creates one; a wrong password and an unknown username get the same "Wrong username or password." answer, and take the same time). Both take `{ username, password }` (8-72 characters for a new password), store only a bcrypt hash in `users.passwordHash`, and answer with a signed **JWT** (30 days, HS256) that the browser keeps in `localStorage` and sends as `Authorization: Bearer ...` (also for Socket.IO); the raw username is never trusted. Eight wrong guesses for one username from one IP, or eight sign-up attempts from one IP, block further attempts for ten minutes. Accounts that predate passwords have no hash yet, so their first sign-in with a password claims them. Set `JWT_SECRET` in production: without it a random key is used, which signs everybody out on every restart. Passwords are hashed with `bcryptjs` (the bcrypt algorithm, in pure JS so Docker/Render need no native build).

Data is in SQLite (`node:sqlite`, file `backend/data/proof-puzzle.db`, override with `DB_PATH`).

`points = completion 500 + optimality + speed - hints`, in `frontend/src/data/scoring.ts` (shared by the server and the UI):

- optimality = `1000 * min(1, optimalLines / your lines)`: full marks when your proof is as short as the shortest valid one
- speed = `500 * (1 - time / 5 min)`; the clock is kept server-side, from "Start Level" to a successful proof, excluding time paused away from the Game
- each hint costs 150 points and 30 seconds

`optimalLines` (in `levels.ts`, and in the `levels` table) is the length of the shortest valid proof, helper macros included; `parLimit` is only the hard cap. `npm run verify` checks each one: a reference solution of exactly that length is executed, and a lower bound `min(C, 1 + ceil(C / 4))` (C = fewest single-block commands, found by BFS; a helper holds at most 4 commands) must match, so the optimum is proven rather than assumed. `search-macros.ts` is the exhaustive search used to find the paint-level macros. For user-made levels the creator supplies "optimal lines".

| Endpoint | Purpose |
| --- | --- |
| `POST /api/register`, `POST /api/login`, `GET /api/me`, `POST /api/friends` | sign up / sign in (both return a JWT), current player, friends (Bearer JWT) |
| `GET /api/daily`, `GET /api/daily/solution` | today's generated puzzle (plus your result once completed); the optimal proof, after a longer-than-optimal completion |
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

- **`/battle`**: Socket.IO matchmaking queue. Two queued players get a **brand-new generated puzzle** (3x3, made from a fresh random seed for that match, unranked) and start immediately: no countdown, no clock. Every "Run Proof" is compiled by the server, which sends the opponent only the resulting board (a small read-only grid), never the code. When a proof solves the puzzle the client emits `board_solved`; the server re-verifies it and the first verified claim broadcasts `battle_over` (winner and loser); leaving the page forfeits. The queue and battles live in server memory (one process, nothing persisted). `backend/battle-bot.ts` is a test opponent: `npx tsx battle-bot.ts name partial|solve|idle|peek` (`peek` prints a shortest proof so you can win by hand).
- **`/daily`**: one procedurally generated puzzle per UTC day. `GET /api/daily` seeds `puzzleGenerator.ts` with the date, so every player (and every server instance) gets the same puzzle, delivered like a custom level; it is stored in `daily_puzzles` together with a shortest proof from the BFS solver. **It is a one-shot**: the first *valid* proof of the day, of any length, writes a row to `daily_completions` (per player and UTC date) and locks the puzzle for that player: further runs, hints and restarts are refused by the server (HTTP 409), and the UI shows the result instead of the Start button. Invalid proofs do not use up the attempt. If the proof was strictly longer than the optimum, a **Show Optimal Solution** button appears; it calls `GET /api/daily/solution`, which returns the exact BFS-generated proof and only to players who have completed today's puzzle with a longer one (everyone else gets 403, so the answer cannot be fetched early). "Share" copies the result as emoji rows with `navigator.clipboard.writeText`; if the browser refuses, the text is shown to copy by hand.
- **Sound** (`src/soundUtils.ts`, Web Audio, no samples): `swap` is a low A-major chord, `rotate` a short tick, `paint` a chime whose pitch depends on the color (C D E G A pentatonic). It plays as the step index moves: automatic playback after a run, "Replay with sound", and the timeline slider. 🔊/🔇 toggles it (remembered).

## Look and feel

Neo-brutalism "math hacker": graph-paper background, stark ink, 2-5 px black borders, hard offset shadows (no blur, no radii) and neon yellow / magenta / cyan accents. Space Grotesk for the UI and the leaderboard, Fira Code for code, timers and coordinates (both bundled with `@fontsource-variable`, no CDN). The design system lives in `index.css` (`.panel` / `.panel-heavy` / `.panel-light`, `.btn-*`, `.tile`): every button is a "key" that lifts on hover and, when pressed, loses its shadow and sinks 4 px down and right. Board tiles are thick bevelled blocks that lift on hover. Panels deliberately differ in border weight and sit slightly off-grid and off-axis. The board (`BoardView.tsx`) still uses Framer Motion: blocks keep an identity through swaps and glide with a spring, `rotate` animates the arrow, `paint` pulses the block, and a block that caused an illegal move shakes and flashes a magenta border (errors that name no block shake the board). A perfect, optimal-length solve fires `canvas-confetti`. The editor is `@monaco-editor/react` (local Monaco bundle) with a stark black `proof-brutal` theme. Motion is reduced for players who ask their OS for it.

## How to Play

`HowToPlay.tsx`: a five-step guide (goal, the three commands with before/after boards, helpers, timer and score, tools and modes) with Back / Next. It is an overlay driven by one piece of state (`isHowToPlayOpen` in `App.tsx`), not a route: it opens right after every sign-in and from the "? How to Play" button in the top bar on any page, and Esc, the X and the final "Play!" all just close it. Nothing underneath is navigated away from or unmounted, so a battle in progress (and its Socket.IO connection) or a half-written daily proof is untouched.

## Deployment

**Backend** (`backend/`): `npm run build` compiles to `dist/` and `npm start` runs `node dist/index.js`. The server imports the shared level data from `frontend/src/data`, so `tsc` keeps the repository layout (`dist/backend/index.js`) and the build writes a one-line `dist/index.js` that loads it. Settings are environment variables (see `backend/.env.example`): `PORT` (default 3000), `FRONTEND_URL` (the allowed browser origin(s) for the REST API and Socket.IO; unset allows every origin), `PUBLIC_URL` (base of shared level links, defaults to `FRONTEND_URL`), `DB_PATH` (SQLite file), `USE_LEAN=0`. `GET /api/health` is the liveness probe.

```bash
# from proof-puzzle/ (the image needs frontend/src/data, so the repository root is the build context)
docker build -f backend/Dockerfile -t proof-puzzle-backend .
docker run -p 3000:3000 -e FRONTEND_URL=https://your-app.vercel.app -v proof-puzzle-data:/data proof-puzzle-backend
```

The image uses `node:24-alpine` and the built-in mock engine. Keep `/data` on a volume if you want scores and accounts to survive restarts (the free Render plan has no volume, so they do not). Run a single instance: battles and the matchmaking queue live in memory.

**Frontend** (`frontend/`): set `VITE_API_URL` to the backend's public URL (`.env.production`, or the Vercel dashboard, which takes precedence) and deploy with `npm run build`. `vercel.json` rewrites every path to `index.html` so React Router routes like `/game` survive a refresh. Without `VITE_API_URL` (local development) requests stay on the page's origin and Vite proxies `/api` and `/socket.io` to `localhost:3000` (`VITE_DEV_API` overrides).

**Database**: SQLite through `node:sqlite`, not Prisma. `db.ts` creates and migrates the tables when the server starts, so no migration command runs on deploy.

### Deploy checklist

1. **Backend (free)**: on Render, New > Blueprint and pick this repository. `render.yaml` uses the **free** plan (no card needed): Docker build from the repository root, the health check, and a prompt for `FRONTEND_URL`. If the Blueprint page still asks for payment details, skip it and create the service by hand instead: New > **Web Service** > this repository > Language **Docker** > Instance Type **Free**; under Advanced set Dockerfile Path `backend/Dockerfile` and Docker Build Context Directory `.` (the repository root), Health Check Path `/api/health`, and the environment variable `FRONTEND_URL`. Note the public URL, e.g. `https://proof-puzzle-api.onrender.com`. **Free means no disk**: accounts and scores are wiped when the service restarts, which includes waking up after its ~15 minute idle sleep (the first request then takes about a minute). To keep data you need a paid disk or an external database (Turso and Neon have free tiers, but the SQLite code would need porting).
2. **Frontend**: import this repository into Vercel, set **Root Directory** to `frontend`, add the environment variable `VITE_API_URL` = the backend URL from step 1, and deploy. Note the site URL, e.g. `https://proof-puzzle.vercel.app`.
3. **Connect them**: set `FRONTEND_URL` on the backend to the Vercel URL from step 2 and redeploy the backend (without it, browsers are not blocked, but production should list its origin).
4. **Smoke test**: open the Vercel site, sign up with a username and password (then sign out and sign in again), solve Level 1, open `/leaderboard`, refresh on `/game` (the Vercel rewrite should keep it working), and start a battle from two browsers.

## Generated puzzles and levels 24-67

`backend/puzzleGenerator.ts` makes a puzzle by taking a seeded random 3x3 board (with a few arrow blocks), applying a random sequence of 3-7 valid transformations (swap, rotate, paint) that each really change the board, and keeping the result as the target. A breadth-first search then finds the shortest single-block proof, whose length is the puzzle's `optimalLines` (par is that plus two). Because it is seeded, the same seed always gives the same puzzle: the Daily Theorem seeds it with the date, battles with a random seed. For these puzzles the optimum is the shortest *single-block* proof, so a clever helper macro can only beat it (and still scores full optimality); levels 1-23 are the ones whose optimum includes helpers and is proven.

Levels 24-67 come from `npm run generate:levels` (`backend/scripts/generate-levels.ts`): 12 3x3 levels, 16 4x4 levels and 16 5x5 levels, each tier sorted by the length of its shortest proof (3 up to 11). The output is checked in as `frontend/src/data/generatedLevels.ts` (boards, par, optimum) and `backend/generatedSolutions.ts` (one reference proof per level, kept server-side); `levels.ts` turns the rows into `Level`s, so the count is exactly 67.
