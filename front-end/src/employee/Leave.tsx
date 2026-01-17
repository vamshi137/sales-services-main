import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { useAuth } from '@/contexts/AuthContext';

// Leave balance data
const leaveBalance = [
  { type: 'Casual Leave (CL)', total: 12, used: 4, balance: 8, color: 'bg-info' },
  { type: 'Sick Leave (SL)', total: 12, used: 2, balance: 10, color: 'bg-success' },
  { type: 'Earned Leave (EL)', total: 15, used: 5, balance: 10, color: 'bg-accent' },
  { type: 'Compensatory Off', total: 5, used: 1, balance: 4, color: 'bg-warning' },
];

// Leave requests
const leaveRequests = [
  {
    id: '1',
    leaveId: 'LV-2026-001',
    employeeId: 'SSSPL001',
    employeeName: 'Rajesh Kumar Singh',
    leaveType: 'Casual Leave',
    fromDate: '2026-01-15',
    toDate: '2026-01-17',
    days: 3,
    reason: 'Family function',
    status: 'pending',
    appliedOn: '2026-01-10',
  },
  {
    id: '2',
    leaveId: 'LV-2026-002',
    employeeId: 'SSSPL001',
    employeeName: 'Rajesh Kumar Singh',
    leaveType: 'Sick Leave',
    fromDate: '2026-01-08',
    toDate: '2026-01-08',
    days: 1,
    reason: 'Not feeling well',
    status: 'approved',
    appliedOn: '2026-01-07',
  },
  {
    id: '3',
    leaveId: 'LV-2026-003',
    employeeId: 'SSSPL002',
    employeeName: 'Priya Sharma',
    leaveType: 'Earned Leave',
    fromDate: '2026-01-20',
    toDate: '2026-01-25',
    days: 6,
    reason: 'Vacation',
    status: 'approved',
    appliedOn: '2026-01-05',
  },
];

const leaveTypes = [
  'Casual Leave (CL)',
  'Sick Leave (SL)',
  'Earned Leave (EL)',
  'Compensatory Off',
  'Maternity Leave',
  'Paternity Leave',
  'On Duty',
  'Educational Leave',
];

const Leave: React.FC = () => {
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<typeof leaveRequests[0] | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="badge-success">Approved</Badge>;
      case 'pending':
        return <Badge className="badge-warning">Pending</Badge>;
      case 'rejected':
        return <Badge className="badge-destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredRequests = leaveRequests.filter(
    (request) => statusFilter === 'all' || request.status === statusFilter
  );

  const handleApplyLeave = () => {
    toast({
      title: 'Leave Applied',
      description: 'Your leave request has been submitted for approval.',
    });
    setIsApplyDialogOpen(false);
  };

  const handleApprove = (id: string) => {
    toast({
      title: 'Leave Approved',
      description: 'The leave request has been approved.',
    });
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    toast({
      title: 'Leave Rejected',
      description: 'The leave request has been rejected.',
      variant: 'destructive',
    });
    setSelectedRequest(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">Apply and manage leave requests</p>
        </div>
        <Button onClick={() => setIsApplyDialogOpen(true)} className="bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Apply Leave
        </Button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveBalance.map((leave, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">{leave.type}</p>
                  <p className="text-3xl font-bold mt-1">{leave.balance}</p>
                  <p className="text-xs text-muted-foreground">days remaining</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${leave.color}`} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">{leave.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used</span>
                  <span className="font-medium">{leave.used}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full ${leave.color} rounded-full transition-all`}
                    style={{ width: `${(leave.used / leave.total) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved This Month</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-info/10">
              <Calendar className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Leaves</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leave Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>View and manage all leave applications</CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Leave ID</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{request.leaveId}</p>
                        <p className="text-sm text-muted-foreground">{request.appliedOn}</p>
                      </div>
                    </TableCell>
                    <TableCell>{request.leaveType}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(request.fromDate).toLocaleDateString('en-IN')}</p>
                        <p className="text-muted-foreground">
                          to {new Date(request.toDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{request.days} day{request.days > 1 ? 's' : ''}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm max-w-[200px] truncate">{request.reason}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
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

      {/* Apply Leave Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>
              Fill in the details below to submit your leave request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="leaveType">Leave Type *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromDate">From Date *</Label>
                <Input id="fromDate" type="date" />
              </div>
              <div>
                <Label htmlFor="toDate">To Date *</Label>
                <Input id="toDate" type="date" />
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Total days: <strong>0</strong> | Available balance: <strong>8</strong>
              </span>
            </div>

            <div>
              <Label htmlFor="reason">Reason *</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for leave..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="attachment">Attachment (Optional)</Label>
              <Input id="attachment" type="file" />
              <p className="text-xs text-muted-foreground mt-1">
                Upload supporting documents if any (medical certificate, etc.)
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyLeave} className="bg-accent hover:bg-accent/90">
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Request Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-lg">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>Leave Request Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {selectedRequest.employeeName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{selectedRequest.employeeName}</p>
                    <p className="text-sm text-muted-foreground">{selectedRequest.employeeId}</p>
                  </div>
                  {getStatusBadge(selectedRequest.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Leave Type</p>
                    <p className="font-medium">{selectedRequest.leaveType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{selectedRequest.days} day(s)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">From Date</p>
                    <p className="font-medium">
                      {new Date(selectedRequest.fromDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">To Date</p>
                    <p className="font-medium">
                      {new Date(selectedRequest.toDate).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  
                  
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="font-medium">{selectedRequest.reason}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Applied On</p>
                    <p className="font-medium">
                      {new Date(selectedRequest.appliedOn).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  
                </div>

                {selectedRequest.status === 'pending' && (user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager') && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleReject(selectedRequest.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      className="bg-success hover:bg-success/90"
                      onClick={() => handleApprove(selectedRequest.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leave;
