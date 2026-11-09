# Tripinator

Shared list of trips and activities for a group of people — with a dice button that picks
the next one at random (filterable by indoor/outdoor, category, max cost, "not in the last
30 days"). German/English UI.

## Getting started

```sh
npm install
cp .env.example .env              # set BETTER_AUTH_SECRET (openssl rand -base64 32)
npm run admin:create -- you@example.com "Your Name"   # prints a one-time password
npm run dev                       # http://localhost:3000
```

No database server needed locally: `npm run dev` starts an embedded Postgres (PGlite) on port
5434 with its data in `data/pglite`. Migrations are applied automatically on start.

## Users

Registration is closed. The first admin comes from `npm run admin:create`; after that, admins
create accounts, reset passwords and grant admin rights on **/admin/users**. Everyone changes
their own name and password on **/account**.

## Excel import

Admins import trips on **/admin/import**: upload an `.xlsx`, check the preview, then import.

- One row per trip, first row = headers. Columns are matched by name, in any order, German or
  English: `Name` (required), `Kategorie`, `Kosten pro Person`, `Adresse`, `Land`, `Indoor`,
  `Link`, `Beschreibung`, `Zuletzt gemacht`, `Anzahl`. Common variants work too (`Preis`,
  `Ort`, `Webseite`, …). Title rows above the header row are skipped.
- No category column → the worksheet name is the category (one tab per category works).
  Missing categories are created.
- Values are parsed leniently: `12,50 €`, `kostenlos`, `ja`/`nein`/`x`, `TT.MM.JJJJ` or real
  date cells, hyperlink cells, `www.…` links. Anything that cannot be read is shown as an error
  in the preview and not imported.
- Trips that already exist (same name + category, case-insensitive) are skipped, or updated if
  you tick the box — blank cells never erase existing data.
- A template is downloadable on the import page.

## Scripts

```sh
npm run dev / build / start
npm run lint / format / typecheck   # biome, tsc
npm run db:generate                 # after editing lib/db/schema.ts; commit drizzle/
npm run db:serve                    # local DB only, e.g. for npm run db:studio
npm run admin:create -- <email> <name>
```
