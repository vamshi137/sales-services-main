import React, { useState } from 'react';
import {
  Laptop,
  Smartphone,
  CreditCard,
  Monitor,
  AlertCircle,
  Eye,
  Wrench,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

/* ---------------- MOCK DATA (EMPLOYEE ONLY) ---------------- */

const assets = [
  {
    id: 'ASSET-001',
    name: 'Dell Latitude 5420',
    category: 'Laptop',
    icon: Laptop,
    serialNumber: 'DL5420-9X23',
    issuedOn: '2025-01-12',
    status: 'issued',
    condition: 'Good',
    issuedBy: 'IT Department',
    remarks: 'Handle with care',
  },
  {
    id: 'ASSET-002',
    name: 'Samsung Galaxy S21',
    category: 'Mobile',
    icon: Smartphone,
    serialNumber: 'SGS21-88K9',
    issuedOn: '2024-11-05',
    status: 'issued',
    condition: 'Good',
    issuedBy: 'IT Department',
    remarks: 'Official SIM only',
  },
  {
    id: 'ASSET-003',
    name: 'Access ID Card',
    category: 'Identity',
    icon: CreditCard,
    serialNumber: 'ID-SSSPL-019',
    issuedOn: '2024-01-10',
    status: 'active',
    condition: 'Good',
    issuedBy: 'HR',
    remarks: 'Mandatory on premises',
  },
];

/* ---------------- HELPERS ---------------- */

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'issued':
      return <Badge className="badge-success">Issued</Badge>;
    case 'active':
      return <Badge className="badge-info">Active</Badge>;
    case 'maintenance':
      return <Badge className="badge-warning">Maintenance</Badge>;
    case 'returned':
      return <Badge className="badge-destructive">Returned</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

/* ---------------- COMPONENT ---------------- */

const Assets: React.FC = () => {
  const { user } = useAuth();
  const [selectedAsset, setSelectedAsset] = useState<typeof assets[0] | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Assets</h1>
        <p className="text-muted-foreground">
          Company assets assigned to you
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardContent className="p-6 flex items-center gap-4">
            <Laptop className="h-6 w-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Assets</p>
              <p className="text-2xl font-bold">{assets.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6 flex items-center gap-4">
            <Monitor className="h-6 w-6 text-success" />
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold">
                {assets.filter(a => a.status !== 'returned').length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6 flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Issues Reported</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Assigned Assets</CardTitle>
          <CardDescription>
            Assets currently allocated to you
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Asset</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Issued On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {assets.map(asset => (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <asset.icon className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">{asset.id}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{asset.category}</TableCell>

                    <TableCell>
                      {new Date(asset.issuedOn).toLocaleDateString('en-IN')}
                    </TableCell>

                    <TableCell>{getStatusBadge(asset.status)}</TableCell>

                    <TableCell>{asset.condition}</TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedAsset(asset)}
                        >
                          View
                           <Eye className="h-4 w-4 mr-1" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Asset Details Dialog */}
      <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
        <DialogContent className="max-w-lg">
          {selectedAsset && (
            <>
              <DialogHeader>
                <DialogTitle>Asset Details</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <selectedAsset.icon className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold">{selectedAsset.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedAsset.id}</p>
                  </div>
                  {getStatusBadge(selectedAsset.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{selectedAsset.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Serial No</p>
                    <p className="font-medium">{selectedAsset.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issued On</p>
                    <p className="font-medium">
                      {new Date(selectedAsset.issuedOn).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issued By</p>
                    <p className="font-medium">{selectedAsset.issuedBy}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Remarks</p>
                    <p className="font-medium">{selectedAsset.remarks}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline">
                    <Wrench className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                  <Button className="bg-accent hover:bg-accent/90">
                    <Plus className="h-4 w-4 mr-2" />
                    Request Replacement
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assets;
