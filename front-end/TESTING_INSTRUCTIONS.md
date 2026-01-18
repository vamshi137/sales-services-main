# 🧪 Testing Instructions - IMPORTANT

## ✅ What Was Fixed

1. **Enhanced logging** - Now logs are visible in BOTH dev and production
2. **Environment variable** - Confirmed `.env` has `VITE_API_BASE_URL=https://hrms1.free.nf/api`
3. **ApiTestUtility** - Enhanced with comprehensive diagnostics
4. **Build successful** - No errors

## 🚨 CRITICAL NEXT STEPS

### You Are Currently Testing

The dev server is running at: **http://localhost:8080**

### Step 1: Open Browser Console FIRST

**Before opening the app**, open DevTools:
1. Press **F12** (or right-click → Inspect)
2. Go to **Console** tab
3. Keep it open

### Step 2: Navigate to App

Open: **http://localhost:8080**

### Step 3: CHECK CONSOLE LOGS

You MUST see these logs when the page loads:

```javascript
🔧 API Configuration:
  Environment: development
  VITE_API_BASE_URL from env: https://hrms1.free.nf/api   ← CHECK THIS
  Final API_BASE_URL: https://hrms1.free.nf/api
  Is absolute URL? true

📡 Axios Instance Created:
  baseURL: https://hrms1.free.nf/api   ← CHECK THIS
  timeout: 30000
  Default headers: { ... }
```

### Step 4: Go to API Test Utility

Navigate to: **http://localhost:8080/api-test**

**Check console again:**
```javascript
🔧 API Test Utility - Environment Check:
  VITE_API_BASE_URL: https://hrms1.free.nf/api   ← CHECK THIS
  Resolved baseUrl: https://hrms1.free.nf/api
  Is absolute? true
  All import.meta.env: { ... }
```

### Step 5: Click "Run All Tests"

**Watch the console for request logs:**
```javascript
🧪 CORS Test URL: https://hrms1.free.nf/api/test_cors_live.php?i=1

🧪 Login Test Starting...
  Using authAPI.login from @/lib/api

📤 API Request [POST]: https://hrms1.free.nf/api/login.php?i=1
  Config URL: /login.php?i=1
  Config baseURL: https://hrms1.free.nf/api   ← MUST BE ABSOLUTE
  Full URL: https://hrms1.free.nf/api/login.php?i=1   ← THIS IS THE ACTUAL REQUEST
```

---

## ✅ What Success Looks Like

### Console Logs (On Page Load)
```
VITE_API_BASE_URL from env: https://hrms1.free.nf/api   ✅
Final API_BASE_URL: https://hrms1.free.nf/api           ✅
baseURL: https://hrms1.free.nf/api                      ✅
```

### Console Logs (On API Request)
```
Full URL: https://hrms1.free.nf/api/login.php?i=1      ✅
```

### API Test Results
- CORS Test: May pass or show backend error (NOT "Failed to fetch")
- Login Test: May pass or show "Invalid credentials" (NOT "Network Error")

---

## ❌ What Failure Looks Like

### Console Logs Show
```
VITE_API_BASE_URL from env: undefined                    ❌
Config baseURL: undefined                                ❌
Full URL: /login.php?i=1                                 ❌
```

### API Test Results
- CORS Test: "Failed to fetch"
- Login Test: "Network Error"

---

## 🔧 If You See "undefined" in Console

This means the environment variable is NOT being loaded. To fix:

1. **Stop the dev server** (Press Ctrl+C in terminal)
2. **Verify .env file:**
   ```bash
   cd front-end
   cat .env
   ```
   Should show: `VITE_API_BASE_URL=https://hrms1.free.nf/api`

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

4. **Hard refresh browser** (Ctrl+Shift+R)

---

## 📊 Understanding the Request Flow

Even though the error log shows:
```json
"config": {
  "url": "/login.php?i=1"   ← This is RELATIVE
}
```

This is NORMAL. Axios stores the relative URL in config.url and combines it with baseURL internally.

**What matters is:**
1. The console log shows: `Full URL: https://hrms1.free.nf/api/login.php?i=1`
2. The Network tab in DevTools shows the request going to: `https://hrms1.free.nf/api/login.php?i=1`

---

## 🌐 Checking Network Tab

1. Open DevTools → **Network** tab
2. Filter: **XHR** or **Fetch**
3. Click "Run All Tests" in API Test Utility
4. Look at the request names:
   - ✅ **Should see:** `login.php?i=1` with domain `hrms1.free.nf`
   - ❌ **Should NOT see:** `login.php?i=1` with domain `localhost:8080`

5. Click on the request to see details:
   - **Request URL:** Should be `https://hrms1.free.nf/api/login.php?i=1`
   - **Request Headers:** Should have `Content-Type: application/json`

---

## 🎯 Expected Test Results

### CORS Test
- **May show error if backend endpoint doesn't exist**
- That's OK - we're testing the URL is correct

### Login Test
- **May show "Invalid credentials"** - That's OK!
- **Should NOT show "Network Error"** or "Failed to fetch"
- If backend is working, may show actual response

### Profile/Dashboard Tests
- **Will show "No auth token found"** - Expected (need to login first)

---

## 📝 What to Report Back

Please share:

1. **Console logs on page load** (the API Configuration section)
2. **Console logs when clicking "Run All Tests"** (the Full URL line)
3. **Network tab** - screenshot of the request showing the URL
4. **API Test Utility results** - what each test shows

This will help me identify if:
- ✅ Configuration is correct
- ✅ Requests are going to the right URL
- ❌ There's a backend issue (CORS, auth, etc.)
- ❌ Environment variable is still not loading

---

## 🚀 For Vercel Deployment

If local testing works but Vercel doesn't:

1. **Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add variable:**
   - Name: `VITE_API_BASE_URL`
   - Value: `https://hrms1.free.nf/api`
   - Environments: All (Production, Preview, Development)
3. **Save**
4. **Redeploy** (Deployments tab → Redeploy)
5. **Wait for build to complete**
6. **Test on Vercel URL**

---

## ✨ Current Status

- ✅ Code fixes applied
- ✅ Build successful
- ✅ .env file correct
- ✅ Dev server running on http://localhost:8080
- ⏳ Waiting for you to test and report console logs

**Next:** Open http://localhost:8080 and check browser console!
