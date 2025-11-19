# Cloudflare Pages Deployment Guide

## 🚀 Quick Deploy to Cloudflare Pages

Follow these steps to deploy the Maa Ādya Mahākālī Sahasranāma website to Cloudflare Pages:

### Step 1: Prepare Repository
✅ **Already Done!** Your code is pushed to:
`https://github.com/09ashishkapoor/1000namesofmaadya.git`

### Step 2: Connect to Cloudflare Pages

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com/
   - Sign in to your account

2. **Navigate to Pages**
   - Click on **"Workers & Pages"** in the left sidebar
   - Click **"Create application"**
   - Select **"Pages"** tab
   - Click **"Connect to Git"**

3. **Connect GitHub Repository**
   - Authorize Cloudflare to access your GitHub account
   - Select repository: `09ashishkapoor/1000namesofmaadya`
   - Click **"Begin setup"**

### Step 3: Configure Build Settings

Use these **exact settings**:

```
Project name: 1000namesofmaadya (or your preferred name)
Production branch: main
Build command: (leave empty)
Build output directory: / (or leave empty)
Root directory: (leave empty)
```

**Important:** Since this is a static HTML/CSS/JavaScript site, you don't need any build commands!

### Step 4: Deploy

1. Click **"Save and Deploy"**
2. Wait for deployment (usually takes 30-60 seconds)
3. Your site will be live at: `https://1000namesofmaadya.pages.dev`

### Step 5: Custom Domain (Optional)

To use a custom domain like `mahakali.yourdomain.com`:

1. Go to your Pages project
2. Click **"Custom domains"** tab
3. Click **"Set up a custom domain"**
4. Follow the DNS configuration instructions

## 📊 Project Information

- **Framework**: None (Pure HTML/CSS/JavaScript)
- **Build Time**: ~30 seconds
- **Total Size**: ~17 MB (includes large JSON data file)
- **No Dependencies**: Zero npm packages or build tools required

## 🔄 Automatic Deployments

Every time you push to the `main` branch, Cloudflare Pages will automatically:
1. Detect the push
2. Deploy the new version
3. Make it live within seconds

## ✨ Performance Features

Cloudflare Pages automatically provides:
- ⚡ Global CDN (distributed worldwide)
- 🔒 Free SSL/HTTPS
- 🚀 HTTP/3 support
- 📦 Asset optimization
- 🌍 DDoS protection
- 📈 Analytics (if enabled)

## 🌐 Expected URL

Your site will be available at:
```
https://1000namesofmaadya.pages.dev
```

Or with custom domain:
```
https://your-custom-domain.com
```

## 📝 Notes

- The JSON file is large (~13 MB) but Cloudflare handles it efficiently
- First load might take 2-3 seconds, then it's cached
- The site works completely client-side (no server needed)
- All 1,072 names with complete elaborations are included

## 🙏 Success!

Once deployed, share the URL with devotees worldwide to explore the 1,072 divine names of Maa Ādya Mahākālī!

---

**Need help?** Cloudflare Pages documentation: https://developers.cloudflare.com/pages/
