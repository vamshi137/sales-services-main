# 🚀 Quick Reference - InfinityFree Integration

## 🎯 Working Request Format

### Login Request (POST)
```http
POST https://hrms1.free.nf/api/login.php?i=1
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Protected Request (GET)
```http
GET https://hrms1.free.nf/api/profile.php?i=1
Content-Type: application/json
X-Auth-Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔑 Key Points

| ✅ DO | ❌ DON'T |
|-------|----------|
| Use `X-Auth-Token` header | Use `Authorization: Bearer` |
| Append `?i=1` to ALL requests | Forget the `?i=1` parameter |
| Send `Content-Type: application/json` | Send other content types |
| Use `/api-test` for debugging | Skip testing |

---

## 📝 Code Snippets

### Making API Calls
```typescript
import { authAPI, employeeAPI, dashboardAPI } from '@/lib/api';

// Login (no token needed)
const response = await authAPI.login(email, password);
// Stores: token, refreshToken, user in localStorage

// Get profile (token auto-attached)
const profile = await authAPI.getProfile();

// Get employees (token auto-attached)
const employees = await employeeAPI.getAll({ page: 1, limit: 10 });

// Get dashboard stats (token auto-attached)
const stats = await dashboardAPI.getStats();
```

### Accessing Stored Data
```typescript
import { getToken, getUser, clearAuth } from '@/lib/auth';

// Get current token
const token = getToken(); // Returns JWT string or null

// Get current user
const user = getUser(); // Returns User object or null

// Logout (clear all auth data)
clearAuth();
```

---

## 🧪 Testing URLs

### Local Development
- **App:** http://localhost:5173
- **Login:** http://localhost:5173/login
- **Test Utility:** http://localhost:5173/api-test

### Production (Vercel)
- **App:** https://sales-services-main.vercel.app
- **Login:** https://sales-services-main.vercel.app/login
- **Test Utility:** https://sales-services-main.vercel.app/api-test

### Backend (InfinityFree)
- **Base:** https://hrms1.free.nf
- **API:** https://hrms1.free.nf/api/
- **Test:** https://hrms1.free.nf/api/test_cors_live.php?i=1

---

## 🔧 Quick Commands

```bash
# Install dependencies
cd front-end
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
git add .
git commit -m "fix: InfinityFree integration complete"
git push origin main
```

---

## 🐛 Troubleshooting

### Error: "Network Error"
**Cause:** CORS issue or `Authorization: Bearer` being sent  
**Fix:** Check Network tab - ensure only `X-Auth-Token` is sent

### Error: "Server returned HTML"
**Cause:** Missing `?i=1` parameter  
**Fix:** Verify URL in Network tab ends with `?i=1`

### Error: "401 Unauthorized"
**Cause:** Invalid or expired token  
**Fix:** Login again or check token in localStorage

### No CORS headers
**Cause:** Backend configuration issue  
**Fix:** Verify backend returns proper CORS headers

---

## 📱 API Test Utility

**Access:** `/api-test` route

**Tests Available:**
1. **CORS Test** - Verifies InfinityFree returns JSON
2. **Login Test** - Tests authentication flow
3. **Profile Test** - Tests protected endpoint with token
4. **Dashboard Test** - Tests dashboard stats endpoint

**How to Use:**
1. Navigate to `/api-test`
2. Click "Run All Tests" button
3. View results (green = success, red = error)
4. Expand details for full request/response logs

---

## ✅ Deployment Checklist

- [x] All files modified and saved
- [x] Build completes successfully (`npm run build`)
- [x] No TypeScript errors
- [x] `.env` file configured correctly
- [x] Test utility accessible at `/api-test`
- [x] Ready to push to Git

---

## 📞 Quick Support

**Problem:** Login fails  
**Solution:** Check `/api-test` → Run "Login Test" → View error details

**Problem:** Protected routes fail  
**Solution:** Check console for detailed logs → Verify token exists

**Problem:** CORS errors  
**Solution:** Check Network tab → Verify `?i=1` is present → Check response is JSON

---

## 🎉 Success Indicators

✅ Login redirects to dashboard  
✅ No errors in browser console  
✅ Network requests show `X-Auth-Token` header  
✅ All URLs include `?i=1` parameter  
✅ Responses are JSON (not HTML)  
✅ API Test Utility shows all green

**If all above are true → Integration is working perfectly!**
