import React from 'react';
import { User, Mail, Briefcase, Calendar, MapPin, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  // Safety guard
  if (!user) {
    return <div className="p-6 text-muted-foreground">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
          {user.name?.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">{user.role}</p>
          <Badge className="mt-1">Active</Badge>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Employee ID</p>
              <p className="font-medium">{user.employeeId || 'EMP001'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-medium">{user.department || 'General'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Joining Date</p>
              <p className="font-medium">01 Jan 2024</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Reporting Manager</p>
              <p className="font-medium">HR Manager</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Work Location</p>
              <p className="font-medium">Hyderabad</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Details */}
      <Card>
        <CardHeader>
          <CardTitle>Work Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Employment Type</p>
            <p className="font-medium">Full Time</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Shift</p>
            <p className="font-medium">General (9 AM - 6 PM)</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className="badge-success">Active</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
