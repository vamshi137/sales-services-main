import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Wallet,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const attendanceSummary = {
  todayStatus: 'Present',
  punchIn: '09:42 AM',
  workingHours: '6h 15m',
  monthlyAttendance: 92,
};

const leaveBalances = [
  { type: 'Casual Leave', used: 4, total: 12 },
  { type: 'Sick Leave', used: 1, total: 6 },
  { type: 'Earned Leave', used: 3, total: 15 },
];

const recentActivities = [
  { title: 'Punch In Successful', time: 'Today at 9:42 AM', status: 'success' },
  { title: 'Leave Approved (CL)', time: 'Yesterday', status: 'success' },
  { title: 'Late Mark Warning', time: '2 days ago', status: 'warning' },
];

const upcomingEvents = [
  { title: 'Republic Day', date: '26 Jan', type: 'Holiday' },
  { title: 'Safety Training', date: '30 Jan', type: 'Training' },
];

const quickActions = [
  { label: 'Punch In / Out', icon: Clock },
  { label: 'Apply Leave', icon: Calendar },
  { label: 'View Payslip', icon: Wallet },
  { label: 'My Reports', icon: FileText },
];

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome, <span className="text-primary">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <UserCheck className="text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Today Status</p>
                <p className="font-semibold">{attendanceSummary.todayStatus}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <Clock className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Punch In</p>
                <p className="font-semibold">{attendanceSummary.punchIn}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-info" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Attendance</p>
                <p className="font-semibold">{attendanceSummary.monthlyAttendance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🔹 ADDED STATS ABOVE LEAVE BALANCE (ONLY ADDITION) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <Clock className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Working Hours Today</p>
                <p className="font-semibold">{attendanceSummary.workingHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Attendance %</p>
                <p className="font-semibold">{attendanceSummary.monthlyAttendance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <Calendar className="text-info" />
              <div>
                <p className="text-sm text-muted-foreground">Leaves Used</p>
                <p className="font-semibold">
                  {leaveBalances.reduce((acc, l) => acc + l.used, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Balance */}
      <Card>
        <CardHeader>
          <CardTitle>My Leave Balance</CardTitle>
          <CardDescription>Current year</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {leaveBalances.map((leave, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span>{leave.type}</span>
                <span>
                  {leave.total - leave.used} / {leave.total}
                </span>
              </div>
              <Progress value={((leave.total - leave.used) / leave.total) * 100} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Activities & Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                {a.status === 'success' ? (
                  <CheckCircle2 className="text-success h-4 w-4" />
                ) : (
                  <AlertCircle className="text-warning h-4 w-4" />
                )}
                <div>
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((e, i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{e.title}</p>
                  <Badge variant="secondary">{e.type}</Badge>
                </div>
                <span className="text-sm font-semibold">{e.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((a, i) => (
            <Button key={i} variant="outline" className="flex gap-2">
              <a.icon className="h-4 w-4" />
              {a.label}
            </Button>
          ))}
        </CardContent>
      </Card> */}
    </div>
  );
};

export default EmployeeDashboard;
