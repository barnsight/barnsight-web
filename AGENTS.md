# AGENTS.md

Guidance for agents working in this repository.

## Project

- This is the BarnSight web frontend: an Express + EJS site with Tailwind CSS.
- The related API lives at `/home/th0truth/code/Projects/BarnSight/barnsight-api`.
- Public assets are served from `public/assets`; static client scripts are in `public`.

## Commands

- Install dependencies with `npm ci`.
- Build CSS with `npm run build`.
- Run the app with `npm run dev` for development or `npm start` for production-like startup.
- Validate changed JavaScript with `node --check <file>`.

## Style

- Keep changes small, direct, and consistent with the existing EJS/Tailwind style.
- Prefer server-side rendering for page structure and small client-side scripts for interactive API calls.
- Keep user-facing copy internationalized through `server/i18n.js` when practical.
- Use the existing yellow BarnSight visual theme and brand assets under `public/assets/brand`.

## API Integration

- Use `server/apiClient.js` for BarnSight API calls.
- Use `/app/api/v1/...` proxy routes for authenticated browser access to API endpoints.
- Edge-device requests may require `X-API-Key`; do not hardcode real API keys.

## Validation

- After changing views, scripts, or Tailwind classes, run `npm run build`.
- After changing server or client JavaScript, run `node --check` on the touched files.
- If templates change, render-check affected EJS views when feasible.
