# 9Cloud Teamwork Dashboard

A real-time dashboard that connects to your Teamwork account to display tasks and time tracking data.

## Features

- ✅ View tasks by **Project** or **Staff**
- ✅ Filter by **Date**, **Project**, **Staff**
- ✅ **Bar Chart** showing workload (hours per person/project)
- ✅ **Pie Chart** for task status breakdown
- ✅ Live data from Teamwork API
- ✅ Refresh button to update data

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **"New Project"**
4. Import your GitHub repository
5. Click **Deploy** - Vercel will auto-detect the configuration
6. Your dashboard is live! 🎉

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to this folder
cd teamwork-dashboard-vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

## Project Structure

```
teamwork-dashboard-vercel/
├── index.html        # Main dashboard (React + Recharts)
├── api/
│   └── teamwork.js   # Serverless function (API proxy)
├── vercel.json       # Vercel configuration
└── README.md         # This file
```

## How It Works

1. **index.html** - The frontend dashboard built with React and Recharts
2. **api/teamwork.js** - A serverless function that proxies requests to Teamwork API (bypasses CORS)
3. **vercel.json** - Tells Vercel how to route requests

## Security Note

⚠️ Your Teamwork API key is stored in `api/teamwork.js`. For better security:

1. Go to your Vercel project settings
2. Add an Environment Variable:
   - Name: `TEAMWORK_API_KEY`
   - Value: `twp_kouI7Vd8IetzZ1b88Y7L8vf6Xm0K`
3. Update `api/teamwork.js` to use `process.env.TEAMWORK_API_KEY`

## Customization

### Change Teamwork Account
Edit `api/teamwork.js`:
```javascript
const TEAMWORK_URL = 'https://YOUR-SITE.teamwork.com';
const API_KEY = 'your-api-key-here';
```

### Styling
All styles are in `index.html` inside the `<style>` tag. Key colors:
- Primary: `#06b6d4` (cyan)
- Secondary: `#8b5cf6` (purple)
- Background: `#0c1222` to `#1a1f35` (dark gradient)

## Support

For issues with the Teamwork API, check their docs at: https://developer.teamwork.com
