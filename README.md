# TinyLink - URL Shortener

A URL shortener application similar to bit.ly, built with Next.js, Prisma, and PostgreSQL.

## Features

- ✅ Create short links with optional custom codes
- ✅ Redirect with click tracking (302 redirects)
- ✅ View link statistics
- ✅ Delete links
- ✅ Search and filter links
- ✅ Responsive design
- ✅ Clean, modern UI

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (via Prisma)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Language**: TypeScript

## Prerequisites

- Node.js 18+ 
- PostgreSQL database (recommended: [Neon](https://neon.tech) for free hosting)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd tinylink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```
   
   For production, set `NEXT_PUBLIC_BASE_URL` to your deployed domain.

4. **Set up the database**
   
   Generate Prisma client and run migrations:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

- `POST /api/links` - Create a new short link
- `GET /api/links` - List all links
- `GET /api/links/:code` - Get stats for a specific code
- `DELETE /api/links/:code` - Delete a link
- `GET /api/healthz` - Health check endpoint

## Routes

- `/` - Dashboard (list, add, delete links)
- `/code/:code` - Stats page for a specific link
- `/:code` - Redirect to original URL (302)
- `/healthz` - Health check page

## Code Format

Short codes must be 6-8 alphanumeric characters: `[A-Za-z0-9]{6,8}`

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_BASE_URL` (your Vercel domain)
4. Deploy

### Database Setup (Neon)

1. Create a free account at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string to your `DATABASE_URL`
4. Run migrations: `npx prisma migrate deploy`

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npx prisma studio
```

## Project Structure

```
tinylink/
├── app/
│   ├── api/          # API routes
│   ├── code/         # Stats pages
│   ├── [code]/       # Redirect handler
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Dashboard
├── components/       # React components
├── lib/              # Utilities and helpers
└── prisma/           # Database schema
```

## License

MIT
