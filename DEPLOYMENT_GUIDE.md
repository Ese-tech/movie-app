# 🚀 Deployment Guide - Vercel

## Prerequisites
1. **GitHub Repository**: Make sure your code is pushed to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **TMDB API Key**: You'll need your TMDB API key for deployment

## 📦 Deployment Steps

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   cd /home/dci-student/movie-app
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? `Y`
   - Which scope? (Select your account)
   - Link to existing project? `N` (for first deployment)
   - What's your project's name? `cineverse-movie-app`
   - In which directory is your code located? `./`

5. **Set Environment Variables**:
   ```bash
   vercel env add EXPO_PUBLIC_TMDB_API_KEY
   ```
   Enter your TMDB API key when prompted.

### Method 2: Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Connect your GitHub account**
3. **Import your movie-app repository**
4. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add: `EXPO_PUBLIC_TMDB_API_KEY` = `530bdf979dd5e101be641fb42df8a872`

6. **Deploy**: Click "Deploy"

## 🔧 Configuration Files Created

### `vercel.json`
- Configures build settings for Vercel
- Sets up proper routing for SPA (Single Page Application)
- Handles static assets correctly

### Updated `package.json`
- Added build scripts for web deployment
- Configured for Expo web export

## 🌐 Environment Variables

For production deployment, you'll need to set:
- `EXPO_PUBLIC_TMDB_API_KEY`: Your TMDB API key

## 📱 Features Working on Web

✅ **Working Features**:
- Movie browsing and search
- Genre filtering
- Movie details modal
- Navigation between pages
- Header and footer components
- Universal hero sections

⚠️ **Limited Features on Web**:
- Trailer playback (YouTube fallback)
- Some native mobile features

## 🔍 Post-Deployment Checklist

1. **Test the deployed app**:
   - Browse movies and TV shows
   - Test search functionality
   - Check genre filtering
   - Verify movie details modal
   - Test trailer functionality

2. **Check console for errors**:
   - Open browser dev tools
   - Look for API errors or missing resources

3. **Verify API calls**:
   - Ensure TMDB API calls are working
   - Check network tab for failed requests

## 📝 Deployment Commands

```bash
# Local build test
npm run build

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

## 🐛 Troubleshooting

**Common Issues**:
1. **Build fails**: Check TypeScript errors with `npx tsc --noEmit`
2. **API not working**: Verify environment variables are set
3. **Routing issues**: Check vercel.json configuration
4. **Assets not loading**: Verify build output in `dist` folder

## 🎉 Success!

Once deployed, your movie app will be available at:
`https://your-project-name.vercel.app`

The app features:
- 🎬 Movie and TV show browsing
- 🔍 Search functionality
- 🎯 Genre filtering
- 📱 Responsive design
- 🎭 Universal hero sections
- ▶️ In-app trailer previews