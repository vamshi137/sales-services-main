/**
 * API Test Utility Component
 * For debugging InfinityFree backend integration
 * Tests CORS, authentication, and endpoint responses
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { authAPI, dashboardAPI } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'running';
  message: string;
  details?: any;
  timestamp?: string;
}

const ApiTestUtility: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: TestResult) => {
    setResults((prev) => {
      const existing = prev.find((r) => r.name === result.name);
      if (existing) {
        return prev.map((r) => (r.name === result.name ? { ...result, timestamp: new Date().toISOString() } : r));
      }
      return [...prev, { ...result, timestamp: new Date().toISOString() }];
    });
  };

  const testCorsLive = async () => {
    addResult({ name: 'CORS Test', status: 'running', message: 'Testing CORS with test_cors_live.php...' });
    
    try {
      const response = await fetch('https://hrms1.free.nf/api/test_cors_live.php?i=1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        addResult({
          name: 'CORS Test',
          status: 'success',
          message: `✅ CORS working! Status: ${response.status}`,
          details: data,
        });
      } else {
        addResult({
          name: 'CORS Test',
          status: 'error',
          message: `❌ CORS test failed with status ${response.status}`,
          details: data,
        });
      }
    } catch (error: any) {
      addResult({
        name: 'CORS Test',
        status: 'error',
        message: `❌ CORS Error: ${error.message}`,
        details: error,
      });
    }
  };

  const testLogin = async () => {
    addResult({ name: 'Login Test', status: 'running', message: 'Testing login endpoint...' });
    
    try {
      // Use demo credentials - replace with actual test credentials
      const response = await authAPI.login('test@example.com', 'password123');
      
      addResult({
        name: 'Login Test',
        status: 'success',
        message: '✅ Login successful!',
        details: {
          token: response.data.token ? '✓ Token received' : '✗ No token',
          refreshToken: response.data.refreshToken ? '✓ Refresh token received' : '✗ No refresh token',
          user: response.data.user ? '✓ User data received' : '✗ No user data',
        },
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      const statusCode = error?.response?.status || 'N/A';
      
      addResult({
        name: 'Login Test',
        status: 'error',
        message: `❌ Login failed: ${errorMessage} (Status: ${statusCode})`,
        details: {
          error: errorMessage,
          status: statusCode,
          response: error?.response?.data,
          config: {
            url: error?.config?.url,
            headers: error?.config?.headers,
          },
        },
      });
    }
  };

  const testProfile = async () => {
    addResult({ name: 'Profile Test', status: 'running', message: 'Testing profile endpoint...' });
    
    const token = getToken();
    if (!token) {
      addResult({
        name: 'Profile Test',
        status: 'error',
        message: '❌ No auth token found. Please login first.',
      });
      return;
    }

    try {
      const response = await authAPI.getProfile();
      
      addResult({
        name: 'Profile Test',
        status: 'success',
        message: '✅ Profile loaded successfully with X-Auth-Token!',
        details: {
          user: response.data.user,
          tokenUsed: '✓ X-Auth-Token header',
        },
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      const statusCode = error?.response?.status || 'N/A';
      
      addResult({
        name: 'Profile Test',
        status: 'error',
        message: `❌ Profile failed: ${errorMessage} (Status: ${statusCode})`,
        details: {
          error: errorMessage,
          status: statusCode,
          response: error?.response?.data,
          headers: error?.response?.headers,
        },
      });
    }
  };

  const testDashboard = async () => {
    addResult({ name: 'Dashboard Test', status: 'running', message: 'Testing dashboard stats...' });
    
    const token = getToken();
    if (!token) {
      addResult({
        name: 'Dashboard Test',
        status: 'error',
        message: '❌ No auth token found. Please login first.',
      });
      return;
    }

    try {
      const response = await dashboardAPI.getStats();
      
      addResult({
        name: 'Dashboard Test',
        status: 'success',
        message: '✅ Dashboard stats loaded successfully!',
        details: response.data,
      });
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Unknown error';
      const statusCode = error?.response?.status || 'N/A';
      
      addResult({
        name: 'Dashboard Test',
        status: 'error',
        message: `❌ Dashboard failed: ${errorMessage} (Status: ${statusCode})`,
        details: {
          error: errorMessage,
          status: statusCode,
          response: error?.response?.data,
        },
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    // Run tests sequentially
    await testCorsLive();
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    await testLogin();
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    await testProfile();
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    await testDashboard();
    
    setIsRunning(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>🔧 API Test Utility</CardTitle>
          <CardDescription>
            Test InfinityFree backend integration: CORS, Authentication, and Protected Endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Control Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={runAllTests} disabled={isRunning} variant="default">
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                'Run All Tests'
              )}
            </Button>
            <Button onClick={testCorsLive} disabled={isRunning} variant="outline">
              Test CORS
            </Button>
            <Button onClick={testLogin} disabled={isRunning} variant="outline">
              Test Login
            </Button>
            <Button onClick={testProfile} disabled={isRunning} variant="outline">
              Test Profile
            </Button>
            <Button onClick={testDashboard} disabled={isRunning} variant="outline">
              Test Dashboard
            </Button>
            <Button onClick={clearResults} disabled={isRunning} variant="ghost">
              Clear Results
            </Button>
          </div>

          {/* Current Token Status */}
          <Alert>
            <AlertDescription>
              <strong>Current Token:</strong>{' '}
              {getToken() ? (
                <span className="text-green-600">✓ Found ({getToken()?.substring(0, 20)}...)</span>
              ) : (
                <span className="text-red-600">✗ Not found (login required)</span>
              )}
            </AlertDescription>
          </Alert>

          {/* Test Results */}
          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Test Results</h3>
              {results.map((result, index) => (
                <Card key={index} className="border-l-4" style={{
                  borderLeftColor: 
                    result.status === 'success' ? '#22c55e' :
                    result.status === 'error' ? '#ef4444' :
                    result.status === 'running' ? '#3b82f6' : '#94a3b8'
                }}>
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{result.name}</h4>
                          {result.timestamp && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                        {result.details && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                              View Details
                            </summary>
                            <pre className="mt-2 p-2 bg-slate-100 rounded overflow-auto max-h-60">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Instructions */}
          {results.length === 0 && (
            <Alert>
              <AlertDescription>
                <strong>Instructions:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                  <li>Click "Run All Tests" to test all endpoints</li>
                  <li>Or click individual test buttons</li>
                  <li>CORS test checks if InfinityFree returns JSON (not HTML)</li>
                  <li>Login test validates credentials and stores token</li>
                  <li>Profile/Dashboard tests check protected endpoints with X-Auth-Token</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTestUtility;
