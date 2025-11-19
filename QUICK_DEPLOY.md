# Quick Deployment Guide - 5 Minutes

## 🚀 Deploy to Vercel (Free)

### Step 1: Push to GitHub (2 min)

```bash
# If not already initialized
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/tinylink.git
git push -u origin main
```

### Step 2: Deploy on Vercel (2 min)

1. Go to [vercel.com](https://vercel.com) → Sign up/Login
2. Click **"Add New Project"**
3. Import your GitHub repo
4. **Add Environment Variables:**
   - `DATABASE_URL` = Your Neon connection string
   - `NEXT_PUBLIC_BASE_URL` = Leave empty (update after deploy)
5. Click **"Deploy"**

### Step 3: Run Migrations (1 min)

After deployment, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link
vercel login
vercel link

# Run migrations
npx prisma migrate deploy
```

**OR** use Neon SQL Editor:
1. Go to Neon Dashboard → SQL Editor
2. Copy SQL from `prisma/migrations/xxxxx_init/migration.sql`
3. Run it in SQL Editor

### Step 4: Update Base URL

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_BASE_URL` = `https://your-app.vercel.app`
3. Redeploy (or wait for auto-redeploy)

### Step 5: Test

Visit: `https://your-app.vercel.app`

✅ Done! Your app is live!

---

## 📝 What You'll Need

- ✅ GitHub account (free)
- ✅ Vercel account (free) 
- ✅ Neon database (already set up)

---

## 🔗 Your URLs

- **Dashboard:** `https://your-app.vercel.app`
- **Health Check:** `https://your-app.vercel.app/api/healthz`
- **API:** `https://your-app.vercel.app/api/links`

---

## ⚠️ Important Notes

1. **Never commit `.env` file** - It's already in `.gitignore` ✅
2. **Set environment variables in Vercel** - Not in code
3. **Run migrations after first deploy** - Database needs tables
4. **Update `NEXT_PUBLIC_BASE_URL`** - After you get your Vercel URL

---

## 🆘 Troubleshooting

**Build fails?**
- Check Vercel logs
- Ensure `DATABASE_URL` is set
- Verify `package.json` has `postinstall` script

**Database connection fails?**
- Verify `DATABASE_URL` in Vercel environment variables
- Check Neon database is running
- Ensure connection string includes `?sslmode=require`

**Redirects not working?**
- Check `NEXT_PUBLIC_BASE_URL` is set correctly
- Verify migrations ran successfully

---

Need help? Check `DEPLOYMENT.md` for detailed instructions.

