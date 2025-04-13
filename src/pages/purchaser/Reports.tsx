
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Download, Loader2, FileSpreadsheet } from 'lucide-react';
import { format } from 'date-fns';
import PieChart from '@/components/dashboard/PieChart';
import BarChart from '@/components/dashboard/BarChart';
import LineChart from '@/components/dashboard/LineChart';

const PurchaserReports = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('consumption');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // 30 days ago
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [generatedReport, setGeneratedReport] = useState<boolean>(false);

  // Dummy data for charts
  const consumptionBySourceData = {
    labels: ['Solar', 'Wind', 'Hydro', 'Thermal', 'Biomass', 'Other'],
    datasets: [
      {
        label: 'Consumption by Source',
        data: [35, 25, 15, 15, 5, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)'
        ],
      }
    ]
  };

  const costTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Cost (₹/kWh)',
        data: [3.5, 3.2, 3.7, 4.0, 4.2, 3.9, 3.6, 3.4, 3.2, 3.5, 3.8, 3.9],
        borderColor: 'rgba(75, 112, 245, 1)',
        backgroundColor: 'rgba(75, 112, 245, 0.1)',
      }
    ]
  };

  const sourcesComparisonData = {
    labels: ['Solar', 'Wind', 'Hydro', 'Thermal', 'Biomass'],
    datasets: [
      {
        label: 'Cost (₹/kWh)',
        data: [2.8, 3.2, 3.5, 4.2, 3.9],
        backgroundColor: 'rgba(75, 112, 245, 0.7)',
      },
      {
        label: 'Carbon Impact (kg CO2 eq/kWh)',
        data: [0.1, 0.05, 0.02, 0.9, 0.3],
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      }
    ]
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, we would fetch the report data from API
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setGeneratedReport(true);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!generatedReport) return;

    const reportName = `${reportType}_report_${format(startDate || new Date(), 'yyyy-MM-dd')}_to_${format(endDate || new Date(), 'yyyy-MM-dd')}`;
    
    // In a real app, we would generate a proper report file
    // For demo, simulate file download with dummy data
    const dummyReportData = `Report Type: ${reportType}
Date Range: ${format(startDate || new Date(), 'yyyy-MM-dd')} to ${format(endDate || new Date(), 'yyyy-MM-dd')}
Generated On: ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}

Summary:
Total Consumption: 12,450 MWh
Average Daily Consumption: 415 MWh
Peak Consumption: 623 MWh
Total Cost: ₹43,575,000
Average Cost: ₹3.5 / kWh

By Source:
Solar: 35% (4,357.5 MWh)
Wind: 25% (3,112.5 MWh)
Hydro: 15% (1,867.5 MWh)
Thermal: 15% (1,867.5 MWh)
Biomass: 5% (622.5 MWh)
Other: 5% (622.5 MWh)
`;

    const blob = new Blob([dummyReportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportName}.txt`;
    document.body.appendChild(link);
    link.dispatchEvent(new MouseEvent('click'));
    document.body.removeChild(link);
  };

  const renderReportContent = () => {
    if (!generatedReport) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Generate a report to view the data</p>
        </div>
      );
    }

    switch (reportType) {
      case 'consumption':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Consumption by Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart data={consumptionBySourceData} height={300} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Daily Consumption Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart 
                    data={{
                      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                      datasets: [{
                        label: 'Consumption (MWh)',
                        data: [420, 380, 450, 410],
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      }]
                    }} 
                    height={300} 
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Consumption Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Consumption</h3>
                    <p className="text-2xl font-bold">12,450 MWh</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Average Daily</h3>
                    <p className="text-2xl font-bold">415 MWh</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Peak Consumption</h3>
                    <p className="text-2xl font-bold">623 MWh</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Renewable %</h3>
                    <p className="text-2xl font-bold">75%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        );
        
      case 'cost':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cost Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart data={costTrendData} height={300} />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cost Distribution by Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart
                    data={{
                      labels: ['Solar', 'Wind', 'Hydro', 'Thermal', 'Biomass', 'Other'],
                      datasets: [{
                        label: 'Cost Share',
                        data: [30, 20, 15, 25, 5, 5],
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.7)',
                          'rgba(54, 162, 235, 0.7)',
                          'rgba(75, 192, 192, 0.7)',
                          'rgba(255, 205, 86, 0.7)',
                          'rgba(153, 102, 255, 0.7)',
                          'rgba(255, 159, 64, 0.7)'
                        ],
                      }]
                    }}
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Cost Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Cost</h3>
                    <p className="text-2xl font-bold">₹43.58M</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Average Cost</h3>
                    <p className="text-2xl font-bold">₹3.5/kWh</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Highest Cost</h3>
                    <p className="text-2xl font-bold">₹4.2/kWh</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground">Lowest Cost</h3>
                    <p className="text-2xl font-bold">₹2.8/kWh</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        );
        
      case 'sources':
        return (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Source Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={sourcesComparisonData} 
                  height={400}
                />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Carbon Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart
                    data={{
                      labels: ['Solar', 'Wind', 'Hydro', 'Thermal', 'Biomass'],
                      datasets: [{
                        label: 'Carbon Impact (tons CO2)',
                        data: [2, 1, 0.5, 45, 6],
                        backgroundColor: [
                          'rgba(16, 185, 129, 0.8)', // green for low impact
                          'rgba(14, 165, 233, 0.8)', 
                          'rgba(56, 189, 248, 0.8)',
                          'rgba(239, 68, 68, 0.8)', // red for high impact
                          'rgba(245, 158, 11, 0.8)'
                        ],
                      }]
                    }}
                    height={300}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Average Cost by Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    data={{
                      labels: ['Solar', 'Wind', 'Hydro', 'Thermal', 'Biomass'],
                      datasets: [{
                        label: 'Cost (₹/kWh)',
                        data: [2.8, 3.2, 3.5, 4.2, 3.9],
                        backgroundColor: 'rgba(75, 112, 245, 0.7)',
                      }]
                    }}
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
          </>
        );
        
      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Select a report type to view data</p>
          </div>
        );
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Reports</h1>
          {generatedReport && (
            <Button variant="outline" size="sm" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileSpreadsheet className="mr-2 h-5 w-5" />
              Generate Report
            </CardTitle>
            <CardDescription>
              Select parameters to generate a custom report
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select
                  value={reportType}
                  onValueChange={setReportType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumption">Consumption Report</SelectItem>
                    <SelectItem value="cost">Cost Analysis</SelectItem>
                    <SelectItem value="sources">Energy Sources</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => date < (startDate || new Date(0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={handleGenerateReport} disabled={loading || !startDate || !endDate}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          {renderReportContent()}
        </div>
      </div>
    </MainLayout>
  );
};

export default PurchaserReports;
