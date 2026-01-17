import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Building2, Lock, Mail, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const DEMO_CREDENTIALS = [
  { email: 'admin@ssspl.com', password: 'admin123', role: 'Admin', color: 'bg-red-500' },
  { email: 'hr@ssspl.com', password: 'hr123', role: 'HR', color: 'bg-purple-500' },
  { email: 'manager@ssspl.com', password: 'manager123', role: 'Manager', color: 'bg-blue-500' },
  { email: 'employee@ssspl.com', password: 'employee123', role: 'Employee', color: 'bg-green-500' },
  { email: 'accounts@ssspl.com', password: 'accounts123', role: 'Accounts', color: 'bg-amber-500' },
];

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isDemoMode } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || error.response?.data?.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/20" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
              <Building2 className="w-7 h-7 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SSSMS</h1>
              <p className="text-sm opacity-80">Sales & Services Management</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold leading-tight">
                Srinivasa Sales and Service 
                <br />
                Private Limited
              </h2>
              <p className="mt-4 text-lg opacity-80 max-w-md">
                Complete HR management solution for employee data, payroll, attendance, 
                leave management, and more.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-md">
              {['Employee Management', 'Payroll Processing', 'Leave Tracking', 'Performance Reviews'].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <span className="text-sm opacity-90">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm opacity-60">
            <p>Srinivasa Sales and Service Private Limited</p>
            <p>Somajiguda, Hyderabad - 500082</p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/10" />
        <div className="absolute top-32 -right-16 w-64 h-64 rounded-full bg-accent/5" />
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SSSMS</h1>
              <p className="text-xs text-muted-foreground">HR Management Portal</p>
            </div>
          </div>

          <Card className="border-0 shadow-none lg:shadow-lg lg:border">
            <CardHeader className="space-y-1 text-center lg:text-left">
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-sm text-accent hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-accent-foreground border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>

              {/* Demo Mode Credentials */}
              {isDemoMode && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-dashed">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Demo Accounts</span>
                    <Badge variant="secondary" className="text-xs">Dev Mode</Badge>
                  </div>
                  <div className="space-y-2">
                    {DEMO_CREDENTIALS.map((cred) => {
  const isEmployee = cred.role === 'Employee';

  return (
    <button
      key={cred.email}
      type="button"
      disabled={!isEmployee}
      onClick={() =>
        isEmployee && handleDemoLogin(cred.email, cred.password)
      }
      className={`w-full flex items-center justify-between p-2 text-left text-sm rounded-md transition-colors border
        ${
          isEmployee
            ? 'hover:bg-background hover:border-border'
            : 'opacity-50 cursor-not-allowed'
        }`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${cred.color}`} />
        <span className="font-medium">{cred.role}</span>
      </div>
      <span className="text-muted-foreground text-xs">{cred.email}</span>
    </button>
  );
})}

                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Click any account to auto-fill credentials
                  </p>
                </div>
              )}

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-accent hover:underline font-medium">
                  Contact HR
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            © 2026 Srinivasa Sales and Service Pvt Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
