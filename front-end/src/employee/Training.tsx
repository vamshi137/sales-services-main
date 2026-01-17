import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Award,
  PlayCircle,
  FileText,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useAuth } from '@/contexts/AuthContext';

/* ---------------- MOCK DATA (API later) ---------------- */

const trainingStats = [
  { title: 'Assigned', value: 6, icon: BookOpen },
  { title: 'Completed', value: 3, icon: CheckCircle },
  { title: 'In Progress', value: 2, icon: Clock },
  { title: 'Certificates', value: 2, icon: Award },
];

const trainings = [
  {
    id: 'TRN001',
    title: 'POSH Training',
    category: 'Compliance',
    assignedOn: '2026-01-05',
    dueDate: '2026-01-20',
    progress: 100,
    status: 'completed',
    certificate: true,
  },
  {
    id: 'TRN002',
    title: 'Fire & Safety',
    category: 'Safety',
    assignedOn: '2026-01-08',
    dueDate: '2026-01-25',
    progress: 60,
    status: 'in-progress',
    certificate: false,
  },
  {
    id: 'TRN003',
    title: 'Cyber Security Awareness',
    category: 'IT',
    assignedOn: '2026-01-10',
    dueDate: '2026-01-30',
    progress: 0,
    status: 'not-started',
    certificate: false,
  },
];

/* ---------------- COMPONENT ---------------- */

const Training: React.FC = () => {
  const { user } = useAuth();
  const [selectedTraining, setSelectedTraining] = useState<any>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="badge-success">Completed</Badge>;
      case 'in-progress':
        return <Badge className="badge-warning">In Progress</Badge>;
      case 'not-started':
        return <Badge variant="secondary">Not Started</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Trainings</h1>
        <p className="text-muted-foreground">
          Track your assigned trainings and certifications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trainingStats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className="h-6 w-6 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trainings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Trainings</CardTitle>
          <CardDescription>Mandatory & optional trainings</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Training</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {trainings.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{t.title}</p>
                        <p className="text-sm text-muted-foreground">{t.id}</p>
                      </div>
                    </TableCell>

                    <TableCell>{t.category}</TableCell>

                    <TableCell>
                      {new Date(t.dueDate).toLocaleDateString('en-IN')}
                    </TableCell>

                    <TableCell className="w-[160px]">
                      <Progress value={t.progress} />
                      <p className="text-xs text-muted-foreground mt-1">
                        {t.progress}%
                      </p>
                    </TableCell>

                    <TableCell>{getStatusBadge(t.status)}</TableCell>

                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTraining(t)}
                      >
                        {t.status === 'completed' ? 'View' : 'Start'}
                        <PlayCircle className="h-4 w-4 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Training Details Dialog */}
      <Dialog open={!!selectedTraining} onOpenChange={() => setSelectedTraining(null)}>
        <DialogContent className="max-w-lg">
          {selectedTraining && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedTraining.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span>{selectedTraining.category}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Progress</span>
                  <span>{selectedTraining.progress}%</span>
                </div>

                <Progress value={selectedTraining.progress} />

                {selectedTraining.certificate && (
                  <Button className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Certificate
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Training;
