
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
import { Check, Download, FileCheck, FileText, Filter, Search } from 'lucide-react';
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
import PieChart from '@/components/dashboard/PieChart';

interface Schedule {
  id: string;
  organization: string;
  resourceType: string;
  state: string;
  submittedDate: Date;
  status: 'received' | 'approved' | 'rejected' | 'pending';
  energyOutput: number;
}

const SldcSchedules = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [resourceFilter, setResourceFilter] = useState('all');
  const [currentTab, setCurrentTab] = useState('all');
  
  // Mock data for schedules
  const mockSchedules: Schedule[] = [
    {
      id: 'SCH-001',
      organization: 'SolarTech Power',
      resourceType: 'solar',
      state: 'Karnataka',
      submittedDate: new Date('2025-04-10'),
      status: 'received',
      energyOutput: 450
    },
    {
      id: 'SCH-002',
      organization: 'WindForce Energy',
      resourceType: 'wind',
      state: 'Karnataka',
      submittedDate: new Date('2025-04-11'),
      status: 'approved',
      energyOutput: 320
    },
    {
      id: 'SCH-003',
      organization: 'HydroFlow',
      resourceType: 'hydro',
      state: 'Karnataka',
      submittedDate: new Date('2025-04-09'),
      status: 'rejected',
      energyOutput: 280
    },
    {
      id: 'SCH-004',
      organization: 'CoalPower',
      resourceType: 'coal',
      state: 'Karnataka',
      submittedDate: new Date('2025-04-12'),
      status: 'pending',
      energyOutput: 650
    },
    {
      id: 'SCH-005',
      organization: 'NuclearGen',
      resourceType: 'nuclear',
      state: 'Karnataka',
      submittedDate: new Date('2025-04-13'),
      status: 'received',
      energyOutput: 900
    }
  ];
  
  const handleStatusChange = (scheduleId: string, newStatus: 'approved' | 'rejected') => {
    // In a real app, this would update the status in the backend
    toast({
      title: `Schedule ${newStatus}`,
      description: `Schedule ${scheduleId} has been ${newStatus}.`,
    });
  };
  
  // Filter schedules based on search query and filters
  const filterSchedules = (schedules: Schedule[]) => {
    return schedules.filter(schedule => {
      // Filter by search query
      const matchesSearch = 
        schedule.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        schedule.id.toLowerCase().includes(searchQuery.toLowerCase());
        
      // Filter by status
      const matchesStatus = 
        statusFilter === 'all' || schedule.status === statusFilter;
        
      // Filter by resource type
      const matchesResource = 
        resourceFilter === 'all' || schedule.resourceType === resourceFilter;
      
      // Filter by tab (status groups)
      const matchesTab = currentTab === 'all' || 
        (currentTab === 'pending' && (schedule.status === 'received' || schedule.status === 'pending')) ||
        (currentTab === 'processed' && (schedule.status === 'approved' || schedule.status === 'rejected'));
        
      return matchesSearch && matchesStatus && matchesResource && matchesTab;
    });
  };
  
  const filteredSchedules = filterSchedules(mockSchedules);
  
  // Prepare pie chart data
  const resourceChartData = {
    labels: ['Solar', 'Wind', 'Hydro', 'Coal', 'Nuclear'],
    datasets: [{
      label: 'Energy Output (MW)',
      data: [
        mockSchedules.filter(s => s.resourceType === 'solar').reduce((acc, s) => acc + s.energyOutput, 0),
        mockSchedules.filter(s => s.resourceType === 'wind').reduce((acc, s) => acc + s.energyOutput, 0),
        mockSchedules.filter(s => s.resourceType === 'hydro').reduce((acc, s) => acc + s.energyOutput, 0),
        mockSchedules.filter(s => s.resourceType === 'coal').reduce((acc, s) => acc + s.energyOutput, 0),
        mockSchedules.filter(s => s.resourceType === 'nuclear').reduce((acc, s) => acc + s.energyOutput, 0),
      ],
      backgroundColor: [
        'rgba(255, 205, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 99, 132, 0.7)'
      ]
    }]
  };
  
  const statusChartData = {
    labels: ['Received', 'Approved', 'Rejected', 'Pending'],
    datasets: [{
      label: 'Schedules by Status',
      data: [
        mockSchedules.filter(s => s.status === 'received').length,
        mockSchedules.filter(s => s.status === 'approved').length,
        mockSchedules.filter(s => s.status === 'rejected').length,
        mockSchedules.filter(s => s.status === 'pending').length,
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 205, 86, 0.7)'
      ]
    }]
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'received':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Received</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold">Generator Schedules</h1>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Distribution by Resource Type</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={resourceChartData} height={250} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Schedule Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <PieChart data={statusChartData} height={250} />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Schedule Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={setCurrentTab}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending Review</TabsTrigger>
                  <TabsTrigger value="processed">Processed</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search schedules..."
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
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={resourceFilter} onValueChange={setResourceFilter}>
                    <SelectTrigger className="w-[130px] h-10" aria-label="Filter by resource">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Resource" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Resources</SelectItem>
                      <SelectItem value="solar">Solar</SelectItem>
                      <SelectItem value="wind">Wind</SelectItem>
                      <SelectItem value="hydro">Hydro</SelectItem>
                      <SelectItem value="coal">Coal</SelectItem>
                      <SelectItem value="nuclear">Nuclear</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="all" className="m-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Schedule ID</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Resource Type</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSchedules.length > 0 ? (
                        filteredSchedules.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell className="font-medium">{schedule.id}</TableCell>
                            <TableCell>{schedule.organization}</TableCell>
                            <TableCell className="capitalize">{schedule.resourceType}</TableCell>
                            <TableCell>{format(schedule.submittedDate, 'dd MMM yyyy')}</TableCell>
                            <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                {(schedule.status === 'received' || schedule.status === 'pending') && (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleStatusChange(schedule.id, 'approved')}
                                    >
                                      <Check className="h-4 w-4 text-green-500" />
                                      <span className="sr-only">Approve</span>
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleStatusChange(schedule.id, 'rejected')}
                                    >
                                      <FileCheck className="h-4 w-4 text-red-500" />
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
                            No schedules found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="m-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Schedule ID</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Resource Type</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSchedules.length > 0 ? (
                        filteredSchedules.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell className="font-medium">{schedule.id}</TableCell>
                            <TableCell>{schedule.organization}</TableCell>
                            <TableCell className="capitalize">{schedule.resourceType}</TableCell>
                            <TableCell>{format(schedule.submittedDate, 'dd MMM yyyy')}</TableCell>
                            <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleStatusChange(schedule.id, 'approved')}
                                >
                                  <Check className="h-4 w-4 text-green-500" />
                                  <span className="sr-only">Approve</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleStatusChange(schedule.id, 'rejected')}
                                >
                                  <FileCheck className="h-4 w-4 text-red-500" />
                                  <span className="sr-only">Reject</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No pending schedules found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="processed" className="m-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Schedule ID</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Resource Type</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSchedules.length > 0 ? (
                        filteredSchedules.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell className="font-medium">{schedule.id}</TableCell>
                            <TableCell>{schedule.organization}</TableCell>
                            <TableCell className="capitalize">{schedule.resourceType}</TableCell>
                            <TableCell>{format(schedule.submittedDate, 'dd MMM yyyy')}</TableCell>
                            <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No processed schedules found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default SldcSchedules;
