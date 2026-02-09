# Deployment Instructions

## Push to GitHub

The project is ready to be pushed to GitHub. Follow these steps:

### 1. Create GitHub Repository

Go to https://github.com/new and create a new repository:
- **Repository name**: `html-skeleton-generator`
- **Description**: Generate loading skeleton components from HTML instantly
- **Visibility**: Public
- **DO NOT initialize** with README, .gitignore, or license (we already have these)

### 2. Push Local Repository

After creating the GitHub repository, run these commands:

```bash
cd ~/Projects/html-skeleton-generator

# Add GitHub remote
git remote add origin https://github.com/madushan-sooriyarathne/html-skeleton-generator.git

# Push to GitHub
git push -u origin main
```

If you need to authenticate with a Personal Access Token:
```bash
# Set your GitHub username
git config user.name "madushan-sooriyarathne"

# When prompted for password, use your Personal Access Token (not your GitHub password)
```

### 3. Alternative: Push Using GitHub Token

If you have a GitHub Personal Access Token stored:

```bash
# Read token from file (if stored)
TOKEN=$(cat ~/.github_token)

# Push with token
git remote add origin https://${TOKEN}@github.com/madushan-sooriyarathne/html-skeleton-generator.git
git push -u origin main
```

### 4. Verify Upload

After pushing, verify your repository at:
https://github.com/madushan-sooriyarathne/html-skeleton-generator

## Deploy to Vercel

### Option 1: Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your GitHub repository: `madushan-sooriyarathne/html-skeleton-generator`
3. Vercel will auto-detect Next.js settings
4. Click "Deploy"
5. Your app will be live at `https://html-skeleton-generator.vercel.app`

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd ~/Projects/html-skeleton-generator
vercel --prod
```

## Deploy to Netlify

1. Go to https://app.netlify.com/start
2. Connect to GitHub and select `html-skeleton-generator`
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
4. Click "Deploy site"

## Environment Variables

This project doesn't require any environment variables for basic functionality.

## Post-Deployment

After deploying:

1. Update the README with your live demo URL
2. Add topics to your GitHub repository: `nextjs`, `typescript`, `tailwindcss`, `shadcn-ui`, `skeleton-loader`, `react`
3. Consider adding a screenshot to the README
4. Star the repository ⭐

## Maintenance

To update the deployed site:

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push

# Vercel/Netlify will automatically redeploy
```
