
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import LineChart from '@/components/dashboard/LineChart';
import BarChart from '@/components/dashboard/BarChart';
import { apiService, firebaseService } from '@/services/api';
import { AutoPredictResponse, Prediction } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowUpRight, ArrowDownRight, Battery, Wind, Sun, Droplets, Calendar, Download } from 'lucide-react';

const PurchaserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [predictionData, setPredictionData] = useState<AutoPredictResponse | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [timeRange, setTimeRange] = useState('day');
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get auto prediction data
        const autoPrediction = await apiService.getAutoPrediction();
        setPredictionData(autoPrediction);

        // Get historical predictions
        if (user?.organizationId) {
          const predictionsData = await firebaseService.getPredictions(user.organizationId);
          setPredictions(predictionsData);
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

  // Process predictions for charts
  const preparePredictionChartData = () => {
    if (predictions.length === 0) return { labels: [], datasets: [] };

    // Sort predictions by date
    const sortedPredictions = [...predictions].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Filter based on time range
    const filteredPredictions = sortedPredictions.slice(0, 
      timeRange === 'day' ? 1 : 
      timeRange === 'week' ? 7 : 
      timeRange === 'month' ? 30 : 
      sortedPredictions.length
    );

    // Extract labels and data
    const labels = filteredPredictions.map(pred => 
      new Date(pred.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    
    // Get hourly data (using first 24 hours for simplicity)
    const hourlyData = filteredPredictions[0]?.data.hourlyMW.map(item => item.value) || [];
    const hourlyLabels = Array.from({length: 24}, (_, i) => `${i}:00`);
    
    return {
      line: {
        labels: labels,
        datasets: [
          {
            label: 'Peak Demand (MW)',
            data: filteredPredictions.map(pred => 
              Math.max(...(pred.data.hourlyMW.map(h => h.value)))
            ),
            borderColor: '#4B70F5',
            backgroundColor: 'rgba(75, 112, 245, 0.1)',
          },
          {
            label: 'Average Demand (MW)',
            data: filteredPredictions.map(pred => {
              const values = pred.data.hourlyMW.map(h => h.value);
              return values.reduce((sum, val) => sum + val, 0) / values.length;
            }),
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
          }
        ]
      },
      hourly: {
        labels: hourlyLabels,
        datasets: [
          {
            label: 'Hourly Demand (MW)',
            data: hourlyData,
            borderColor: '#4B70F5',
            backgroundColor: 'rgba(75, 112, 245, 0.1)',
          }
        ]
      }
    };
  };
  
  // Process feature impacts for chart
  const prepareFeatureImpactData = () => {
    if (!predictionData) return { labels: [], datasets: [] };
    
    const impacts = predictionData.feature_impacts;
    const labels = Object.keys(impacts);
    const data = Object.values(impacts);
    
    return {
      labels,
      datasets: [
        {
          label: 'Impact Factor',
          data,
          backgroundColor: [
            'rgba(75, 112, 245, 0.7)', // blue
            'rgba(16, 185, 129, 0.7)', // green
            'rgba(251, 191, 36, 0.7)', // yellow
            'rgba(239, 68, 68, 0.7)',  // red
            'rgba(139, 92, 246, 0.7)', // purple
          ],
        }
      ]
    };
  };

  const chartData = preparePredictionChartData();
  const featureImpactData = prepareFeatureImpactData();

  const calculateStats = () => {
    if (predictions.length === 0) {
      return {
        peakDemand: 0,
        avgDemand: 0,
        forecastAccuracy: 0,
        carbonSavings: 0
      };
    }

    // Get most recent prediction
    const latestPrediction = predictions[0];
    
    // Calculate peak demand from latest prediction
    const peakDemand = Math.max(...latestPrediction.data.hourlyMW.map(h => h.value));
    
    // Calculate average demand from latest prediction
    const values = latestPrediction.data.hourlyMW.map(h => h.value);
    const avgDemand = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    // For demo, use a random accuracy between 85-95%
    const forecastAccuracy = 85 + Math.random() * 10;
    
    // For demo, use a random carbon savings percentage
    const carbonSavings = 12 + Math.random() * 8;
    
    return {
      peakDemand,
      avgDemand,
      forecastAccuracy,
      carbonSavings
    };
  };

  const stats = calculateStats();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold">Purchaser Dashboard</h1>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
              </SelectContent>
            </Select>
            
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
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
                  title: 'Peak Demand',
                  value: stats.peakDemand.toFixed(1),
                  unit: 'MW',
                  change: 5.2,
                  changeType: 'positive'
                }}
                icon={<Battery className="h-4 w-4 text-gray-500" />}
              />
              
              <StatsCard
                stats={{
                  title: 'Avg. Demand',
                  value: stats.avgDemand.toFixed(1),
                  unit: 'MW',
                  change: 2.1,
                  changeType: 'negative'
                }}
                icon={<Droplets className="h-4 w-4 text-gray-500" />}
              />
              
              <StatsCard
                stats={{
                  title: 'Forecast Accuracy',
                  value: stats.forecastAccuracy.toFixed(1),
                  unit: '%',
                  change: 1.8,
                  changeType: 'positive'
                }}
                icon={<Calendar className="h-4 w-4 text-gray-500" />}
              />
              
              <StatsCard
                stats={{
                  title: 'Carbon Savings',
                  value: stats.carbonSavings.toFixed(1),
                  unit: '%',
                  change: 3.5,
                  changeType: 'positive'
                }}
                icon={<Wind className="h-4 w-4 text-gray-500" />}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LineChart
                title="Demand Forecast (24 Hours)"
                data={chartData.hourly}
                height={300}
              />
              
              <BarChart
                title="Feature Impact Analysis"
                data={featureImpactData}
                height={300}
              />
            </div>

            {/* Trend Analysis */}
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Forecast Trends</h2>
              <LineChart
                title="Demand Trends Over Time"
                data={chartData.line}
                height={300}
              />
            </div>

            {/* Feature Impact Analysis */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">Key Insights</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Top Factors Affecting Demand</h3>
                  <ul className="space-y-2">
                    {Object.entries(predictionData?.feature_impacts || {})
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([feature, impact], index) => (
                        <li key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <span className="capitalize">{feature.replace('_', ' ')}</span>
                          <div className="flex items-center">
                            <span className="font-medium">{(impact * 100).toFixed(1)}%</span>
                            {index === 0 && (
                              <ArrowUpRight className="ml-1 h-4 w-4 text-energy-green" />
                            )}
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Sustainability Metrics</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span>Carbon Intensity</span>
                      <span className="font-medium">0.32 tCO2/MWh</span>
                    </li>
                    <li className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                      <span>Renewable %</span>
                      <div className="flex items-center">
                        <span className="font-medium">42.5%</span>
                        <ArrowUpRight className="ml-1 h-4 w-4 text-energy-green" />
                      </div>
                    </li>
                    <li className="flex items-center justify-between py-2">
                      <span>Efficiency Rating</span>
                      <span className="font-medium">B+</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default PurchaserDashboard;
