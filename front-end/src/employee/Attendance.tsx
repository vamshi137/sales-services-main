import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Timer,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { useAuth } from '@/contexts/AuthContext';

/* ================= MOCK ATTENDANCE DATA ================= */

const attendanceData = [
  {
    id: '1',
    date: '2026-01-12',
    inTime: '09:05',
    outTime: '18:30',
    totalHours: 9.42,
    status: 'present',
    lateBy: 5,
    overtime: 30,
  },
  {
    id: '2',
    date: '2026-01-11',
    inTime: '09:45',
    outTime: '18:15',
    totalHours: 8.5,
    status: 'late',
    lateBy: 45,
    overtime: 15,
  },
  {
    id: '3',
    date: '2026-01-10',
    inTime: '-',
    outTime: '-',
    totalHours: 0,
    status: 'absent',
    lateBy: 0,
    overtime: 0,
  },
  {
    id: '4',
    date: '2026-01-09',
    inTime: '-',
    outTime: '-',
    totalHours: 0,
    status: 'on-leave',
    lateBy: 0,
    overtime: 0,
  },
];

/* ================= STATS (UNCHANGED) ================= */

const statsCards = [
  {
    title: 'Present',
    value: '231',
    percentage: '93.1%',
    icon: CheckCircle2,
    color: 'bg-success/10 text-success',
  },
  {
    title: 'Absent',
    value: '8',
    percentage: '3.2%',
    icon: XCircle,
    color: 'bg-destructive/10 text-destructive',
  },
  {
    title: 'Late Arrivals',
    value: '12',
    percentage: '4.8%',
    icon: Timer,
    color: 'bg-warning/10 text-warning',
  },
  {
    title: 'On Leave',
    value: '9',
    percentage: '3.6%',
    icon: Calendar,
    color: 'bg-info/10 text-info',
  },
];

/* ================= DATE FORMAT HELPER ================= */

const formatDateDDMMYYYY = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const Attendance: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePunchIn = () => {
    toast({
      title: 'Punched In Successfully',
      description: `You have punched in at ${new Date().toLocaleTimeString('en-IN')}`,
    });
  };

  const handlePunchOut = () => {
    toast({
      title: 'Punched Out Successfully',
      description: `You have punched out at ${new Date().toLocaleTimeString('en-IN')}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge className="badge-success">Present</Badge>;
      case 'absent':
        return <Badge className="badge-destructive">Absent</Badge>;
      case 'late':
        return <Badge className="badge-warning">Late</Badge>;
      case 'on-leave':
        return <Badge variant="secondary">On Leave</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  /* ================= FILTER FIX ================= */

  const filteredData = attendanceData.filter((record) => {
    const matchesDate = selectedDate ? record.date === selectedDate : true;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesDate && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Track and manage daily attendance</p>
        </div>
        
      </div>

      {/* Punch In / Out */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <Clock className="h-8 w-8 text-accent" />
              <div>
                <h2 className="text-xl font-semibold">
                  {new Date().toLocaleDateString('en-IN', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </h2>
                <p className="text-3xl font-bold text-accent">
                  {new Date().toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handlePunchIn} className="bg-success hover:bg-success/90" disabled>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Punch In
              </Button>
              <Button onClick={handlePunchOut} className="bg-destructive hover:bg-destructive/90">
                <XCircle className="h-4 w-4 mr-2" />
                Punch Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats (UNCHANGED) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.percentage}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
  <CardHeader className="pb-2">
    <CardTitle className="text-base font-semibold">
      Filter Attendance
    </CardTitle>
  </CardHeader>

  <CardContent className="p-4">
    <div className="flex flex-col sm:flex-row sm:items-end gap-3">
      
      {/* Date Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">
          Date
        </label>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-[160px]"
        />
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-muted-foreground">
          Status
        </label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="present">Present</SelectItem>
            <SelectItem value="absent">Absent</SelectItem>
            <SelectItem value="late">Late</SelectItem>
            <SelectItem value="on-leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Button */}
      {selectedDate && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start sm:self-end"
          onClick={() => setSelectedDate('')}
        >
          Clear
        </Button>
      )}
    </div>
  </CardContent>
</Card>


      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance Register</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Date</TableHead>
                  <TableHead>In Time</TableHead>
                  <TableHead>Out Time</TableHead>
                  <TableHead>Working Hours</TableHead>
                  <TableHead>Late By</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredData.map((record) => {
                  const day = new Date(record.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                  });

                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <p className="font-medium">
                          {formatDateDDMMYYYY(record.date)}
                        </p>
                        <p className="text-sm text-muted-foreground">{day}</p>
                      </TableCell>
                      <TableCell>{record.inTime}</TableCell>
                      <TableCell>{record.outTime}</TableCell>
                      <TableCell>
                        {record.totalHours > 0
                          ? `${record.totalHours.toFixed(1)}h`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {record.lateBy > 0 ? (
                          <span className="text-warning">{record.lateBy} min</span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        {record.overtime > 0 ? (
                          <span className="text-success">{record.overtime} min</span>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">
              Showing {filteredData.length} records
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
