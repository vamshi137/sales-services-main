import React, { useState } from 'react';
import {
  AlertTriangle,
  Plus,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  MessageSquare,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

/* ---------------- MOCK DATA ---------------- */

const grievances = [
  {
    id: 'GRV-001',
    type: 'Payroll',
    priority: 'high',
    submittedOn: '2026-01-05',
    status: 'in-review',
    confidential: false,
    description: 'Salary credited with incorrect deductions.',
    comments: [
      { sender: 'HR', message: 'We are reviewing this.', date: '2026-01-06' },
    ],
  },
  {
    id: 'GRV-002',
    type: 'Workplace',
    priority: 'medium',
    submittedOn: '2026-01-02',
    status: 'resolved',
    confidential: true,
    description: 'Issue with team communication.',
    comments: [
      { sender: 'HR', message: 'Resolved after discussion.', date: '2026-01-04' },
    ],
  },
];

/* ---------------- COMPONENT ---------------- */

const Grievance: React.FC = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<typeof grievances[0] | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="secondary">Submitted</Badge>;
      case 'in-review':
        return <Badge className="badge-warning">In Review</Badge>;
      case 'resolved':
        return <Badge className="badge-success">Resolved</Badge>;
      case 'closed':
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="badge-destructive">High</Badge>;
      case 'medium':
        return <Badge className="badge-warning">Medium</Badge>;
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Grievance</h1>
          <p className="text-muted-foreground">
            Raise concerns and track resolution status
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Raise Grievance
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Raised</p>
              <p className="text-2xl font-bold">{grievances.length}</p>
            </div>
            <MessageSquare className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Review</p>
              <p className="text-2xl font-bold">
                {grievances.filter(g => g.status === 'in-review').length}
              </p>
            </div>
            <Clock className="h-6 w-6 text-warning" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resolved</p>
              <p className="text-2xl font-bold">
                {grievances.filter(g => g.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-success" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Confidential</p>
              <p className="text-2xl font-bold">
                {grievances.filter(g => g.confidential).length}
              </p>
            </div>
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </CardContent>
        </Card>
      </div>

      {/* Grievance Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Grievances</CardTitle>
          <CardDescription>All grievances raised by you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Submitted On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grievances.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.id}</TableCell>
                    <TableCell>{g.type}</TableCell>
                    <TableCell>{getPriorityBadge(g.priority)}</TableCell>
                    <TableCell>
                      {new Date(g.submittedOn).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>{getStatusBadge(g.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedGrievance(g)}
                      >
                        View
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Raise Grievance Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Raise Grievance</DialogTitle>
            <DialogDescription>
              Submit your concern confidentially
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Grievance Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payroll">Payroll</SelectItem>
                <SelectItem value="workplace">Workplace</SelectItem>
                <SelectItem value="manager">Manager Issue</SelectItem>
                <SelectItem value="policy">HR Policy</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>

            <Textarea placeholder="Describe your grievance..." rows={4} />

            <Input type="file" />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({ title: 'Grievance Submitted' });
                setIsDialogOpen(false);
              }}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Grievance Dialog */}
      <Dialog open={!!selectedGrievance} onOpenChange={() => setSelectedGrievance(null)}>
        <DialogContent className="max-w-lg">
          {selectedGrievance && (
            <>
              <DialogHeader>
                <DialogTitle>Grievance Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(selectedGrievance.status)}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedGrievance.description}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Comments</p>
                  {selectedGrievance.comments.map((c, i) => (
                    <div key={i} className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-medium">{c.sender}</p>
                      <p className="text-sm">{c.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{c.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Grievance;
