# Deployment Guide - TinyLink

This guide will help you deploy TinyLink to **Vercel** (free tier) with **Neon PostgreSQL**.

## Prerequisites

- GitHub account (free)
- Vercel account (free)
- Neon PostgreSQL database (already set up)

---

## Step 1: Prepare Your Code

### 1.1 Ensure .env is in .gitignore
✅ Already configured - `.env` files are ignored

### 1.2 Commit and Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: TinyLink URL shortener"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/tinylink.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### 2.1 Sign Up / Login to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended) or email
3. Complete the onboarding

### 2.2 Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository (`tinylink`)
3. Vercel will auto-detect Next.js settings

### 2.3 Configure Environment Variables

**Before deploying, add these environment variables:**

1. Click **"Environment Variables"** section
2. Add the following:

   **Variable 1:**
   - **Name:** `DATABASE_URL`
   - **Value:** Your Neon connection string
     ```
     postgresql://neondb_owner:YOUR_PASSWORD@ep-falling-butterfly-a4i7q1xw-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
     ```
   - **Environment:** Production, Preview, Development (select all)

   **Variable 2:**
   - **Name:** `NEXT_PUBLIC_BASE_URL`
   - **Value:** Leave empty for now (we'll update after deployment)
   - **Environment:** Production, Preview, Development

### 2.4 Configure Build Settings

Vercel should auto-detect, but verify:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (or `prisma generate && next build`)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install`

### 2.5 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at: `https://tinylink-xxxxx.vercel.app`

---

## Step 3: Run Database Migrations

After deployment, you need to run migrations on production:

### Option 1: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link to your project
cd tinylink
vercel link

# Run migrations
npx prisma migrate deploy
```

### Option 2: Using Neon Console

1. Go to your Neon project dashboard
2. Open SQL Editor
3. Run the migration SQL manually (from `prisma/migrations/xxxxx_init/migration.sql`)

### Option 3: Using Prisma Studio (for testing)

```bash
# Set DATABASE_URL in your local .env to production URL temporarily
DATABASE_URL="your-production-neon-url"

# Run migrations
npx prisma migrate deploy
```

---

## Step 4: Update Base URL

After deployment:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_BASE_URL`:
   - **Value:** `https://your-app-name.vercel.app`
   - Or use your custom domain if configured
3. Redeploy (or wait for auto-redeploy)

---

## Step 5: Test Your Deployment

### Test Endpoints:

1. **Health Check:**
   ```
   https://your-app.vercel.app/api/healthz
   ```
   Should return: `{"ok": true, "version": "1.0"}`

2. **Create Link:**
   ```
   POST https://your-app.vercel.app/api/links
   Body: {"targetUrl": "https://example.com"}
   ```

3. **Redirect:**
   ```
   https://your-app.vercel.app/YOUR_CODE
   ```

4. **Dashboard:**
   ```
   https://your-app.vercel.app/
   ```

---

## Step 6: Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `tinylink.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_BASE_URL` to your custom domain

---

## Troubleshooting

### Build Fails

**Error: Prisma Client not generated**
- Solution: The `postinstall` script should handle this, but you can add:
  ```json
  "scripts": {
    "postinstall": "prisma generate"
  }
  ```

**Error: Module not found**
- Solution: Ensure all dependencies are in `package.json`
- Run `npm install` locally to verify

### Database Connection Issues

**Error: Can't reach database**
- Check `DATABASE_URL` is set correctly in Vercel
- Verify Neon database is running
- Check if connection pooling is enabled (recommended for serverless)

### Redirects Not Working

- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- Check server logs in Vercel Dashboard
- Ensure migrations ran successfully

---

## Free Tier Limits

### Vercel Free Tier:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions
- ✅ Automatic HTTPS
- ✅ Custom domains

### Neon Free Tier:
- ✅ 0.5 GB storage
- ✅ Unlimited projects
- ✅ Connection pooling
- ✅ Automatic backups

---

## Monitoring & Logs

1. **View Logs:**
   - Vercel Dashboard → Your Project → Deployments → Click deployment → Logs

2. **Monitor Performance:**
   - Vercel Dashboard → Analytics (available on free tier)

3. **Database Monitoring:**
   - Neon Dashboard → Metrics

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Run migrations
3. ✅ Test all endpoints
4. ✅ Share your public URL
5. ✅ Submit for testing

Your TinyLink app is now live! 🚀

