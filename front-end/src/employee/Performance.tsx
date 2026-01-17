import React from 'react';
import {
  Star,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Target,
  MessageSquare,
  Calendar,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

/* =====================
   MOCK DATA (API later)
===================== */

const performanceSummary = {
  rating: 4.2,
  status: 'On Track',
  lastReviewed: '2026-01-15',
  reviewer: 'Reporting Manager',
};

const kpis = [
  { title: 'Attendance Score', value: 96, icon: CheckCircle2, color: 'bg-success/10 text-success' },
  { title: 'Task Completion', value: 88, icon: TrendingUp, color: 'bg-info/10 text-info' },
  { title: 'Quality Score', value: 91, icon: Star, color: 'bg-warning/10 text-warning' },
  { title: 'Productivity', value: 85, icon: Target, color: 'bg-primary/10 text-primary' },
];

const goals = [
  { title: 'Reduce Late Arrivals', progress: 90, status: 'Achieved' },
  { title: 'Complete Safety Training', progress: 70, status: 'On Track' },
  { title: 'Improve Task Quality', progress: 55, status: 'In Progress' },
];

const feedback = [
  {
    date: '2026-01-10',
    from: 'Manager',
    type: 'positive',
    comment: 'Good improvement in punctuality this month.',
  },
  {
    date: '2025-12-20',
    from: 'HR',
    type: 'suggestion',
    comment: 'Focus on documentation quality.',
  },
];

const performanceHistory = [
  { period: 'Q3 2025', rating: 3.8, remarks: 'Needs improvement' },
  { period: 'Q4 2025', rating: 4.2, remarks: 'Good progress' },
];

/* =====================
   COMPONENT
===================== */

const EmployeePerformance: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Performance</h1>
        <p className="text-muted-foreground">
          Track your goals, feedback, and performance progress
        </p>
      </div>

      {/* Performance Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-accent/20">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Overall Rating</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-4xl font-bold">{performanceSummary.rating}</span>
              <span className="text-muted-foreground">/ 5</span>
              <Star className="h-5 w-5 text-warning fill-warning" />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Reviewed on {new Date(performanceSummary.lastReviewed).toLocaleDateString('en-IN')}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Badge className="badge-success w-fit">{performanceSummary.status}</Badge>
            <p className="text-sm text-muted-foreground">
              Reviewer: {performanceSummary.reviewer}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{kpi.title}</p>
                <p className="text-2xl font-bold mt-1">{kpi.value}%</p>
              </div>
              <div className={`p-3 rounded-xl ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Goals */}
      <Card>
        <CardHeader>
          <CardTitle>My Goals</CardTitle>
          <CardDescription>Current performance objectives</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {goals.map((goal, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-medium">{goal.title}</p>
                <Badge
                  variant="secondary"
                  className={
                    goal.status === 'Achieved'
                      ? 'bg-success/10 text-success'
                      : goal.status === 'On Track'
                      ? 'bg-info/10 text-info'
                      : 'bg-warning/10 text-warning'
                  }
                >
                  {goal.status}
                </Badge>
              </div>
              <Progress value={goal.progress} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Feedback & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {feedback.map((f, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40">
                {f.type === 'positive' ? (
                  <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium">{f.comment}</p>
                  <p className="text-xs text-muted-foreground">
                    {f.from} • {new Date(f.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance History */}
        <Card>
          <CardHeader>
            <CardTitle>Performance History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {performanceHistory.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium">{p.period}</p>
                  <p className="text-xs text-muted-foreground">{p.remarks}</p>
                </div>
                <Badge variant="secondary">{p.rating} / 5</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default EmployeePerformance;
