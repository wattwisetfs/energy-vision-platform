
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import { firebaseService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, FileText, Upload, Eye, Calendar, Clock, CheckCircle, AlertCircle, XCircle, MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface Report {
  id: string;
  organizationId: string;
  state: string;
  date: string;
  data: any; // JSON data
  status: 'draft' | 'submitted' | 'verified' | 'corrected';
  filePath?: string;
  createdAt: string;
  verification?: {
    sldcUserId: string;
    status: 'verified' | 'corrected';
    comments: string;
    suggestions: any[];
    verifiedAt: string;
  };
}

const PurchaserReports = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeReport, setActiveReport] = useState<Report | null>(null);
  const [newReportData, setNewReportData] = useState<string>('');
  const [submittingReport, setSubmittingReport] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        if (user?.organizationId) {
          // In a real app, we would fetch data from Firestore
          // For demo, simulate an API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock reports data
          const mockReports: Report[] = [
            {
              id: 'r1',
              organizationId: user.organizationId,
              state: user.state || 'Karnataka',
              date: '2023-04-15',
              data: { 
                demandForecast: {
                  peak: 450,
                  average: 320,
                  hourly: Array(24).fill(0).map((_, i) => ({
                    hour: i,
                    value: 250 + Math.sin(i * Math.PI / 12) * 150
                  }))
                }
              },
              status: 'verified',
              createdAt: '2023-04-15T08:30:00Z',
              verification: {
                sldcUserId: 'sldc1',
                status: 'verified',
                comments: 'Forecast looks accurate. Good work!',
                suggestions: [
                  {
                    name: 'SolarPrime Energy',
                    resourceType: 'solar',
                    price: 4.2,
                    carbon: 0.02
                  }
                ],
                verifiedAt: '2023-04-15T14:45:00Z'
              }
            },
            {
              id: 'r2',
              organizationId: user.organizationId,
              state: user.state || 'Karnataka',
              date: '2023-04-10',
              data: { 
                demandForecast: {
                  peak: 430,
                  average: 310,
                  hourly: Array(24).fill(0).map((_, i) => ({
                    hour: i,
                    value: 240 + Math.sin(i * Math.PI / 12) * 140
                  }))
                }
              },
              status: 'corrected',
              createdAt: '2023-04-10T09:15:00Z',
              verification: {
                sldcUserId: 'sldc1',
                status: 'corrected',
                comments: 'Peak demand was underestimated. Adjusted forecast provided.',
                suggestions: [
                  {
                    name: 'WindForce',
                    resourceType: 'wind',
                    price: 3.8,
                    carbon: 0.01
                  }
                ],
                verifiedAt: '2023-04-10T17:30:00Z'
              }
            },
            {
              id: 'r3',
              organizationId: user.organizationId,
              state: user.state || 'Karnataka',
              date: '2023-04-05',
              data: { 
                demandForecast: {
                  peak: 410,
                  average: 290,
                  hourly: Array(24).fill(0).map((_, i) => ({
                    hour: i,
                    value: 230 + Math.sin(i * Math.PI / 12) * 130
                  }))
                }
              },
              status: 'submitted',
              createdAt: '2023-04-05T08:45:00Z'
            },
            {
              id: 'r4',
              organizationId: user.organizationId,
              state: user.state || 'Karnataka',
              date: '2023-04-01',
              data: { 
                demandForecast: {
                  peak: 400,
                  average: 280,
                  hourly: Array(24).fill(0).map((_, i) => ({
                    hour: i,
                    value: 220 + Math.sin(i * Math.PI / 12) * 120
                  }))
                }
              },
              status: 'draft',
              createdAt: '2023-04-01T10:00:00Z'
            },
          ];
          
          setReports(mockReports);
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  const handleViewReport = (report: Report) => {
    setActiveReport(report);
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReport(true);

    try {
      // Validate JSON
      const reportData = JSON.parse(newReportData);
      
      if (!user?.organizationId) {
        throw new Error("User organization not found");
      }

      // In a real app, we would call a service to submit the report
      // For demo purposes, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add the new report to the list
      const newReport: Report = {
        id: `report-${Date.now()}`,
        organizationId: user.organizationId,
        state: user.state || 'Unknown',
        date: new Date().toISOString().split('T')[0],
        data: reportData,
        status: 'submitted',
        createdAt: new Date().toISOString()
      };

      setReports([newReport, ...reports]);
      setNewReportData('');
      
      toast({
        title: "Report Submitted",
        description: "Your demand forecast report has been submitted to SLDC.",
        variant: "default",
      });
    } catch (err) {
      console.error('Error submitting report:', err);
      toast({
        title: "Submission Failed",
        description: err instanceof Error ? err.message : "Please check your JSON format and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingReport(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'corrected':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4" />;
      case 'submitted':
        return <Upload className="h-4 w-4" />;
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'corrected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold">Demand Forecast Reports</h1>
        </div>

        <Tabs defaultValue="history">
          <TabsList className="mb-4">
            <TabsTrigger value="history">Report History</TabsTrigger>
            <TabsTrigger value="submit">Submit New Report</TabsTrigger>
          </TabsList>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Report History</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-600 mb-2">{error}</p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                      Retry
                    </Button>
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium mb-1">No reports yet</h3>
                    <p className="text-gray-500 mb-4">Submit your first demand forecast report to SLDC.</p>
                    <Button onClick={() => document.querySelector('[data-value="submit"]')?.click()}>
                      Submit a Report
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                          <th className="py-3 px-4 text-left font-medium">Date</th>
                          <th className="py-3 px-4 text-left font-medium">Status</th>
                          <th className="py-3 px-4 text-left font-medium">Submission Time</th>
                          <th className="py-3 px-4 text-left font-medium">Verification</th>
                          <th className="py-3 px-4 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reports.map((report) => (
                          <tr key={report.id} className="border-t border-gray-200 dark:border-gray-700">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                {formatDate(report.date)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${getStatusBadgeColor(report.status)}`}>
                                {getStatusIcon(report.status)}
                                <span className="ml-1 capitalize">{report.status}</span>
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(report.createdAt).toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {report.verification ? (
                                <div className="flex items-center">
                                  <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                                  <span className="text-sm">
                                    {report.verification.comments.substring(0, 20)}...
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  {report.status === 'draft' ? 'Not submitted yet' : 'Pending'}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewReport(report)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Report Details</DialogTitle>
                                  </DialogHeader>
                                  {activeReport && (
                                    <div className="mt-4">
                                      <div className="flex justify-between mb-4">
                                        <div>
                                          <p className="text-sm font-medium text-gray-500">Date</p>
                                          <p>{formatDate(activeReport.date)}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-500">Status</p>
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${getStatusBadgeColor(activeReport.status)}`}>
                                            {getStatusIcon(activeReport.status)}
                                            <span className="ml-1 capitalize">{activeReport.status}</span>
                                          </span>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-500">Created</p>
                                          <p className="text-sm">
                                            {new Date(activeReport.createdAt).toLocaleString()}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      {activeReport.verification && (
                                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                          <h3 className="font-medium mb-2">SLDC Verification</h3>
                                          <p className="text-sm mb-2">
                                            <span className="font-medium">Status:</span> {activeReport.verification.status === 'verified' ? 'Verified ✓' : 'Corrected ⚠'}
                                          </p>
                                          <p className="text-sm mb-2">
                                            <span className="font-medium">Comments:</span> {activeReport.verification.comments}
                                          </p>
                                          {activeReport.verification.suggestions.length > 0 && (
                                            <div>
                                              <p className="font-medium text-sm">Supplier Suggestions:</p>
                                              <ul className="mt-1 space-y-1">
                                                {activeReport.verification.suggestions.map((suggestion, idx) => (
                                                  <li key={idx} className="text-sm">
                                                    <span className="font-medium">{suggestion.name}</span> - {suggestion.resourceType}, 
                                                    ₹{suggestion.price}/kWh, {suggestion.carbon} tCO₂/MWh
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                          <p className="text-xs text-gray-500 mt-2">
                                            Verified on: {new Date(activeReport.verification.verifiedAt).toLocaleString()}
                                          </p>
                                        </div>
                                      )}
                                      
                                      <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Report Data</p>
                                        <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-x-auto font-mono text-sm">
                                          {JSON.stringify(activeReport.data, null, 2)}
                                        </pre>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Report</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReport} className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-data">Report Data (JSON)</Label>
                      <Textarea
                        id="report-data"
                        placeholder='{"demandForecast": {"peak": 450, "average": 320, "hourly": [{"hour": 0, "value": 250}, {"hour": 1, "value": 230}, ...]}}'
                        className="min-h-[200px] font-mono"
                        value={newReportData}
                        onChange={(e) => setNewReportData(e.target.value)}
                        required
                      />
                      <p className="text-sm text-gray-500">
                        Enter your demand forecast data in JSON format, including peak, average, and hourly demand projections.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={submittingReport}>
                      {submittingReport ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Submit to SLDC
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default PurchaserReports;
