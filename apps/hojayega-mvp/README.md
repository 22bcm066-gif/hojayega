# HoJayega — MVP

"Whatever it is. Ho Jayega."

A fully client-side local task marketplace MVP. No backend, no login, no
payment gateway, no database — everything runs on mock data and browser
`localStorage` so it can be uploaded straight to any static host (including
shared hosting like GoDaddy).

## Stack

- React 18 + Vite
- React Router v6 (`HashRouter` — every route lives after a `#`, so the
  site works from any folder on any static host with zero server config)
- Tailwind CSS
- Framer Motion (animations/page transitions)
- lucide-react (icons)

## Local development

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm build
```

Outputs a fully static site to `dist/` — every asset path is relative
(`base: './'` in `vite.config.js`), so the folder can be deployed at the
domain root or in any subfolder without changes.

## Deploying to GoDaddy (or any static/Apache host)

1. Run `pnpm build`.
2. Upload the **contents** of `dist/` (not the folder itself) into
   `public_html/` (or the subfolder you want the site served from) via
   GoDaddy's File Manager or FTP.
3. That's it — open the site. Because routing is hash-based
   (`yoursite.com/#/browse-tasks`), there is no rewrite rule to configure
   and no risk of 404s on deep links, whether the site lives at the domain
   root or in a subfolder. `dist/.htaccess` is included anyway for basic
   asset caching/compression.

## Data & state

All tasks (seed data + anything a visitor posts) live in React context
(`src/context/TasksContext.jsx`) and are persisted to `localStorage` under
the key `hojayega:tasks:v1`. There is no server — posting, accepting and
completing a task are all local state transitions.

## Connecting a real backend later

The context layer (`TasksContext`) is the single seam where a real API
would plug in — swap the `localStorage` read/write and the `addTask` /
`acceptTask` / `completeTask` mutators for network calls, and every page
and component keeps working unchanged. The same applies to auth, real UPI
payments, live location, chat, ratings, etc. — all deliberately out of
scope for this MVP but the component boundaries (task cards, accept modal,
payment section) are structured to make wiring them in straightforward.
