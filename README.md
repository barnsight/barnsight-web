# BarnSight Web

Node.js + Express + EJS + Tailwind CSS frontend for BarnSight with:

- Public BarnSight marketing pages and login flow
- Session-based authenticated dashboard over the BarnSight API
- Role-aware operations workspace for barns, devices, cameras, zones, events, API keys, and admin tools
- Server-side API proxy routes that keep auth tokens in the session rather than browser storage

## Quick start

1. Copy `.env.example` to `.env.local` (or `.env`) and set:
   - `BARNSIGHT_API_BASE_URL`
   - `SESSION_SECRET`
   - optional `PORT`
2. Install dependencies:
   - `npm ci`
3. Run development mode:
   - `npm run dev`
4. Open:
   - `http://localhost:3000`

## Production run

1. Build CSS:
   - `npm run build`
2. Start server:
   - `npm run start`

## Notes

- API base URL defaults to `https://barnsight-api-t8fr.onrender.com`.
- Browser never stores JWT in `localStorage`; token is kept in server session only.
- `403` responses are redirected to `/unauthorized`.
- `401` responses from the dashboard proxy redirect back to `/login`.
- `forgot-password` and `reset-password` pages are present as UI placeholders; the current API does not yet expose a dedicated tokenized reset flow.
- `image_snapshot` is handled as:
  - full URL
  - `data:image/...` URL
  - raw base64 payload (auto-prefixed)
