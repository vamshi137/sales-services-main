import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Employee, employeeAPI } from '@/lib/api';

const departments = ['All', 'Engineering', 'Sales', 'Operations', 'HR', 'Finance', 'Admin'];
const statuses = ['All', 'Active', 'On Leave', 'Inactive', 'Terminated'];

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  // Fetch employees from backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await employeeAPI.getAll();
        setEmployees(response.data.employees || response.data || []);
      } catch (err: any) {
        const errorMessage = err?.response?.data?.message || 'Failed to load employees';
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

    fetchEmployees();
  }, [toast]);

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      departmentFilter === 'All' || emp.department === departmentFilter;

    const matchesStatus =
      statusFilter === 'All' ||
      emp.status.toLowerCase() === statusFilter.toLowerCase().replace(' ', '-');

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="badge-success">Active</Badge>;
      case 'on-leave':
        return <Badge className="badge-warning">On Leave</Badge>;
      case 'inactive':
        return <Badge className="badge-destructive">Inactive</Badge>;
      case 'terminated':
        return <Badge variant="destructive">Terminated</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-muted-foreground">Manage your organization's workforce</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, email, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">
              Showing <strong>{filteredEmployees.length}</strong> of{' '}
              <strong>{employees.length}</strong> employees
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="card-hover overflow-hidden">
            <CardContent className="p-0">
              {/* Header with status */}
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 px-4 py-3 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">
                        {employee.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{employee.fullName}</h3>
                      <p className="text-sm text-muted-foreground">{employee.employeeId}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedEmployee(employee)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{employee.designation}</span>
                  {getStatusBadge(employee.status)}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{employee.workLocation}</span>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>Joined: {new Date(employee.dateOfJoining).toLocaleDateString('en-IN')}</span>
                  <span className="capitalize">{employee.employmentType}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Page 1 of 1
        </span>
        <div className="flex items-center gap-2">
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

      {/* Employee Details Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedEmployee && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">
                      {selectedEmployee.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    {selectedEmployee.fullName}
                    <p className="text-sm font-normal text-muted-foreground">
                      {selectedEmployee.employeeId} â€¢ {selectedEmployee.designation}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="personal" className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="employment">Employment</TabsTrigger>
                  <TabsTrigger value="identity">Identity</TabsTrigger>
                  <TabsTrigger value="statutory">Statutory</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Full Name</Label>
                      <p className="font-medium">{selectedEmployee.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Gender</Label>
                      <p className="font-medium">{selectedEmployee.gender}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Date of Birth</Label>
                      <p className="font-medium">
                        {new Date(selectedEmployee.dateOfBirth).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Blood Group</Label>
                      <p className="font-medium">{selectedEmployee.bloodGroup}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Marital Status</Label>
                      <p className="font-medium">{selectedEmployee.maritalStatus}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Phone</Label>
                      <p className="font-medium">{selectedEmployee.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-muted-foreground text-xs">Email</Label>
                      <p className="font-medium">{selectedEmployee.email}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-muted-foreground text-xs">Present Address</Label>
                      <p className="font-medium">{selectedEmployee.presentAddress}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-muted-foreground text-xs">Permanent Address</Label>
                      <p className="font-medium">{selectedEmployee.permanentAddress}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-muted-foreground text-xs">Emergency Contact</Label>
                      <p className="font-medium">{selectedEmployee.emergencyContact}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="employment" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Employee ID</Label>
                      <p className="font-medium">{selectedEmployee.employeeId}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Date of Joining</Label>
                      <p className="font-medium">
                        {new Date(selectedEmployee.dateOfJoining).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Department</Label>
                      <p className="font-medium">{selectedEmployee.department}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Designation</Label>
                      <p className="font-medium">{selectedEmployee.designation}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Grade</Label>
                      <p className="font-medium">{selectedEmployee.grade}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Employment Type</Label>
                      <p className="font-medium">{selectedEmployee.employmentType}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Reporting Manager</Label>
                      <p className="font-medium">{selectedEmployee.reportingManager}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Work Location</Label>
                      <p className="font-medium">{selectedEmployee.workLocation}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Shift Type</Label>
                      <p className="font-medium">{selectedEmployee.shiftType}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">Status</Label>
                      <div className="mt-1">{getStatusBadge(selectedEmployee.status)}</div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="identity" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">Aadhaar Number</Label>
                      <p className="font-medium">{selectedEmployee.aadhaarNumber}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">PAN Number</Label>
                      <p className="font-medium">{selectedEmployee.panNumber}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="statutory" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground text-xs">UAN Number</Label>
                      <p className="font-medium">{selectedEmployee.uanNumber}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">ESIC Number</Label>
                      <p className="font-medium">{selectedEmployee.esicNumber}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Fill in the employee details. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="personal" className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
              <TabsTrigger value="identity">Identity & KYC</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="Enter full name" />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="name@ssspl.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input id="dob" type="date" />
                </div>
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input id="emergencyContact" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="address" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="presentAddress">Present Address *</Label>
                  <Input id="presentAddress" placeholder="Enter present address" />
                </div>
                <div>
                  <Label htmlFor="permanentAddress">Permanent Address</Label>
                  <Input id="permanentAddress" placeholder="Enter permanent address" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="employment" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfJoining">Date of Joining *</Label>
                  <Input id="dateOfJoining" type="date" />
                </div>
                <div>
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                      <SelectItem value="fixed">Fixed Term</SelectItem>
                      <SelectItem value="project">Project Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.filter((d) => d !== 'All').map((dept) => (
                        <SelectItem key={dept} value={dept.toLowerCase()}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="designation">Designation *</Label>
                  <Input id="designation" placeholder="Enter designation" />
                </div>
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Input id="grade" placeholder="e.g., L3, L4" />
                </div>
                <div>
                  <Label htmlFor="reportingManager">Reporting Manager</Label>
                  <Input id="reportingManager" placeholder="Manager name" />
                </div>
                <div>
                  <Label htmlFor="workLocation">Work Location *</Label>
                  <Input id="workLocation" placeholder="e.g., Hyderabad" />
                </div>
                <div>
                  <Label htmlFor="shiftType">Shift Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="rotational">Rotational</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="identity" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                  <Input id="aadhaar" placeholder="XXXX XXXX XXXX" />
                </div>
                <div>
                  <Label htmlFor="pan">PAN Number *</Label>
                  <Input id="pan" placeholder="ABCDE1234F" />
                </div>
                <div>
                  <Label htmlFor="uan">UAN Number</Label>
                  <Input id="uan" placeholder="100XXXXXXXXX" />
                </div>
                <div>
                  <Label htmlFor="esic">ESIC Number</Label>
                  <Input id="esic" placeholder="ESIXXXXXXXX" />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-accent hover:bg-accent/90"
              onClick={() => {
                toast({
                  title: 'Employee created',
                  description: 'New employee has been added successfully.',
                });
                setIsAddDialogOpen(false);
              }}
            >
              Add Employee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Employees;
