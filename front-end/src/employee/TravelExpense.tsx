import React, { useState } from 'react';
import {
  Plane,
  Wallet,
  CheckCircle2,
  Clock,
  Plus,
  ChevronRight,
  FileText,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const travelRequests = [
  {
    id: 'TRV-001',
    purpose: 'Client Meeting',
    route: 'Hyderabad → Bengaluru',
    dates: '10 Jan – 12 Jan 2026',
    mode: 'Flight',
    status: 'approved',
  },
  {
    id: 'TRV-002',
    purpose: 'Training',
    route: 'Hyderabad → Chennai',
    dates: '20 Jan – 22 Jan 2026',
    mode: 'Train',
    status: 'pending',
  },
];

const expenses = [
  {
    id: 'EXP-101',
    travelId: 'TRV-001',
    category: 'Hotel',
    amount: 4500,
    date: '2026-01-11',
    status: 'approved',
  },
  {
    id: 'EXP-102',
    travelId: 'TRV-001',
    category: 'Food',
    amount: 1200,
    date: '2026-01-12',
    status: 'submitted',
  },
];

/* ---------------- COMPONENT ---------------- */

const TravelExpense: React.FC = () => {
  const { toast } = useToast();
  const [isTravelDialogOpen, setIsTravelDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="badge-success">Approved</Badge>;
      case 'pending':
        return <Badge className="badge-warning">Pending</Badge>;
      case 'submitted':
        return <Badge variant="secondary">Submitted</Badge>;
      case 'reimbursed':
        return <Badge className="badge-info">Reimbursed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Travel & Expense</h1>
          <p className="text-muted-foreground">
            Manage your travel requests and expense claims
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsTravelDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Travel
          </Button>
          <Button onClick={() => setIsExpenseDialogOpen(true)}>
            <Wallet className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Trips</p>
              <p className="text-2xl font-bold">1</p>
            </div>
            <Plane className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending Expenses</p>
              <p className="text-2xl font-bold">₹5,700</p>
            </div>
            <Clock className="h-6 w-6 text-warning" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-2xl font-bold">₹4,500</p>
            </div>
            <CheckCircle2 className="h-6 w-6 text-success" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reimbursed</p>
              <p className="text-2xl font-bold">₹3,200</p>
            </div>
            <Wallet className="h-6 w-6 text-info" />
          </CardContent>
        </Card>
      </div>

      {/* Travel Requests */}
      <Card>
        <CardHeader>
          <CardTitle>My Travel Requests</CardTitle>
          <CardDescription>Track all your travel approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Travel ID</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {travelRequests.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.id}</TableCell>
                    <TableCell>{t.purpose}</TableCell>
                    <TableCell>{t.route}</TableCell>
                    <TableCell>{t.dates}</TableCell>
                    <TableCell>{t.mode}</TableCell>
                    <TableCell>{getStatusBadge(t.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Expense Claims */}
      <Card>
        <CardHeader>
          <CardTitle>My Expense Claims</CardTitle>
          <CardDescription>Submitted and reimbursed expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Expense ID</TableHead>
                  <TableHead>Trip</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.id}</TableCell>
                    <TableCell>{e.travelId}</TableCell>
                    <TableCell>{e.category}</TableCell>
                    <TableCell>₹{e.amount}</TableCell>
                    <TableCell>
                      {new Date(e.date).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell>{getStatusBadge(e.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Apply Travel Dialog */}
      <Dialog open={isTravelDialogOpen} onOpenChange={setIsTravelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Travel Request</DialogTitle>
            <DialogDescription>Submit travel for approval</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input placeholder="Purpose of travel" />
            <Input placeholder="From → To" />
            <div className="grid grid-cols-2 gap-4">
              <Input type="date" />
              <Input type="date" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Travel Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
                <SelectItem value="cab">Cab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsTravelDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({ title: 'Travel Request Submitted' });
                setIsTravelDialogOpen(false);
              }}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
            <DialogDescription>Submit expense for reimbursement</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Trip" />
              </SelectTrigger>
              <SelectContent>
                {travelRequests.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Expense Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hotel">Hotel</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="misc">Misc</SelectItem>
              </SelectContent>
            </Select>

            <Input type="number" placeholder="Amount" />
            <Input type="date" />
            <Input type="file" />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsExpenseDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({ title: 'Expense Submitted' });
                setIsExpenseDialogOpen(false);
              }}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TravelExpense;
