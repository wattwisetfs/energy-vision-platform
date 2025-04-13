
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Loader2, ArrowDown10, ArrowUp10, Download, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

interface Schedule {
  scheduleId: string;
  date: string;
  startTime: string;
  endTime: string;
  powerAvailable: number;
  price: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

const GeneratorSchedules = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // For schedule creation/editing form
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [powerAvailable, setPowerAvailable] = useState(100);
  const [price, setPrice] = useState(4);
  const [isEditing, setIsEditing] = useState(false);
  const [editScheduleId, setEditScheduleId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sample schedules
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      scheduleId: '1',
      date: '2025-04-14',
      startTime: '09:00',
      endTime: '17:00',
      powerAvailable: 120,
      price: 3.8,
      status: 'approved'
    },
    {
      scheduleId: '2',
      date: '2025-04-15',
      startTime: '10:00',
      endTime: '18:00',
      powerAvailable: 150,
      price: 4.2,
      status: 'submitted'
    },
    {
      scheduleId: '3',
      date: '2025-04-16',
      startTime: '08:00',
      endTime: '16:00',
      powerAvailable: 100,
      price: 3.5,
      status: 'draft'
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!date) {
        throw new Error("Date is required");
      }
      
      // In a real app, we would save to the backend
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      if (isEditing && editScheduleId) {
        setSchedules(schedules.map(schedule => {
          if (schedule.scheduleId === editScheduleId) {
            return {
              ...schedule,
              date: formattedDate,
              startTime,
              endTime,
              powerAvailable,
              price,
            };
          }
          return schedule;
        }));
        
        toast({
          title: "Schedule updated",
          description: `Schedule for ${formattedDate} has been updated successfully.`,
        });
      } else {
        const newSchedule: Schedule = {
          scheduleId: Math.random().toString(36).substr(2, 9),
          date: formattedDate,
          startTime,
          endTime,
          powerAvailable,
          price,
          status: 'draft'
        };
        
        setSchedules([...schedules, newSchedule]);
        
        toast({
          title: "Schedule created",
          description: `New schedule for ${formattedDate} has been created successfully.`,
        });
      }
      
      // Reset form
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving the schedule. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setStartTime('09:00');
    setEndTime('17:00');
    setPowerAvailable(100);
    setPrice(4);
    setIsEditing(false);
    setEditScheduleId(null);
  };

  const handleEdit = (schedule: Schedule) => {
    setIsEditing(true);
    setEditScheduleId(schedule.scheduleId);
    setDate(new Date(schedule.date));
    setStartTime(schedule.startTime);
    setEndTime(schedule.endTime);
    setPowerAvailable(schedule.powerAvailable);
    setPrice(schedule.price);
    setIsDialogOpen(true);
  };

  const handleDelete = async (scheduleId: string) => {
    try {
      // In a real app, we would call the API to delete
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSchedules(schedules.filter(schedule => schedule.scheduleId !== scheduleId));
      
      toast({
        title: "Schedule deleted",
        description: "The schedule has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error deleting the schedule. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCSV = () => {
    // Prepare CSV content
    const header = ['Date', 'Start Time', 'End Time', 'Power Available (MW)', 'Price (₹/kWh)', 'Status'];
    const rows = schedules.map(schedule => [
      schedule.date,
      schedule.startTime,
      schedule.endTime,
      schedule.powerAvailable.toString(),
      schedule.price.toString(),
      schedule.status
    ]);
    
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'power_schedules.csv';
    document.body.appendChild(link);
    link.dispatchEvent(new MouseEvent('click'));
    document.body.removeChild(link);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold">Power Schedules</h1>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  resetForm();
                  setIsEditing(false);
                }}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Schedule
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{isEditing ? 'Edit Schedule' : 'Create New Schedule'}</DialogTitle>
                  <DialogDescription>
                    Enter the details for your power availability schedule.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, 'PPP') : 'Select a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="powerAvailable">Power Available (MW)</Label>
                      <Input
                        id="powerAvailable"
                        type="number"
                        min="0"
                        step="1"
                        value={powerAvailable}
                        onChange={(e) => setPowerAvailable(Number(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹/kWh)</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.1"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditing ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        <>{isEditing ? 'Update Schedule' : 'Create Schedule'}</>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Schedules</CardTitle>
            <CardDescription>Manage your power availability schedules</CardDescription>
          </CardHeader>
          <CardContent>
            {schedules.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No schedules created yet.</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>Create Your First Schedule</Button>
                  </DialogTrigger>
                  {/* Dialog content is the same as above */}
                </Dialog>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Time</th>
                      <th className="text-left py-3 px-4 font-medium">Power (MW)</th>
                      <th className="text-left py-3 px-4 font-medium">Price (₹/kWh)</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule) => (
                      <tr key={schedule.scheduleId} className="border-b">
                        <td className="py-3 px-4">{format(new Date(schedule.date), 'MMM dd, yyyy')}</td>
                        <td className="py-3 px-4">{`${schedule.startTime} - ${schedule.endTime}`}</td>
                        <td className="py-3 px-4">{schedule.powerAvailable}</td>
                        <td className="py-3 px-4">₹{schedule.price.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(schedule.status)}`}>
                            {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(schedule)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(schedule.scheduleId)}>
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GeneratorSchedules;
