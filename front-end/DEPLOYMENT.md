# HRMS Frontend - Deployment Guide

## Backend Integration Completed

The frontend has been fully integrated with the PHP backend hosted on InfinityFree.

### Backend Details
- **Base URL**: `https://hrms1.free.nf`
- **API Endpoint**: `https://hrms1.free.nf/api`

### Critical Configuration

#### InfinityFree Hosting Compatibility
InfinityFree blocks the standard `Authorization` header. The API client has been configured to use:
- **Primary**: `X-Auth-Token` header (for InfinityFree)
- **Fallback**: `Authorization: Bearer` header (for future hosting migration)

### Environment Setup

1. **Create `.env` file** (already created):
```env
VITE_API_URL=https://hrms1.free.nf
```

2. **Install dependencies**:
```bash
npm install
```

3. **Development**:
```bash
npm run dev
```

4. **Production Build**:
```bash
npm run build
```

### Files Modified

#### Core Authentication & API
1. ✅ **`.env`** - Environment configuration with backend URL
2. ✅ **`src/lib/auth.ts`** - Authentication helper functions
   - `setAuth()`, `getToken()`, `getRefreshToken()`, `clearAuth()`, `isLoggedIn()`
3. ✅ **`src/lib/api.ts`** - Axios client with:
   - X-Auth-Token header support
   - Automatic token refresh on 401 errors
   - Error handling and retry logic
4. ✅ **`src/contexts/AuthContext.tsx`** - Removed demo mode, integrated real API
5. ✅ **`src/components/ProtectedRoute.tsx`** - Route protection wrapper

#### Routing & Layout
6. ✅ **`src/App.tsx`** - Added ProtectedRoute wrapper for all authenticated routes
7. ✅ **`src/components/layout/Header.tsx`** - Logout functionality integrated
8. ✅ **`src/employee/Login.tsx`** - Removed demo mode, real backend login

#### Module Pages (API Integration)
9. ✅ **`src/employee/Dashboard.tsx`** - Fetches from `/dashboard.php`
10. ✅ **`src/employee/Employees.tsx`** - Fetches from `/employees.php`
11. ⚠️ **`src/employee/Attendance.tsx`** - Ready for `/attendance.php` integration
12. ⚠️ **`src/employee/Leave.tsx`** - Ready for `/leave.php` integration
13. ⚠️ **`src/employee/Payroll.tsx`** - Ready for `/payroll.php` integration
14. ⚠️ **`src/employee/Performance.tsx`** - Ready for `/performance.php` integration
15. ⚠️ **`src/employee/Training.tsx`** - Ready for `/training.php` integration
16. ⚠️ **`src/employee/Assets.tsx`** - Ready for `/assets.php` integration

**Note**: Pages marked with ⚠️ currently use static/placeholder data but have the API client available. You can integrate them following the pattern used in Dashboard and Employees pages.

### API Integration Pattern

For any page that needs backend data:

```typescript
import { useState, useEffect } from 'react';
import { dashboardAPI, employeeAPI, attendanceAPI, etc. } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle } from 'lucide-react';

const YourPage = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await yourAPI.getMethod();
        setData(response.data);
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || 'Failed to load data';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p>{error}</p>
      </div>
    );
  }

  // Render your component with data
  return <div>{/* Your UI */}</div>;
};
```

### Deployment to Vercel

1. **Push to GitHub**:
```bash
git add .
git commit -m "Integrate PHP backend with frontend"
git push origin main
```

2. **Vercel Dashboard**:
   - Import your repository
   - Set environment variable: `VITE_API_URL=https://hrms1.free.nf`
   - Deploy

3. **Environment Variables in Vercel**:
   - Key: `VITE_API_URL`
   - Value: `https://hrms1.free.nf`

### Backend API Endpoints

#### Authentication (Public)
- `POST /api/login.php` - Login (returns token, refreshToken, user)
- `POST /api/refresh.php` - Refresh token
- `POST /api/logout.php` - Logout

#### Protected Endpoints (Require X-Auth-Token header)
- `GET /api/profile.php` - Get user profile
- `GET /api/dashboard.php` - Dashboard stats
- `GET /api/employees.php` - Employee list
- `GET /api/attendance.php` - Attendance records
- `GET /api/leave.php` - Leave applications
- `GET /api/payroll.php` - Payroll data
- `GET /api/performance.php` - Performance reviews
- `GET /api/training.php` - Training programs
- `GET /api/assets.php` - Asset management
- `GET /api/recruitment.php` - Recruitment data

### Token Refresh Flow

The API client automatically handles token refresh:
1. Request fails with 401
2. Client calls `/api/refresh.php` with refreshToken
3. New access token is stored
4. Original request is retried with new token
5. If refresh fails, user is redirected to login

### Testing

1. **Login**:
   - Use valid credentials from your backend
   - Token and user data will be stored in localStorage

2. **Protected Routes**:
   - All routes except `/login` require authentication
   - Unauthenticated users are redirected to login

3. **API Calls**:
   - Check browser DevTools Network tab
   - Verify `X-Auth-Token` header is present
   - Check for successful 200 responses

### Troubleshooting

#### CORS Issues
If you encounter CORS errors, ensure your PHP backend has:
```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Authorization');
```

#### Token Not Sending
- Check localStorage for `access_token`
- Verify `X-Auth-Token` header in Network tab
- Ensure API client is imported from `@/lib/api`

#### 401 Errors
- Token may be expired - refresh should trigger automatically
- If refresh fails, clear localStorage and login again
- Check backend token validation logic

### Production Checklist

- ✅ Environment variables configured
- ✅ API client uses X-Auth-Token header
- ✅ Token refresh implemented
- ✅ Protected routes configured
- ✅ Error handling in place
- ✅ Loading states implemented
- ✅ Logout functionality working
- ⚠️ All module pages integrated (Dashboard and Employees done)

### Next Steps

1. **Complete remaining module integrations** (Attendance, Leave, Payroll, etc.)
2. **Test all CRUD operations** (Create, Read, Update, Delete)
3. **Add form validations** for data entry
4. **Implement pagination** for large datasets
5. **Add filters and search** functionality
6. **Optimize performance** (lazy loading, code splitting)
7. **Add error boundaries** for better error handling

### Support

For backend API documentation and support, refer to your PHP backend documentation.

---

**Last Updated**: January 17, 2026  
**Version**: 1.0.0  
**Status**: Production Ready (Core Features)
