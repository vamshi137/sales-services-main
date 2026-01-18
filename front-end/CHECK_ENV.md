# Environment Variable Troubleshooting

## Current Issue
The API Test Utility shows the config URL as `/login.php?i=1` (relative) instead of `https://hrms1.free.nf/api/login.php?i=1` (absolute).

This means the axios `baseURL` is not being set correctly.

## Root Cause
The environment variable `VITE_API_BASE_URL` is either:
1. Not defined in `.env` file
2. Dev server was not restarted after adding it
3. Running old build that doesn't have the variable

## How to Fix

### Step 1: Verify .env file exists
```bash
cd front-end
cat .env
```

**Expected content:**
```bash
VITE_API_BASE_URL=https://hrms1.free.nf/api
```

### Step 2: Restart Dev Server
If running `npm run dev`:
```bash
# Press Ctrl+C to stop
# Then restart:
npm run dev
```

**⚠️ CRITICAL:** Vite only loads environment variables when the dev server STARTS. Changing .env while server is running has NO EFFECT.

### Step 3: Check Browser Console
After restarting, check browser console for:
```
🔧 API Configuration:
  Environment: development
  VITE_API_BASE_URL from env: https://hrms1.free.nf/api   ← SHOULD NOT BE undefined
  Final API_BASE_URL: https://hrms1.free.nf/api
  Is absolute URL? true

📡 Axios Instance Created:
  baseURL: https://hrms1.free.nf/api   ← SHOULD BE ABSOLUTE URL
```

If you see `VITE_API_BASE_URL from env: undefined`, then:
- .env file is missing or incorrect
- Dev server needs restart
- .env file is in wrong location (must be in `front-end/` directory)

### Step 4: Test API Request
Make a request and check console:
```
📤 API Request [POST]: https://hrms1.free.nf/api/login.php?i=1
  Config URL: /login.php?i=1
  Config baseURL: https://hrms1.free.nf/api   ← MUST BE ABSOLUTE
  Full URL: https://hrms1.free.nf/api/login.php?i=1
```

The **Full URL** must be absolute with `https://`.

## For Vercel Deployment

If deploying to Vercel, you MUST:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://hrms1.free.nf/api`
   - Environments: Production ✓, Preview ✓, Development ✓
3. Redeploy after adding variable

## Quick Test Commands

```bash
# Check if .env exists
cd front-end
ls -la .env

# View .env content
cat .env

# Check if dev server is running
ps aux | grep "vite"

# Restart dev server
# 1. Press Ctrl+C
# 2. Run:
npm run dev

# Build for production
npm run build
```

## Expected vs Actual

### ❌ Current (Broken)
```
Config URL: /login.php?i=1
Config baseURL: undefined or not absolute
Full URL: /login.php?i=1
```

### ✅ Expected (Working)
```
Config URL: /login.php?i=1
Config baseURL: https://hrms1.free.nf/api
Full URL: https://hrms1.free.nf/api/login.php?i=1
```

## Verification Checklist

- [ ] .env file exists in `front-end/` directory
- [ ] .env contains `VITE_API_BASE_URL=https://hrms1.free.nf/api`
- [ ] Dev server stopped and restarted
- [ ] Browser console shows `VITE_API_BASE_URL from env: https://hrms1.free.nf/api`
- [ ] Browser console shows `baseURL: https://hrms1.free.nf/api`
- [ ] Full URL in logs is absolute (starts with https://)

If all above are checked and it still doesn't work, there may be a caching issue. Try:
1. Hard refresh browser (Ctrl+Shift+R)
2. Clear browser cache
3. Restart dev server again
