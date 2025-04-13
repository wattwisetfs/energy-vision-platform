
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { firebaseService } from '@/services/api';
import { Schedule, Report } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Filter, 
  FileText, 
  ClipboardCheck, 
  AlertCircle, 
  Eye, 
  Loader2 
} from 'lucide-react';

const SldcDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState('schedules');
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (user?.organizationId) {
          // For demo, load all schedules and reports from all organizations
          // In a real app, SLDC would have access to data across organizations
          const schedulesResponse = await firebaseService.getSchedules("all");
          const reportsResponse = await firebaseService.getReports("all");
          
          setSchedules(schedulesResponse);
          setReports(reportsResponse);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>;
      case 'sent':
      case 'submitted':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Submitted</Badge>;
      case 'received':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Received</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Verified</Badge>;
      case 'corrected':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">Corrected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'corrected':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'draft':
        return <Clock className="h-5 w-5 text-gray-500" />;
      case 'sent':
      case 'submitted':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    const totalSchedules = schedules.length;
    const receivedSchedules = schedules.filter(s => s.status === 'received').length;
    
    const totalReports = reports.length;
    const verifiedReports = reports.filter(r => r.status === 'verified').length;
    const correctedReports = reports.filter(r => r.status === 'corrected').length;
    
    const pendingTasks = totalSchedules - receivedSchedules + totalReports - verifiedReports - correctedReports;
    
    // Count overdue items (for demo, just randomly mark some as overdue)
    const overdueItems = Math.floor(Math.random() * 3);
    
    return {
      schedules: totalSchedules,
      receivedSchedules,
      reports: totalReports,
      verifiedReports,
      correctedReports,
      pendingTasks,
      overdueItems
    };
  };

  const stats = calculateStats();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold">SLDC Dashboard</h1>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading dashboard data...</span>
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Data</h3>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              Retry
            </Button>
          </Card>
        ) : (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                stats={{
                  title: 'Schedules Received',
                  value: `${stats.receivedSchedules}/${stats.schedules}`,
                  change: stats.schedules > 0 ? (stats.receivedSchedules / stats.schedules) * 100 : 0,
                  changeType: 'neutral'
                }}
                icon={<FileText className="h-4 w-4 text-gray-500" />}
              />
              
              <StatsCard
                stats={{
                  title: 'Reports Verified',
                  value: `${stats.verifiedReports + stats.correctedReports}/${stats.reports}`,
                  change: stats.reports > 0 ? ((stats.verifiedReports + stats.correctedReports) / stats.reports) * 100 : 0,
                  changeType: 'neutral'
                }}
                icon={<ClipboardCheck className="h-4 w-4 text-gray-500" />}
              />
              
              <StatsCard
                stats={{
                  title: 'Pending Tasks',
                  value: stats.pendingTasks.toString(),
                  change: stats.pendingTasks > 5 ? 12.5 : -8.3,
                  changeType: stats.pendingTasks > 5 ? 'negative' : 'positive'
                }}
                icon={<Clock className="h-4 w-4 text-gray-500" />}
              />
              
              <StatsCard
                stats={{
                  title: 'Overdue Items',
                  value: stats.overdueItems.toString(),
                  change: stats.overdueItems > 0 ? 0 : -100,
                  changeType: stats.overdueItems > 0 ? 'negative' : 'positive'
                }}
                icon={<AlertTriangle className="h-4 w-4 text-gray-500" />}
              />
            </div>

            {/* Tabs for Schedules and Reports */}
            <Tabs defaultValue="schedules" value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                <TabsTrigger value="schedules">
                  Generator Schedules
                </TabsTrigger>
                <TabsTrigger value="reports">
                  Purchaser Reports
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="schedules" className="mt-6">
                <Card>
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="text-lg font-medium">Generator Schedules</h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      {schedules.length} Total
                    </Badge>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Organization</TableHead>
                          <TableHead>Resource Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>State</TableHead>
                          <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schedules.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No schedules available
                            </TableCell>
                          </TableRow>
                        ) : (
                          schedules.slice(0, 5).map((schedule, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {new Date(schedule.date).toLocaleDateString('en-US', { 
                                  month: 'short', day: 'numeric', year: '2-digit' 
                                })}
                              </TableCell>
                              <TableCell>Generator {schedule.orgId.slice(-4)}</TableCell>
                              <TableCell className="capitalize">{schedule.resourceType}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(schedule.status)}
                                  <span>{getStatusBadge(schedule.status)}</span>
                                </div>
                              </TableCell>
                              <TableCell>{schedule.state}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {schedules.length > 5 && (
                    <div className="p-4 border-t text-center">
                      <Button variant="link">
                        View All Schedules
                      </Button>
                    </div>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="reports" className="mt-6">
                <Card>
                  <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="text-lg font-medium">Purchaser Reports</h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      {reports.length} Total
                    </Badge>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Organization</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>State</TableHead>
                          <TableHead>Verification</TableHead>
                          <TableHead className="w-[100px]">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reports.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                              No reports available
                            </TableCell>
                          </TableRow>
                        ) : (
                          reports.slice(0, 5).map((report, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {new Date(report.date).toLocaleDateString('en-US', { 
                                  month: 'short', day: 'numeric', year: '2-digit' 
                                })}
                              </TableCell>
                              <TableCell>Purchaser {report.orgId.slice(-4)}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(report.status)}
                                  <span>{getStatusBadge(report.status)}</span>
                                </div>
                              </TableCell>
                              <TableCell>{report.state}</TableCell>
                              <TableCell>
                                {report.verifications && report.verifications.length > 0 ? (
                                  <Badge variant="outline" className={
                                    report.verifications[0].status === 'verified'
                                      ? 'bg-green-100 text-green-800 border-green-200'
                                      : 'bg-orange-100 text-orange-800 border-orange-200'
                                  }>
                                    {report.verifications[0].status === 'verified' ? 'Verified' : 'Corrected'}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                                    Pending
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {reports.length > 5 && (
                    <div className="p-4 border-t text-center">
                      <Button variant="link">
                        View All Reports
                      </Button>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>

            {/* Recent Activities */}
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Recent Activities</h2>
              <Card>
                <div className="p-4">
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="p-1 bg-green-100 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Report verified</span> - Demand forecast from Purchaser 8a7b
                        </p>
                        <p className="text-xs text-gray-500">Today, 9:15 AM</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="p-1 bg-orange-100 rounded-full">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Report corrected</span> - Demand forecast from Purchaser 5c3d
                        </p>
                        <p className="text-xs text-gray-500">Today, 8:42 AM</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="p-1 bg-blue-100 rounded-full">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Schedule received</span> - Solar generation from Generator 3e2f
                        </p>
                        <p className="text-xs text-gray-500">Yesterday, 4:30 PM</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="p-1 bg-green-100 rounded-full">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">Report verified</span> - Demand forecast from Purchaser 2b9c
                        </p>
                        <p className="text-xs text-gray-500">Yesterday, 2:15 PM</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default SldcDashboard;
