# Backend image using the built-in mock engine (no Lean install needed), so a plain Node Alpine base is enough.
#
# The server imports the shared level data from ../frontend/src/data, so build with the repository root
# (proof-puzzle/) as the context:
#
#   docker build -f backend/Dockerfile -t proof-puzzle-backend .
#   docker run -p 3000:3000 -e FRONTEND_URL=https://your-app.vercel.app -v proof-puzzle-data:/data proof-puzzle-backend
#
# node:sqlite needs Node 22.5 or newer, hence node:24.

FROM node:24-alpine AS build
WORKDIR /app
COPY backend/package.json backend/package-lock.json backend/
RUN cd backend && npm ci
COPY backend backend
COPY frontend/src/data frontend/src/data
RUN cd backend && npm run build

FROM node:24-alpine
ENV NODE_ENV=production \
    PORT=3000 \
    DB_PATH=/data/proof-puzzle.db
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/backend/dist ./dist
# only used if Lean 4 is ever installed in the image
COPY lean-project /app/lean-project
RUN apk add --no-cache su-exec && mkdir -p /data
VOLUME /data
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s CMD wget -qO- "http://127.0.0.1:${PORT}/api/health" || exit 1
# Mounted volumes (Render disks, `docker run -v`) are usually owned by root, so the container starts as root,
# hands /data to the unprivileged node user, then drops to it for the server process.
CMD ["sh", "-c", "chown -R node:node /data && exec su-exec node node dist/index.js"]
