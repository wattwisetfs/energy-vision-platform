
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import { firebaseService } from '@/services/api';
import { Schedule } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, FileText, Upload, Eye, Calendar, Clock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const GeneratorSchedules = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [activeSchedule, setActiveSchedule] = useState<Schedule | null>(null);
  const [newScheduleData, setNewScheduleData] = useState<string>('');
  const [submittingSchedule, setSubmittingSchedule] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      setError(null);

      try {
        if (user?.organizationId) {
          const schedulesData = await firebaseService.getSchedules(user.organizationId);
          setSchedules(schedulesData);
        }
      } catch (err) {
        console.error('Error fetching schedules:', err);
        setError('Failed to load schedules. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [user]);

  const handleViewSchedule = (schedule: Schedule) => {
    setActiveSchedule(schedule);
  };

  const handleSubmitSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSchedule(true);

    try {
      // Validate JSON
      const scheduleData = JSON.parse(newScheduleData);
      
      if (!user?.organizationId) {
        throw new Error("User organization not found");
      }

      // In a real app, we would call a service to submit the schedule
      // For demo purposes, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add the new schedule to the list
      const newSchedule: Schedule = {
        id: `schedule-${Date.now()}`,
        organizationId: user.organizationId,
        state: user.state || 'Unknown',
        date: new Date().toISOString(),
        data: scheduleData,
        resourceType: scheduleData.resourceType || 'solar',
        status: 'sent',
        createdAt: new Date().toISOString()
      };

      setSchedules([newSchedule, ...schedules]);
      setNewScheduleData('');
      
      toast({
        title: "Schedule Submitted",
        description: "Your generation schedule has been submitted successfully.",
        variant: "default",
      });
    } catch (err) {
      console.error('Error submitting schedule:', err);
      toast({
        title: "Submission Failed",
        description: err instanceof Error ? err.message : "Please check your JSON format and try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingSchedule(false);
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
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold">Generation Schedules</h1>
        </div>

        <Tabs defaultValue="submit">
          <TabsList className="mb-4">
            <TabsTrigger value="submit">Submit Schedule</TabsTrigger>
            <TabsTrigger value="history">Schedule History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Generation Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitSchedule} className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-data">Schedule JSON Data</Label>
                      <Textarea
                        id="schedule-data"
                        placeholder='{"resourceType": "solar", "hourlyMW": [{"hour": 0, "value": 0}, {"hour": 1, "value": 0}, ...]}'
                        className="min-h-[200px] font-mono"
                        value={newScheduleData}
                        onChange={(e) => setNewScheduleData(e.target.value)}
                        required
                      />
                      <p className="text-sm text-gray-500">
                        Enter your generation schedule data in JSON format, including resourceType and hourly production values.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={submittingSchedule}>
                      {submittingSchedule ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Submit Schedule
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Schedule History</CardTitle>
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
                ) : schedules.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium mb-1">No schedules yet</h3>
                    <p className="text-gray-500 mb-4">Submit your first generation schedule to see it here.</p>
                    <Button onClick={() => document.querySelector('[data-value="submit"]')?.click()}>
                      Submit a Schedule
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Resource Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Submission Time</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schedules.map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                {formatDate(schedule.date)}
                              </div>
                            </TableCell>
                            <TableCell className="capitalize">{schedule.resourceType}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(schedule.status)}`}>
                                {schedule.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(schedule.createdAt).toLocaleTimeString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewSchedule(schedule)}
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Schedule Details</DialogTitle>
                                  </DialogHeader>
                                  {activeSchedule && (
                                    <div className="mt-4">
                                      <div className="flex justify-between mb-4">
                                        <div>
                                          <p className="text-sm font-medium text-gray-500">Date</p>
                                          <p>{formatDate(activeSchedule.date)}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-500">Resource Type</p>
                                          <p className="capitalize">{activeSchedule.resourceType}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-500">Status</p>
                                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(activeSchedule.status)}`}>
                                            {activeSchedule.status}
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500 mb-2">Schedule Data</p>
                                        <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-x-auto font-mono text-sm">
                                          {JSON.stringify(activeSchedule.data, null, 2)}
                                        </pre>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default GeneratorSchedules;
