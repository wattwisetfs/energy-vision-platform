import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import { firebaseService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader2, Map, Search, Filter, Wind, Sun, Droplet, Flame } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import IndiaMap from '@/components/map/IndiaMap';

interface Supplier {
  id: string;
  name: string;
  resourceType: string;
  location: { lat: number; lng: number; state: string };
  price: number;
  carbonIntensity: number;
  capacity: number;
  availability: number;
  recommended: boolean;
  purchaseHistory: {
    date: string;
    amount: number;
    cost: number;
  }[];
}

const GridMap = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [filters, setFilters] = useState({
    resourceTypes: ['solar', 'wind', 'hydro', 'coal'],
    maxPrice: 8.5,
    maxCarbon: 0.8,
    onlyRecommended: false,
  });
  
  // Location filtering
  const [searchLocation, setSearchLocation] = useState('');
  
  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        // In a real app, we would fetch data from Firestore
        // For demo, simulate an API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockSuppliers: Supplier[] = [
          // Karnataka
          {
            id: 's1',
            name: 'SolarPrime Energy',
            resourceType: 'solar',
            location: { lat: 12.9716, lng: 77.5946, state: 'Karnataka' },
            price: 4.2, // INR per kWh
            carbonIntensity: 0.02, // CO2 tons per MWh
            capacity: 150, // MW
            availability: 85, // %
            recommended: true,
            purchaseHistory: [
              { date: '2023-04-10', amount: 120, cost: 504000 },
              { date: '2023-04-05', amount: 100, cost: 420000 },
            ]
          },
          {
            id: 's2',
            name: 'WindForce Karnataka',
            resourceType: 'wind',
            location: { lat: 13.1986, lng: 77.7066, state: 'Karnataka' },
            price: 3.8,
            carbonIntensity: 0.01,
            capacity: 200,
            availability: 72,
            recommended: true,
            purchaseHistory: [
              { date: '2023-04-09', amount: 150, cost: 570000 },
            ]
          },
          {
            id: 's3',
            name: 'HydroFlow Power',
            resourceType: 'hydro',
            location: { lat: 12.8065, lng: 77.5968, state: 'Karnataka' },
            price: 4.5,
            carbonIntensity: 0.03,
            capacity: 300,
            availability: 95,
            recommended: false,
            purchaseHistory: []
          },
          
          // Maharashtra
          {
            id: 's7',
            name: 'Maharashtra Solar',
            resourceType: 'solar',
            location: { lat: 19.0760, lng: 72.8777, state: 'Maharashtra' },
            price: 4.1,
            carbonIntensity: 0.02,
            capacity: 200,
            availability: 88,
            recommended: true,
            purchaseHistory: [
              { date: '2023-04-08', amount: 180, cost: 738000 },
            ]
          },
          {
            id: 's11',
            name: 'Pune Wind Energy',
            resourceType: 'wind',
            location: { lat: 18.5204, lng: 73.8567, state: 'Maharashtra' },
            price: 3.9,
            carbonIntensity: 0.01,
            capacity: 180,
            availability: 75,
            recommended: false,
            purchaseHistory: []
          },
          {
            id: 's12',
            name: 'Nagpur Thermal',
            resourceType: 'coal',
            location: { lat: 21.1458, lng: 79.0882, state: 'Maharashtra' },
            price: 3.0,
            carbonIntensity: 0.79,
            capacity: 500,
            availability: 98,
            recommended: false,
            purchaseHistory: [
              { date: '2023-04-10', amount: 450, cost: 1350000 },
            ]
          },
          
          // Gujarat
          {
            id: 's8',
            name: 'Gujarat Wind Farm',
            resourceType: 'wind',
            location: { lat: 23.0225, lng: 72.5714, state: 'Gujarat' },
            price: 3.7,
            carbonIntensity: 0.01,
            capacity: 250,
            availability: 75,
            recommended: true,
            purchaseHistory: []
          },
          {
            id: 's13',
            name: 'Kutch Solar Park',
            resourceType: 'solar',
            location: { lat: 23.7337, lng: 69.7999, state: 'Gujarat' },
            price: 4.0,
            carbonIntensity: 0.02,
            capacity: 300,
            availability: 90,
            recommended: true,
            purchaseHistory: [
              { date: '2023-04-07', amount: 280, cost: 1120000 },
            ]
          },
          
          // Tamil Nadu
          {
            id: 's9',
            name: 'Tamil Nadu Power',
            resourceType: 'hydro',
            location: { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu' },
            price: 4.4,
            carbonIntensity: 0.03,
            capacity: 180,
            availability: 92,
            recommended: false,
            purchaseHistory: [
              { date: '2023-04-12', amount: 160, cost: 704000 },
            ]
          },
          {
            id: 's14',
            name: 'Coimbatore Wind',
            resourceType: 'wind',
            location: { lat: 11.0168, lng: 76.9558, state: 'Tamil Nadu' },
            price: 3.8,
            carbonIntensity: 0.01,
            capacity: 220,
            availability: 78,
            recommended: false,
            purchaseHistory: []
          },
          
          // Rajasthan
          {
            id: 's15',
            name: 'Rajasthan Sun Energy',
            resourceType: 'solar',
            location: { lat: 26.9124, lng: 75.7873, state: 'Rajasthan' },
            price: 3.9,
            carbonIntensity: 0.02,
            capacity: 350,
            availability: 95,
            recommended: true,
            purchaseHistory: [
              { date: '2023-04-06', amount: 330, cost: 1287000 },
            ]
          },
          {
            id: 's16',
            name: 'Jodhpur Solar',
            resourceType: 'solar',
            location: { lat: 26.2389, lng: 73.0243, state: 'Rajasthan' },
            price: 3.8,
            carbonIntensity: 0.02,
            capacity: 280,
            availability: 92,
            recommended: true,
            purchaseHistory: []
          },
          
          // Uttar Pradesh
          {
            id: 's17',
            name: 'UP Thermal Plant',
            resourceType: 'coal',
            location: { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh' },
            price: 2.8,
            carbonIntensity: 0.78,
            capacity: 550,
            availability: 97,
            recommended: false,
            purchaseHistory: [
              { date: '2023-04-09', amount: 500, cost: 1400000 },
            ]
          },
          {
            id: 's18',
            name: 'Allahabad Power',
            resourceType: 'coal',
            location: { lat: 25.4358, lng: 81.8463, state: 'Uttar Pradesh' },
            price: 2.9,
            carbonIntensity: 0.77,
            capacity: 480,
            availability: 96,
            recommended: false,
            purchaseHistory: []
          },
          
          // West Bengal
          {
            id: 's19',
            name: 'Bengal Hydro',
            resourceType: 'hydro',
            location: { lat: 22.5726, lng: 88.3639, state: 'West Bengal' },
            price: 4.3,
            carbonIntensity: 0.03,
            capacity: 200,
            availability: 90,
            recommended: true,
            purchaseHistory: [
              { date: '2023-04-11', amount: 180, cost: 774000 },
            ]
          },
          
          // Assam
          {
            id: 's20',
            name: 'Assam Green',
            resourceType: 'hydro',
            location: { lat: 26.1433, lng: 91.7898, state: 'Assam' },
            price: 4.6,
            carbonIntensity: 0.03,
            capacity: 160,
            availability: 88,
            recommended: false,
            purchaseHistory: []
          },
          
          // Delhi
          {
            id: 's21',
            name: 'Delhi Urban Solar',
            resourceType: 'solar',
            location: { lat: 28.7041, lng: 77.1025, state: 'Delhi' },
            price: 4.5,
            carbonIntensity: 0.02,
            capacity: 100,
            availability: 80,
            recommended: false,
            purchaseHistory: [
              { date: '2023-04-05', amount: 90, cost: 405000 },
            ]
          },
          
          // Punjab
          {
            id: 's22',
            name: 'Punjab Wind Farm',
            resourceType: 'wind',
            location: { lat: 31.1471, lng: 75.3412, state: 'Punjab' },
            price: 3.9,
            carbonIntensity: 0.01,
            capacity: 190,
            availability: 72,
            recommended: true,
            purchaseHistory: []
          },
          
          // Telangana
          {
            id: 's23',
            name: 'Telangana Solar',
            resourceType: 'solar',
            location: { lat: 17.3850, lng: 78.4867, state: 'Telangana' },
            price: 4.0,
            carbonIntensity: 0.02,
            capacity: 230,
            availability: 89,
            recommended: true,
            purchaseHistory: [
              { date: '2023-04-03', amount: 210, cost: 840000 },
            ]
          },
        ];
        
        setSuppliers(mockSuppliers);
      } catch (error) {
        toast({
          title: "Error loading suppliers",
          description: "Failed to load supplier data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuppliers();
  }, [toast]);
  
  // Filter suppliers based on criteria
  const filteredSuppliers = suppliers.filter(supplier => {
    // Filter by resource type
    if (!filters.resourceTypes.includes(supplier.resourceType)) {
      return false;
    }
    
    // Filter by price
    if (supplier.price > filters.maxPrice) {
      return false;
    }
    
    // Filter by carbon intensity
    if (supplier.carbonIntensity > filters.maxCarbon) {
      return false;
    }
    
    // Filter by recommendation
    if (filters.onlyRecommended && !supplier.recommended) {
      return false;
    }
    
    // Filter by location search
    if (searchLocation && !supplier.name.toLowerCase().includes(searchLocation.toLowerCase()) && 
        !supplier.location.state.toLowerCase().includes(searchLocation.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const handleSupplierClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };
  
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case 'solar':
        return <Sun className="h-4 w-4" />;
      case 'wind':
        return <Wind className="h-4 w-4" />;
      case 'hydro':
        return <Droplet className="h-4 w-4" />;
      case 'coal':
      default:
        return <Flame className="h-4 w-4" />;
    }
  };
  
  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'solar':
        return 'bg-yellow-500';
      case 'wind':
        return 'bg-blue-500';
      case 'hydro':
        return 'bg-cyan-500';
      case 'coal':
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold">Grid Map</h1>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search location or supplier"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-8 w-[200px]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Filters Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter Suppliers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Resource Type Filters */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Resource Types</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filters.resourceTypes.includes('solar') ? 'default' : 'outline'}
                    size="sm"
                    className={filters.resourceTypes.includes('solar') ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        resourceTypes: prev.resourceTypes.includes('solar')
                          ? prev.resourceTypes.filter(t => t !== 'solar')
                          : [...prev.resourceTypes, 'solar']
                      }))
                    }}
                  >
                    <Sun className="h-4 w-4 mr-1" />
                    Solar
                  </Button>
                  <Button
                    variant={filters.resourceTypes.includes('wind') ? 'default' : 'outline'}
                    size="sm"
                    className={filters.resourceTypes.includes('wind') ? 'bg-blue-500 hover:bg-blue-600' : ''}
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        resourceTypes: prev.resourceTypes.includes('wind')
                          ? prev.resourceTypes.filter(t => t !== 'wind')
                          : [...prev.resourceTypes, 'wind']
                      }))
                    }}
                  >
                    <Wind className="h-4 w-4 mr-1" />
                    Wind
                  </Button>
                  <Button
                    variant={filters.resourceTypes.includes('hydro') ? 'default' : 'outline'}
                    size="sm"
                    className={filters.resourceTypes.includes('hydro') ? 'bg-cyan-500 hover:bg-cyan-600' : ''}
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        resourceTypes: prev.resourceTypes.includes('hydro')
                          ? prev.resourceTypes.filter(t => t !== 'hydro')
                          : [...prev.resourceTypes, 'hydro']
                      }))
                    }}
                  >
                    <Droplet className="h-4 w-4 mr-1" />
                    Hydro
                  </Button>
                  <Button
                    variant={filters.resourceTypes.includes('coal') ? 'default' : 'outline'}
                    size="sm"
                    className={filters.resourceTypes.includes('coal') ? 'bg-gray-500 hover:bg-gray-600' : ''}
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        resourceTypes: prev.resourceTypes.includes('coal')
                          ? prev.resourceTypes.filter(t => t !== 'coal')
                          : [...prev.resourceTypes, 'coal']
                      }))
                    }}
                  >
                    <Flame className="h-4 w-4 mr-1" />
                    Coal
                  </Button>
                </div>
              </div>
              
              {/* Price Filter */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Maximum Price (₹/kWh)</h3>
                  <span className="text-sm font-medium">{filters.maxPrice.toFixed(2)}</span>
                </div>
                <Slider
                  value={[filters.maxPrice]}
                  min={2}
                  max={10}
                  step={0.1}
                  onValueChange={(values) => setFilters(prev => ({ ...prev, maxPrice: values[0] }))}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹2.00</span>
                  <span>₹10.00</span>
                </div>
              </div>
              
              {/* Carbon Intensity Filter */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">Carbon Intensity (tCO₂/MWh)</h3>
                  <span className="text-sm font-medium">{filters.maxCarbon.toFixed(2)}</span>
                </div>
                <Slider
                  value={[filters.maxCarbon]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(values) => setFilters(prev => ({ ...prev, maxCarbon: values[0] }))}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Low (0)</span>
                  <span>High (1)</span>
                </div>
              </div>
              
              {/* Only Recommended */}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="recommended"
                  checked={filters.onlyRecommended}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, onlyRecommended: checked }))}
                />
                <Label htmlFor="recommended">Only SLDC Recommended</Label>
              </div>
            </CardContent>
          </Card>
          
          {/* Map and Supplier List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced India Map Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Map className="h-5 w-5 mr-2" />
                  India Power Grid Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                {loading ? (
                  <div className="flex justify-center items-center h-[500px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <IndiaMap
                    locations={filteredSuppliers.map(supplier => ({
                      name: supplier.name,
                      lat: supplier.location.lat,
                      lng: supplier.location.lng,
                      state: supplier.location.state,
                      resourceType: supplier.resourceType
                    }))}
                    selectedLocation={selectedSupplier ? {
                      name: selectedSupplier.name,
                      lat: selectedSupplier.location.lat,
                      lng: selectedSupplier.location.lng,
                      state: selectedSupplier.location.state,
                      resourceType: selectedSupplier.resourceType
                    } : null}
                    onLocationSelect={(location) => {
                      const supplier = suppliers.find(s => s.name === location.name);
                      if (supplier) {
                        handleSupplierClick(supplier);
                      }
                    }}
                  />
                )}
              </CardContent>
            </Card>
            
            {/* Supplier List */}
            <Card>
              <CardHeader>
                <CardTitle>Available Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredSuppliers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No suppliers match your filters</p>
                    <Button variant="outline" onClick={() => setFilters({
                      resourceTypes: ['solar', 'wind', 'hydro', 'coal'],
                      maxPrice: 8.5,
                      maxCarbon: 0.8,
                      onlyRecommended: false,
                    })}>
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <Tabs defaultValue="list" className="mt-2">
                    <TabsList>
                      <TabsTrigger value="list">List View</TabsTrigger>
                      <TabsTrigger value="selected">
                        Selected Supplier
                        {selectedSupplier && <span className="ml-1">({selectedSupplier.name})</span>}
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="list">
                      <div className="space-y-4 mt-4">
                        {filteredSuppliers.map((supplier) => (
                          <div 
                            key={supplier.id}
                            className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                              selectedSupplier?.id === supplier.id ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'
                            }`}
                            onClick={() => handleSupplierClick(supplier)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getResourceTypeColor(supplier.resourceType)}`}>
                                {getResourceTypeIcon(supplier.resourceType)}
                              </div>
                              <div>
                                <h3 className="font-medium">{supplier.name}</h3>
                                <div className="flex items-center space-x-2 text-sm">
                                  <span className="text-gray-500">{supplier.location.state}</span>
                                  <span className="text-gray-500">•</span>
                                  <span className="capitalize">{supplier.resourceType}</span>
                                  {supplier.recommended && (
                                    <>
                                      <span className="text-gray-500">•</span>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        Recommended
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">₹{supplier.price.toFixed(2)}/kWh</div>
                              <div className="text-sm text-gray-500">{supplier.carbonIntensity.toFixed(2)} tCO₂/MWh</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="selected">
                      {!selectedSupplier ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500">Select a supplier from the map or list</p>
                        </div>
                      ) : (
                        <div className="space-y-6 mt-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getResourceTypeColor(selectedSupplier.resourceType)}`}>
                                {getResourceTypeIcon(selectedSupplier.resourceType)}
                              </div>
                              <div>
                                <h2 className="text-xl font-semibold">{selectedSupplier.name}</h2>
                                <div className="flex items-center space-x-2">
                                  <span className="capitalize">{selectedSupplier.resourceType}</span>
                                  <span>•</span>
                                  <span>{selectedSupplier.location.state}</span>
                                  {selectedSupplier.recommended && (
                                    <>
                                      <span>•</span>
                                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        SLDC Recommended
                                      </Badge>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <Button className="mt-4 sm:mt-0">Record Purchase</Button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Price</div>
                              <div className="text-2xl font-bold">₹{selectedSupplier.price.toFixed(2)}</div>
                              <div className="text-xs text-gray-500">per kWh</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Carbon</div>
                              <div className="text-2xl font-bold">{selectedSupplier.carbonIntensity.toFixed(2)}</div>
                              <div className="text-xs text-gray-500">tCO₂/MWh</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Capacity</div>
                              <div className="text-2xl font-bold">{selectedSupplier.capacity}</div>
                              <div className="text-xs text-gray-500">MW</div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                              <div className="text-sm text-gray-500 mb-1">Availability</div>
                              <div className="text-2xl font-bold">{selectedSupplier.availability}%</div>
                              <div className="text-xs text-gray-500">uptime</div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-3">Purchase History</h3>
                            {selectedSupplier.purchaseHistory.length > 0 ? (
                              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                                <table className="min-w-full">
                                  <thead>
                                    <tr className="bg-gray-100 dark:bg-gray-700">
                                      <th className="py-2 px-4 text-left">Date</th>
                                      <th className="py-2 px-4 text-left">Amount (MW)</th>
                                      <th className="py-2 px-4 text-left">Cost (₹)</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedSupplier.purchaseHistory.map((purchase: any, index: number) => (
                                      <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                                        <td className="py-2 px-4">{new Date(purchase.date).toLocaleDateString()}</td>
                                        <td className="py-2 px-4">{purchase.amount}</td>
                                        <td className="py-2 px-4">₹{purchase.cost.toLocaleString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-gray-500">No purchase history available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GridMap;
