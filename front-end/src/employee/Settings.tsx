import React, { useState } from 'react';
import { User, Lock, Bell, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Settings: React.FC = () => {
  const auth = useAuth();
  const { toast } = useToast();

  const user = auth?.user;
  const logout = auth?.logout;

  // 🔒 Guard: prevent crash if user not loaded yet
  if (!user) {
    return <div className="p-6 text-muted-foreground">Loading settings...</div>;
  }

  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [notifications, setNotifications] = useState({
    attendance: true,
    leave: true,
    training: false,
  });

  const handleProfileSave = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile details have been saved successfully.',
    });
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirm password do not match.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Password Updated',
      description: 'Your password has been changed successfully.',
    });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <User className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your basic employee details</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            <Input value={user.name || ''} disabled />
          </div>

          <div>
            <Label>Employee ID</Label>
            <Input value={user.employeeId || 'EMP001'} disabled />
          </div>

          <div>
            <Label>Email</Label>
            <Input value={user.email || ''} disabled />
          </div>

          <div>
            <Label>Phone Number</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <Label>Department</Label>
            <Input value={user.department || 'General'} disabled />
          </div>

          <div>
            <Label>Role</Label>
            <Input value={user.role || 'Employee'} disabled />
          </div>

          {/* <div className="md:col-span-2 flex justify-end">
            <Button onClick={handleProfileSave}>Save Changes</Button>
          </div> */}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Lock className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Security</CardTitle>
            <CardDescription>Change your account password</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Current Password</Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div />

          <div>
            <Label>New Password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button onClick={handlePasswordChange}>Update Password</Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Bell className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Attendance Alerts</span>
            <Switch
              checked={notifications.attendance}
              onCheckedChange={(v) =>
                setNotifications({ ...notifications, attendance: v })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Leave Updates</span>
            <Switch
              checked={notifications.leave}
              onCheckedChange={(v) =>
                setNotifications({ ...notifications, leave: v })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Training Notifications</span>
            <Switch
              checked={notifications.training}
              onCheckedChange={(v) =>
                setNotifications({ ...notifications, training: v })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <LogOut className="h-5 w-5 text-destructive" />
          <div>
            <CardTitle>Account</CardTitle>
            <CardDescription>Logout from your account</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex justify-end">
          <Button
            variant="destructive"
            onClick={() => {
              if (logout) {
                logout();
              } else {
                toast({
                  title: 'Logout not implemented',
                  description: 'Logout function is not available.',
                  variant: 'destructive',
                });
              }
            }}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
