import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Bug,
  Info,
  HelpCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Help: React.FC = () => {
  const { toast } = useToast();

  const [openHelpCenter, setOpenHelpCenter] = useState(false);
  const [openUserGuide, setOpenUserGuide] = useState(false);
  const [openReportIssue, setOpenReportIssue] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);

  const handleIssueSubmit = () => {
    toast({
      title: 'Issue Submitted',
      description: 'Your issue has been reported to the admin.',
    });
    setOpenReportIssue(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2">
        <HelpCircle className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Help & Support</h1>
      </div>
      <p className="text-muted-foreground">
        Find help, guides, or report an issue related to the system.
      </p>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover cursor-pointer" onClick={() => setOpenHelpCenter(true)}>
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <BookOpen className="h-8 w-8 text-primary" />
            <p className="font-semibold">Help Center</p>
            <p className="text-sm text-muted-foreground">
              Common questions & usage help
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer" onClick={() => setOpenUserGuide(true)}>
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <FileText className="h-8 w-8 text-info" />
            <p className="font-semibold">User Guide</p>
            <p className="text-sm text-muted-foreground">
              How to use each module
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer" onClick={() => setOpenReportIssue(true)}>
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <Bug className="h-8 w-8 text-warning" />
            <p className="font-semibold">Report an Issue</p>
            <p className="text-sm text-muted-foreground">
              Facing a problem? Tell us
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover cursor-pointer" onClick={() => setOpenAbout(true)}>
          <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
            <Info className="h-8 w-8 text-success" />
            <p className="font-semibold">About</p>
            <p className="text-sm text-muted-foreground">
              Project & team details
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Help Center Dialog */}
      <Dialog open={openHelpCenter} onOpenChange={setOpenHelpCenter}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Help Center</DialogTitle>
            <DialogDescription>Frequently asked questions</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm">
            <li>• How to punch in/out attendance</li>
            <li>• How to apply for leave</li>
            <li>• How to download payslip</li>
            <li>• How to check training status</li>
          </ul>
        </DialogContent>
      </Dialog>

      {/* User Guide Dialog */}
      <Dialog open={openUserGuide} onOpenChange={setOpenUserGuide}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Guide</DialogTitle>
            <DialogDescription>Basic system usage</DialogDescription>
          </DialogHeader>
          <p className="text-sm">
            This HRMS allows employees to:
            <br />• Mark attendance
            <br />• Apply and track leaves
            <br />• View payroll and payslips
            <br />• Track trainings and performance
          </p>
        </DialogContent>
      </Dialog>

      {/* Report Issue Dialog */}
      <Dialog open={openReportIssue} onOpenChange={setOpenReportIssue}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
            <DialogDescription>
              Describe the problem you are facing
            </DialogDescription>
          </DialogHeader>

          <Textarea placeholder="Describe the issue..." rows={4} />

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpenReportIssue(false)}>
              Cancel
            </Button>
            <Button onClick={handleIssueSubmit} className="bg-accent hover:bg-accent/90">
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* About Dialog */}
      <Dialog open={openAbout} onOpenChange={setOpenAbout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About Project</DialogTitle>
            <DialogDescription>Project information</DialogDescription>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <p><strong>Project:</strong> HRMS – Employee Management System</p>
            <p><strong>Tech Stack:</strong> React, TypeScript, Tailwind, ShadCN</p>
            <p><strong>Role:</strong> Employee Module</p>
            <p><strong>Version:</strong> 1.0</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Help;
