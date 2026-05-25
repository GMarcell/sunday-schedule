# Sunday Schedule

A Next.js App Router project for managing Sunday service roles, members, service templates, generated schedules, public rosters, manual overrides, and monthly exports.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to a PostgreSQL database.
2. Install dependencies:

```bash
npm install
```

3. Create tables and seed starter data:

```bash
npm run prisma:migrate
npm run prisma:seed
```

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000` for the public roster and `http://localhost:3000/admin` for the admin screens.

## Verification

```bash
npx tsc --noEmit
npx next lint
npm run build
```

## Runtime Note

This project uses Next.js `16.2.6`, which requires Node.js `>=20.9.0`. Upgrade Node before running `npm run dev`, `npm run build`, or `npm start`.
