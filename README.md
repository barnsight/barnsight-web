# BarnSight UA Website

Node.js + Express + Tailwind CSS website for BarnSight with:

- Ukrainian monochrome public landing page
- Session-based login page
- Authenticated dashboard with proxy routes to BarnSight API

## Quick start

1. Copy `.env.example` to `.env.local` (or `.env`) and set:
   - `SESSION_SECRET`
   - optional `PORT`
2. Install dependencies:
   - `npm install`
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
- `image_snapshot` is handled as:
  - full URL
  - `data:image/...` URL
  - raw base64 payload (auto-prefixed)
