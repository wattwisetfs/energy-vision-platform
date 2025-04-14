import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import { apiService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Calendar, BarChart3, Download, LineChartIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LineChart from '@/components/dashboard/LineChart';
import BarChart from '@/components/dashboard/BarChart';
import { Label } from '@/components/ui/label';

interface ForecastData {
  timestamp: string;
  predicted_load: number;
  feature_impacts: {
    [key: string]: number;
  };
}

const PurchaserPredictions = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [frequency, setFrequency] = useState('hourly');
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: ForecastData[] = [];
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      let currentDate = new Date(start);
      while (currentDate <= end) {
        let timeIncrement: number;
        
        switch(frequency) {
          case '5min':
            timeIncrement = 5 * 60 * 1000;
            break;
          case 'daily':
            timeIncrement = 24 * 60 * 60 * 1000;
            break;
          case 'hourly':
          default:
            timeIncrement = 60 * 60 * 1000;
            break;
        }
        
        const baseLoad = 250 + Math.random() * 200;
        
        const adjustedLoad = baseLoad * (0.85 + Math.random() * 0.3);
        
        mockData.push({
          timestamp: currentDate.toISOString(),
          predicted_load: Math.round(adjustedLoad),
          feature_impacts: {
            temperature: 0.3 + Math.random() * 0.2,
            humidity: 0.1 + Math.random() * 0.1,
            season: 0.15 + Math.random() * 0.1,
            day_of_week: 0.2 + Math.random() * 0.15,
            time_of_day: 0.15 + Math.random() * 0.1,
          }
        });
        
        currentDate = new Date(currentDate.getTime() + timeIncrement);
      }
      
      setForecastData(mockData);
      toast({
        title: "Forecast Generated",
        description: `Successfully generated forecast from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}.`,
      });
    } catch (error) {
      toast({
        title: "Forecast Failed",
        description: "There was an error generating the forecast. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const prepareLineChartData = () => {
    if (forecastData.length === 0) return { labels: [], datasets: [] };
    
    const labels = forecastData.map(data => {
      const date = new Date(data.timestamp);
      if (frequency === 'daily') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (frequency === 'hourly') {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      } else {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      }
    });
    
    return {
      labels,
      datasets: [
        {
          label: 'Predicted Load (MW)',
          data: forecastData.map(data => data.predicted_load),
          borderColor: '#4B70F5',
          backgroundColor: 'rgba(75, 112, 245, 0.1)',
        }
      ]
    };
  };
  
  const prepareBarChartData = () => {
    if (forecastData.length === 0) return { labels: [], datasets: [] };
    
    const impactSums: {[key: string]: number} = {};
    const impactCounts: {[key: string]: number} = {};
    
    forecastData.forEach(data => {
      Object.entries(data.feature_impacts).forEach(([feature, impact]) => {
        impactSums[feature] = (impactSums[feature] || 0) + impact;
        impactCounts[feature] = (impactCounts[feature] || 0) + 1;
      });
    });
    
    const features = Object.keys(impactSums);
    const avgImpacts = features.map(feature => 
      impactCounts[feature] ? impactSums[feature] / impactCounts[feature] : 0
    );
    
    return {
      labels: features.map(f => f.replace('_', ' ')).map(f => f.charAt(0).toUpperCase() + f.slice(1)),
      datasets: [
        {
          label: 'Impact Factor',
          data: avgImpacts,
          backgroundColor: [
            'rgba(75, 112, 245, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(251, 191, 36, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(139, 92, 246, 0.7)',
          ],
        }
      ]
    };
  };
  
  const lineChartData = prepareLineChartData();
  const barChartData = prepareBarChartData();
  
  const handleDownloadCSV = () => {
    if (forecastData.length === 0) return;
    
    const header = ['Timestamp', 'Predicted Load (MW)', ...Object.keys(forecastData[0].feature_impacts)];
    const rows = forecastData.map(data => [
      data.timestamp,
      data.predicted_load,
      ...Object.values(data.feature_impacts)
    ]);
    
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `forecast_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold">Load Predictions</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <img src="/lovable-uploads/6c3f8356-58e2-47b7-a3c1-c8d5498515ee.png" alt="Logo" className="h-6 w-6 mr-2" />
              Generate Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={frequency}
                    onValueChange={setFrequency}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5min">5 Minutes</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Generate Forecast
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        {forecastData.length > 0 && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Forecast Results</h2>
              <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChartIcon className="h-5 w-5 mr-2" />
                    Load Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LineChart 
                    title=""
                    data={lineChartData} 
                    height={300} 
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Feature Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    title=""
                    data={barChartData} 
                    height={300} 
                  />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Forecast Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Average Load</h3>
                    <p className="text-2xl font-bold">
                      {Math.round(forecastData.reduce((sum, data) => sum + data.predicted_load, 0) / forecastData.length)} MW
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Peak Load</h3>
                    <p className="text-2xl font-bold">
                      {Math.max(...forecastData.map(data => data.predicted_load))} MW
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Points</h3>
                    <p className="text-2xl font-bold">
                      {forecastData.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default PurchaserPredictions;
