
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, Download, FileText, Filter, MessageSquare, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Report {
  id: string;
  organization: string;
  type: string;
  state: string;
  submittedDate: Date;
  status: 'submitted' | 'verified' | 'corrected' | 'rejected';
  details: string;
}

const SldcReports = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [verificationComment, setVerificationComment] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Mock data for reports
  const mockReports: Report[] = [
    {
      id: 'REP-001',
      organization: 'Energy Distribution Co',
      type: 'monthly',
      state: 'Karnataka',
      submittedDate: new Date('2025-04-10'),
      status: 'submitted',
      details: 'Monthly consumption report for residential sector'
    },
    {
      id: 'REP-002',
      organization: 'Industrial Power',
      type: 'quarterly',
      state: 'Karnataka',
      submittedDate: new Date('2025-04-08'),
      status: 'verified',
      details: 'Quarterly report for industrial consumption patterns'
    },
    {
      id: 'REP-003',
      organization: 'Commercial Utilities',
      type: 'monthly',
      state: 'Karnataka',
      submittedDate: new Date('2025-04-05'),
      status: 'corrected',
      details: 'Monthly consumption for commercial zones'
    },
    {
      id: 'REP-004',
      organization: 'Urban Distribution',
      type: 'annual',
      state: 'Karnataka',
      submittedDate: new Date('2025-04-01'),
      status: 'rejected',
      details: 'Annual report for urban sector power consumption'
    },
    {
      id: 'REP-005',
      organization: 'Rural Electrification',
      type: 'monthly',
      state: 'Karnataka',
      submittedDate: new Date('2025-04-12'),
      status: 'submitted',
      details: 'Monthly report for rural electrification progress'
    }
  ];
  
  const handleVerifyReport = async (action: 'verify' | 'correct' | 'reject') => {
    if (!selectedReport) return;
    
    setVerifying(true);
    
    try {
      // In a real app, this would send the verification to the backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let statusMessage = '';
      switch (action) {
        case 'verify':
          statusMessage = 'verified';
          break;
        case 'correct':
          statusMessage = 'corrected';
          break;
        case 'reject':
          statusMessage = 'rejected';
          break;
      }
      
      toast({
        title: `Report ${statusMessage}`,
        description: `Report ${selectedReport.id} has been ${statusMessage} successfully.`,
      });
      
      setDialogOpen(false);
      setVerificationComment('');
    } catch (error) {
      toast({
        title: 'Action failed',
        description: 'There was an error processing your request.',
        variant: 'destructive',
      });
    } finally {
      setVerifying(false);
    }
  };
  
  // Filter reports based on search query and filters
  const filterReports = (reports: Report[]) => {
    return reports.filter(report => {
      // Filter by search query
      const matchesSearch = 
        report.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.details.toLowerCase().includes(searchQuery.toLowerCase());
        
      // Filter by status
      const matchesStatus = 
        statusFilter === 'all' || report.status === statusFilter;
        
      // Filter by report type
      const matchesType = 
        typeFilter === 'all' || report.type === typeFilter;
      
      // Filter by tab (status groups)
      const matchesTab = currentTab === 'all' || 
        (currentTab === 'pending' && report.status === 'submitted') ||
        (currentTab === 'processed' && (report.status === 'verified' || report.status === 'corrected' || report.status === 'rejected'));
        
      return matchesSearch && matchesStatus && matchesType && matchesTab;
    });
  };
  
  const filteredReports = filterReports(mockReports);
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Submitted</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>;
      case 'corrected':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Corrected</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">Purchaser Reports</h1>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={setCurrentTab}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Reports</TabsTrigger>
                  <TabsTrigger value="pending">Pending Verification</TabsTrigger>
                  <TabsTrigger value="processed">Processed</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search reports..."
                      className="pl-9 w-[200px] md:w-[300px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px] h-10" aria-label="Filter by status">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="corrected">Corrected</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[130px] h-10" aria-label="Filter by report type">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report ID</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.id}</TableCell>
                          <TableCell>{report.organization}</TableCell>
                          <TableCell className="capitalize">{report.type}</TableCell>
                          <TableCell>{format(report.submittedDate, 'dd MMM yyyy')}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setDialogOpen(true);
                                }}
                              >
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
                              </Button>
                              
                              {report.status === 'submitted' && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setVerificationComment('Verified without issues.');
                                      setDialogOpen(true);
                                    }}
                                    className="text-green-500 hover:text-green-700 hover:bg-green-50"
                                  >
                                    <Check className="h-4 w-4" />
                                    <span className="sr-only">Verify</span>
                                  </Button>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setVerificationComment('Correction recommended due to data inconsistency.');
                                      setDialogOpen(true);
                                    }}
                                    className="text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
                                  >
                                    <MessageSquare className="h-4 w-4" />
                                    <span className="sr-only">Correct</span>
                                  </Button>
                                  
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedReport(report);
                                      setVerificationComment('Significant discrepancies found. Report rejected.');
                                      setDialogOpen(true);
                                    }}
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <AlertTriangle className="h-4 w-4" />
                                    <span className="sr-only">Reject</span>
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          No reports found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              Verify, correct, or reject this report submission.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-4 sm:col-span-2">
                  <h3 className="text-sm font-medium">Report ID</h3>
                  <p className="text-sm">{selectedReport.id}</p>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <h3 className="text-sm font-medium">Status</h3>
                  <p className="text-sm">{getStatusBadge(selectedReport.status)}</p>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <h3 className="text-sm font-medium">Organization</h3>
                  <p className="text-sm">{selectedReport.organization}</p>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <h3 className="text-sm font-medium">Submitted</h3>
                  <p className="text-sm">{format(selectedReport.submittedDate, 'dd MMM yyyy')}</p>
                </div>
                <div className="col-span-4">
                  <h3 className="text-sm font-medium">Details</h3>
                  <p className="text-sm">{selectedReport.details}</p>
                </div>
              </div>
              
              <div className="grid gap-2 pt-2">
                <Label htmlFor="verification-comment">Verification Comment</Label>
                <Textarea
                  id="verification-comment"
                  placeholder="Enter comment or feedback for this report..."
                  value={verificationComment}
                  onChange={(e) => setVerificationComment(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            
            {selectedReport?.status === 'submitted' && (
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 mb-2 sm:mb-0">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleVerifyReport('reject')}
                  disabled={verifying || !verificationComment}
                >
                  {verifying ? (
                    <>Rejecting...</>
                  ) : (
                    <>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Reject
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleVerifyReport('correct')}
                  disabled={verifying || !verificationComment}
                  className="border-yellow-500 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                >
                  {verifying ? (
                    <>Correcting...</>
                  ) : (
                    <>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Correction Required
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  onClick={() => handleVerifyReport('verify')}
                  disabled={verifying || !verificationComment}
                >
                  {verifying ? (
                    <>Verifying...</>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Verify
                    </>
                  )}
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default SldcReports;
