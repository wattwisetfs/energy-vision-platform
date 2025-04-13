
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import LineChart from '@/components/dashboard/LineChart';
import PieChart from '@/components/dashboard/PieChart';
import { firebaseService } from '@/services/api';
import { Schedule } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowUpRight, ArrowDownRight, Sun, Wind, Droplet, Flame, Download } from 'lucide-react';

interface ResourceProduction {
  solar: number;
  wind: number;
  hydro: number;
  coal: number;
  [key: string]: number;
}

const GeneratorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [timeRange, setTimeRange] = useState('week');
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (user?.organizationId) {
          const schedulesData = await firebaseService.getSchedules(user.organizationId);
          setSchedules(schedulesData);
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

  // Calculate production by resource type
  const calculateProductionByResource = (): ResourceProduction => {
    if (schedules.length === 0) {
      return { solar: 0, wind: 0, hydro: 0, coal: 0 };
    }

    return schedules.reduce((result, schedule) => {
      const resourceType = schedule.resourceType;
      // In a real app, would sum up the actual production values
      // For demo, generate a random value between 50-150 MW
      const productionValue = 50 + Math.random() * 100;
      
      return {
        ...result,
        [resourceType]: (result[resourceType] || 0) + productionValue
      };
    }, {} as ResourceProduction);
  };

  // Process data for pie chart
  const preparePieChartData = () => {
    const production = calculateProductionByResource();
    const resourceTypes = Object.keys(production);
    
    return {
      labels: resourceTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)),
      datasets: [
        {
          label: 'Production (MW)',
          data: resourceTypes.map(type => production[type]),
          backgroundColor: [
            'rgba(251, 191, 36, 0.8)', // yellow (solar)
            'rgba(16, 185, 129, 0.8)',  // green (wind)
            'rgba(59, 130, 246, 0.8)',  // blue (hydro)
            'rgba(75, 85, 99, 0.8)',    // gray (coal)
          ],
        }
      ]
    };
  };

  // Process data for line chart
  const prepareLineChartData = () => {
    if (schedules.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Sort schedules by date
    const sortedSchedules = [...schedules].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Filter based on time range
    const daysToShow = timeRange === 'day' ? 1 : timeRange === 'week' ? 7 : 30;
    const filteredSchedules = sortedSchedules.slice(0, daysToShow);

    // Generate labels for each day
    const labels = filteredSchedules.map(schedule => 
      new Date(schedule.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    // Group by resource type
    const resourceTypes = ['solar', 'wind', 'hydro', 'coal'];
    const datasets = resourceTypes.map(type => {
      // Color based on resource type
      let color = '';
      switch(type) {
        case 'solar': color = '#FBBF24'; break; // yellow
        case 'wind': color = '#10B981'; break;  // green
        case 'hydro': color = '#3B82F6'; break; // blue
        case 'coal': color = '#4B5563'; break;  // gray
      }
      
      return {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        data: filteredSchedules.map(schedule => {
          if (schedule.resourceType === type) {
            // For demo, generate a random value (in real app, would use actual data)
            return 50 + Math.random() * 100;
          }
          return 0;
        }),
        borderColor: color,
        backgroundColor: color + '33', // Add transparency
      };
    }).filter(dataset => dataset.data.some(value => value > 0)); // Only include resource types with data

    return {
      labels,
      datasets
    };
  };

  const pieChartData = preparePieChartData();
  const lineChartData = prepareLineChartData();

  const calculateStats = () => {
    const production = calculateProductionByResource();
    const totalProduction = Object.values(production).reduce((sum, val) => sum + val, 0);
    
    // Calculate carbon offset (only for renewables)
    const renewableProduction = (production.solar || 0) + (production.wind || 0) + (production.hydro || 0);
    const renewablePercentage = totalProduction > 0 ? (renewableProduction / totalProduction) * 100 : 0;
    
    // For demo - carbon offset at 0.5 tons per MW for renewables
    const carbonOffset = renewableProduction * 0.5;
    
    // For demo - random uptime between 90-100%
    const uptime = 90 + Math.random() * 10;
    
    // For demo - random efficiency between 85-95%
    const efficiency = 85 + Math.random() * 10;
    
    return {
      totalProduction,
      renewablePercentage,
      carbonOffset,
      uptime,
      efficiency
    };
  };

  const stats = calculateStats();

  // Resource type specific icon
  const getResourceIcon = (type: string) => {
    switch(type) {
      case 'solar': return <Sun className="h-5 w-5" />;
      case 'wind': return <Wind className="h-5 w-5" />;
      case 'hydro': return <Droplet className="h-5 w-5" />;
      case 'coal': return <Flame className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold">Generator Dashboard</h1>
          
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
                  title: 'Total Production',
                  value: stats.totalProduction.toFixed(1),
                  unit: 'MW',
                  change: 3.8,
                  changeType: 'positive'
                }}
                icon={<Flame className="h-4 w-4 text-gray-500" />}
              />
              
              <StatsCard
                stats={{
                  title: 'Renewable Percentage',
                  value: stats.renewablePercentage.toFixed(1),
                  unit: '%',
                  change: 2.5,
                  changeType: 'positive'
                }}
                icon={<Wind className="h-4 w-4 text-gray-500" />}
              />
              
              <StatsCard
                stats={{
                  title: 'Carbon Offset',
                  value: stats.carbonOffset.toFixed(1),
                  unit: 'tons',
                  change: 4.2,
                  changeType: 'positive'
                }}
                icon={<Sun className="h-4 w-4 text-gray-500" />}
              />
              
              <StatsCard
                stats={{
                  title: 'Generation Uptime',
                  value: stats.uptime.toFixed(1),
                  unit: '%',
                  change: 0.5,
                  changeType: 'positive'
                }}
                icon={<Droplet className="h-4 w-4 text-gray-500" />}
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PieChart
                title="Production by Resource Type"
                data={pieChartData}
                height={300}
              />
              
              <LineChart
                title="Daily Production Trend"
                data={lineChartData}
                height={300}
              />
            </div>

            {/* Resource Details */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-lg font-medium mb-4">Resource Performance</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(calculateProductionByResource())
                  .filter(([_, value]) => value > 0) // Only show resources with production
                  .sort(([_, a], [__, b]) => b - a) // Sort by production value
                  .map(([resourceType, productionValue], index) => {
                    // Generate random efficiency between 80-95%
                    const efficiency = 80 + Math.random() * 15;
                    // Generate random change between -5 and +5
                    const change = (Math.random() * 10) - 5;
                    // Calculate carbon intensity (lower for renewables)
                    const carbonIntensity = resourceType === 'coal' ? 0.8 : 0.1;
                    
                    return (
                      <Card key={index} className="p-4">
                        <div className="flex items-start">
                          <div className={`p-3 rounded-lg mr-3 ${
                            resourceType === 'solar' ? 'bg-yellow-100 text-yellow-600' :
                            resourceType === 'wind' ? 'bg-green-100 text-green-600' :
                            resourceType === 'hydro' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {getResourceIcon(resourceType)}
                          </div>
                          <div>
                            <h3 className="font-medium capitalize mb-0.5">{resourceType}</h3>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {resourceType === 'coal' ? 'Thermal' : 'Renewable'} Energy Source
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Production</span>
                            <div className="flex items-center">
                              <span className="font-medium">{productionValue.toFixed(1)} MW</span>
                              {change > 0 ? (
                                <ArrowUpRight className="ml-1 h-4 w-4 text-energy-green" />
                              ) : (
                                <ArrowDownRight className="ml-1 h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Efficiency</span>
                            <span className="font-medium">{efficiency.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Carbon Intensity</span>
                            <span className="font-medium">{carbonIntensity.toFixed(2)} tCO₂/MWh</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default GeneratorDashboard;
