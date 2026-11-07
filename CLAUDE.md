# Tripinator

Shared trip/activity list with a random picker. Next.js 16 (App Router), React 19, Drizzle +
PostgreSQL, better-auth, Tailwind v4 + shadcn/ui (Radix, style new-york), i18next (de/en).
Stack, local DB setup and deployment deliberately mirror the sibling project **Spoolhouse** —
when in doubt, do what Spoolhouse does.

## Commands

```sh
npm run dev            # Next dev + local PGlite DB (port 5434, data/pglite)
npm run build          # production build (standalone output)
npm run lint           # biome check   (npm run format to fix formatting)
npm run typecheck      # tsc --noEmit
npm run db:generate    # drizzle-kit migration after schema changes — commit drizzle/
npm run admin:create -- <email> <name>
```

Package manager: **npm**. Formatter/linter: **Biome** (tabs, double quotes). `components/ui/`
and `drizzle/` are excluded from Biome.

## Architecture

- `app/(app)/` — every authenticated page; its layout renders `<Navigation>` and calls
  `requireUser()`. `app/login/` is the only public page.
- **Every page and server action calls `requireUser()` / `requireAdmin()`**
  (`lib/auth-session.ts`) itself; `proxy.ts` is only an optimistic cookie redirect, and `/api/*`
  route handlers check the session themselves.
- Data model (`lib/db/schema.ts`): `categories` (unique name) and `trips` (FK category,
  `ON DELETE RESTRICT`). **One shared pool** — all signed-in users see and edit all trips;
  `createdById` is attribution only. UUID primary keys.
- Server actions: `app/_actions/trips.ts`, `categories.ts`, `import.ts`. Reads in `lib/queries.ts`.
  Mutations `revalidatePath("/", "layout")`.
- `lib/trip-input.ts` — the one zod schema for the trip form, the actions and the import.
  Error messages are i18n keys (`validation.*`). Optional fields are `null`, never `""`.
- Users: better-auth admin plugin. Admin UI on `/admin/users` calls `authClient.admin.*`
  directly (createUser, setRole, setUserPassword, removeUser). No mail/password-reset flow —
  admins set passwords.
- **Excel import** (`/admin/import`): `lib/excel-import.ts` parses with exceljs (header aliases,
  lenient value parsing, sheet name as category fallback); `previewImport` classifies rows
  (new/exists/duplicate/error), `commitImport` re-validates the rows sent back by the client and
  writes them in one transaction. Matching is name + category, case-insensitive. The upload goes
  through a server action — `next.config.ts` raises `bodySizeLimit`.

## i18n

`lib/i18n.ts` + `lib/locales/{de,en}.json`. Language lives in the `lang` cookie (default `de`),
read server-side so SSR and hydration agree. Client components: `useTranslation()`. Server
components/actions: `getT()` from `lib/i18n-server.ts`. **Every new string goes into both
locale files.** `lib/i18n.ts` must not import `react-i18next` (it runs in server components).

## Database

Same as Spoolhouse: `pg` everywhere. Production gets `DATABASE_PASSWORD_FILE` (Docker secret)
and `lib/db/local.mjs` builds the URL (defaults `postgres:5432`, user/db `tripinator`).
Without `DATABASE_URL`/`DATABASE_PASSWORD_FILE`, the local PGlite host
(`scripts/pglite-server.mjs`) is used — started by `npm run dev`/`start` and by CLI scripts via
`withLocalDb()`. Migrations run from `instrumentation.ts` on startup and from
`scripts/migrate.mjs` in the deploy workflow.

## Deployment

`.github/workflows/deploy.yml`: a `check` job (typecheck, Biome, and on PRs a full `next build`)
gates everything and is the only job that runs on PRs. Pushes to `main` then build `ghcr.io/connor935/tripinator` (runner) and
`tripinator-tools` (builder, for migrate/admin), then SSHes to the box, runs the migration and
`docker compose up -d` in `$STACK_DIR`. Compose stack + guide: `server` repo,
`tripinator/`.
