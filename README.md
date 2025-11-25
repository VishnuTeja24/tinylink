# TinyLink - Full Project

This is the complete TinyLink project (Next.js + Prisma + Postgres + Tailwind).

Instructions to run locally:

1. Install dependencies:
   ```
   npm install
   ```

2. Copy `.env.example` to `.env` and set `DATABASE_URL`.

3. Generate Prisma client:
   ```
   npx prisma generate
   ```

4. Run migration:
   ```
   npx prisma migrate dev --name init
   ```

5. Start dev server:
   ```
   npm run dev
   ```

Visit http://localhost:3000
