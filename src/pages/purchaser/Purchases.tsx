
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import { firebaseService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Download, ShoppingCart, Filter, Search, Plus, Calendar, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";

interface Purchase {
  id: string;
  organizationId: string;
  date: string;
  supplier: string;
  resourceType: string;
  volumeMW: number;
  cost: number;
  carbonEstimate: number;
  location: { lat: number; lon: number };
  purchaseType: string;
  iexType?: string;
}

const PurchaserPurchases = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    resourceType: 'all',
    searchTerm: '',
  });
  
  // New purchase form state
  const [newPurchase, setNewPurchase] = useState({
    supplier: '',
    resourceType: 'solar',
    volumeMW: 0,
    cost: 0,
    date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    purchaseType: 'ppa', // Default purchase type
    iexType: '', // Empty by default
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showIexOptions, setShowIexOptions] = useState(false);
  const [redirectToIex, setRedirectToIex] = useState(false);

  useEffect(() => {
    const fetchPurchases = async () => {
      setLoading(true);
      setError(null);

      try {
        if (user?.organizationId) {
          // For demo, simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockPurchases: Purchase[] = [
            {
              id: 'p1',
              organizationId: user.organizationId,
              date: '2023-04-15',
              supplier: 'SolarPrime Energy',
              resourceType: 'solar',
              volumeMW: 150,
              cost: 630000,
              carbonEstimate: 3,
              location: { lat: 12.9716, lon: 77.5946 },
              purchaseType: 'ppa'
            },
            {
              id: 'p2',
              organizationId: user.organizationId,
              date: '2023-04-10',
              supplier: 'WindForce',
              resourceType: 'wind',
              volumeMW: 200,
              cost: 760000,
              carbonEstimate: 2,
              location: { lat: 13.1986, lon: 77.7066 },
              purchaseType: 'bilateral'
            },
            {
              id: 'p3',
              organizationId: user.organizationId,
              date: '2023-04-05',
              supplier: 'CoalMax Energy',
              resourceType: 'coal',
              volumeMW: 350,
              cost: 1015000,
              carbonEstimate: 273,
              location: { lat: 13.0298, lon: 77.5971 },
              purchaseType: 'external'
            },
            {
              id: 'p4',
              organizationId: user.organizationId,
              date: '2023-04-01',
              supplier: 'HydroFlow Power',
              resourceType: 'hydro',
              volumeMW: 250,
              cost: 1125000,
              carbonEstimate: 7.5,
              location: { lat: 12.8065, lon: 77.5968 },
              purchaseType: 'banking'
            },
            {
              id: 'p5',
              organizationId: user.organizationId,
              date: '2023-03-25',
              supplier: 'MegaSolar',
              resourceType: 'solar',
              volumeMW: 125,
              cost: 500000,
              carbonEstimate: 2.5,
              location: { lat: 12.9010, lon: 77.6210 },
              purchaseType: 'iex',
              iexType: 'dam'
            },
          ];
          
          setPurchases(mockPurchases);
          setFilteredPurchases(mockPurchases);
        }
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setError('Failed to load purchases. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [user]);
  
  useEffect(() => {
    // Apply filters to purchases
    let result = [...purchases];
    
    // Filter by date range
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const pastDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          pastDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          pastDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          pastDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      result = result.filter(purchase => new Date(purchase.date) >= pastDate);
    }
    
    // Filter by resource type
    if (filters.resourceType !== 'all') {
      result = result.filter(purchase => purchase.resourceType === filters.resourceType);
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(purchase => 
        purchase.supplier.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredPurchases(result);
  }, [purchases, filters]);
  
  // Reset the IEX type when purchase type changes
  useEffect(() => {
    if (newPurchase.purchaseType === 'iex') {
      setShowIexOptions(true);
    } else {
      setShowIexOptions(false);
      setNewPurchase(prev => ({ ...prev, iexType: '' }));
    }
  }, [newPurchase.purchaseType]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPurchase(prev => ({
      ...prev,
      [name]: name === 'volumeMW' || name === 'cost' ? parseFloat(value) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewPurchase(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleIexTypeSelect = (type: string) => {
    setNewPurchase(prev => ({ ...prev, iexType: type }));
    setRedirectToIex(true);
    
    // Close the dialog and show a toast message
    setTimeout(() => {
      setDialogOpen(false);
      toast({
        title: "Redirecting to IEX Portal",
        description: `You will be redirected to IEX ${type.toUpperCase()} bidding portal.`,
      });
    }, 500);
    
    // In a real application, this would redirect to the IEX website
    // window.open('https://www.iexindia.com', '_blank');
  };
  
  const handleSubmit = async () => {
    // Validate form
    if (!newPurchase.supplier || !newPurchase.volumeMW || !newPurchase.cost) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // For demo, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Calculate carbon estimate based on resource type
      let carbonFactor;
      switch (newPurchase.resourceType) {
        case 'solar':
        case 'wind':
          carbonFactor = 0.02;
          break;
        case 'hydro':
          carbonFactor = 0.03;
          break;
        case 'coal':
        default:
          carbonFactor = 0.78;
          break;
      }
      
      const carbonEstimate = newPurchase.volumeMW * carbonFactor;
      
      const newPurchaseRecord: Purchase = {
        id: `p${Date.now()}`,
        organizationId: user?.organizationId || '',
        date: newPurchase.date,
        supplier: newPurchase.supplier,
        resourceType: newPurchase.resourceType,
        volumeMW: newPurchase.volumeMW,
        cost: newPurchase.cost,
        carbonEstimate,
        location: { lat: 13.0 + Math.random() * 0.5, lon: 77.5 + Math.random() * 0.5 },
        purchaseType: newPurchase.purchaseType,
        iexType: newPurchase.iexType || undefined
      };
      
      // Update state with new purchase
      setPurchases(prev => [newPurchaseRecord, ...prev]);
      
      toast({
        title: "Purchase Recorded",
        description: "Your purchase has been successfully recorded",
      });
      
      // Reset form and close dialog
      setNewPurchase({
        supplier: '',
        resourceType: 'solar',
        volumeMW: 0,
        cost: 0,
        date: new Date().toISOString().split('T')[0],
        purchaseType: 'ppa',
        iexType: '',
      });
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleExportCSV = () => {
    // Create CSV content
    const header = ['Date', 'Supplier', 'Resource Type', 'Volume (MW)', 'Cost (₹)', 'Carbon Estimate (tons)', 'Purchase Type'];
    const rows = filteredPurchases.map(purchase => [
      purchase.date,
      purchase.supplier,
      purchase.resourceType,
      purchase.volumeMW.toString(),
      purchase.cost.toString(),
      purchase.carbonEstimate.toString(),
      purchase.purchaseType + (purchase.iexType ? ` (${purchase.iexType.toUpperCase()})` : '')
    ]);
    
    const csvContent = [
      header.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `purchases_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'solar':
        return 'bg-yellow-100 text-yellow-800';
      case 'wind':
        return 'bg-blue-100 text-blue-800';
      case 'hydro':
        return 'bg-cyan-100 text-cyan-800';
      case 'coal':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getPurchaseTypeColor = (type: string) => {
    switch (type) {
      case 'ppa':
        return 'bg-green-100 text-green-800';
      case 'bilateral':
        return 'bg-purple-100 text-purple-800';
      case 'external':
        return 'bg-orange-100 text-orange-800';
      case 'banking':
        return 'bg-blue-100 text-blue-800';
      case 'iex':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Calculate totals for the current filtered view
  const calculateTotals = () => {
    return filteredPurchases.reduce((acc, purchase) => {
      return {
        totalMW: acc.totalMW + purchase.volumeMW,
        totalCost: acc.totalCost + purchase.cost,
        totalCarbon: acc.totalCarbon + purchase.carbonEstimate
      };
    }, { totalMW: 0, totalCost: 0, totalCarbon: 0 });
  };
  
  const totals = calculateTotals();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-2xl font-bold flex items-center">
            <img src="/lovable-uploads/6c3f8356-58e2-47b7-a3c1-c8d5498515ee.png" alt="Logo" className="h-8 w-8 mr-2" />
            Energy Purchases
          </h1>
          
          <div className="flex mt-4 md:mt-0 space-x-2">
            <Button variant="outline" onClick={handleExportCSV} disabled={filteredPurchases.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Record Purchase
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record New Purchase</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="purchaseType">Purchase Type</Label>
                    <Select
                      value={newPurchase.purchaseType}
                      onValueChange={(value) => handleSelectChange('purchaseType', value)}
                    >
                      <SelectTrigger id="purchaseType">
                        <SelectValue placeholder="Select purchase type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ppa">Power Purchase Agreement (PPA)</SelectItem>
                        <SelectItem value="external">External Plants</SelectItem>
                        <SelectItem value="bilateral">Bilateral</SelectItem>
                        <SelectItem value="banking">Banking</SelectItem>
                        <SelectItem value="iex">Indian Energy Exchange (IEX)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {showIexOptions && (
                    <div className="grid gap-2">
                      <Label>IEX Market Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex flex-col h-auto p-4"
                          onClick={() => handleIexTypeSelect('dam')}
                        >
                          <span className="font-semibold mb-1">DAM</span>
                          <span className="text-xs text-gray-500">Day-Ahead Market</span>
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex flex-col h-auto p-4"
                          onClick={() => handleIexTypeSelect('rtm')}
                        >
                          <span className="font-semibold mb-1">RTM</span>
                          <span className="text-xs text-gray-500">Real-Time Market</span>
                        </Button>
                      </div>
                      <p className="text-xs text-blue-600 flex items-center mt-1">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Selecting an option will redirect you to IEX bidding platform
                      </p>
                    </div>
                  )}
                  
                  {!showIexOptions && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="supplier">Supplier Name</Label>
                        <Input
                          id="supplier"
                          name="supplier"
                          value={newPurchase.supplier}
                          onChange={handleInputChange}
                          placeholder="Enter supplier name"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="resourceType">Resource Type</Label>
                        <Select
                          value={newPurchase.resourceType}
                          onValueChange={(value) => handleSelectChange('resourceType', value)}
                        >
                          <SelectTrigger id="resourceType">
                            <SelectValue placeholder="Select resource type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solar">Solar</SelectItem>
                            <SelectItem value="wind">Wind</SelectItem>
                            <SelectItem value="hydro">Hydro</SelectItem>
                            <SelectItem value="coal">Coal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="volumeMW">Volume (MW)</Label>
                        <Input
                          id="volumeMW"
                          name="volumeMW"
                          type="number"
                          value={newPurchase.volumeMW || ''}
                          onChange={handleInputChange}
                          placeholder="Enter volume in MW"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="cost">Cost (₹)</Label>
                        <Input
                          id="cost"
                          name="cost"
                          type="number"
                          value={newPurchase.cost || ''}
                          onChange={handleInputChange}
                          placeholder="Enter total cost"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="date">Purchase Date</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={newPurchase.date}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}
                </div>
                
                {!showIexOptions && (
                  <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Save Purchase"
                      )}
                    </Button>
                  </DialogFooter>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Purchases</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Retry
            </Button>
          </Card>
        ) : (
          <>
            {/* Purchase Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Total Energy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totals.totalMW.toLocaleString()} MW</div>
                  <p className="text-sm text-gray-500">{filteredPurchases.length} purchases</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Total Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{totals.totalCost.toLocaleString()}</div>
                  <p className="text-sm text-gray-500">
                    Avg: ₹{(totals.totalMW > 0 ? totals.totalCost / totals.totalMW : 0).toFixed(2)}/MW
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-500">Carbon Footprint</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totals.totalCarbon.toLocaleString()} tons</div>
                  <p className="text-sm text-gray-500">
                    Avg: {(totals.totalMW > 0 ? totals.totalCarbon / totals.totalMW : 0).toFixed(2)} tons/MW
                  </p>
                </CardContent>
              </Card>
            </div>
          
            {/* Filters and Purchases Table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <img src="/lovable-uploads/6c3f8356-58e2-47b7-a3c1-c8d5498515ee.png" alt="Logo" className="h-5 w-5 mr-2" />
                  Purchase History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between mb-4 space-y-2 sm:space-y-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium mr-2">Filter:</span>
                    </div>
                    
                    <Select
                      value={filters.dateRange}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Date Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="month">Last Month</SelectItem>
                        <SelectItem value="quarter">Last Quarter</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={filters.resourceType}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, resourceType: value }))}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Resource Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="solar">Solar</SelectItem>
                        <SelectItem value="wind">Wind</SelectItem>
                        <SelectItem value="hydro">Hydro</SelectItem>
                        <SelectItem value="coal">Coal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search suppliers"
                      value={filters.searchTerm}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                      className="pl-8 w-full sm:w-[200px]"
                    />
                  </div>
                </div>
                
                {filteredPurchases.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium mb-1">No purchases found</h3>
                    <p className="text-gray-500 mb-4">No purchases match your current filters.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setFilters({ dateRange: 'all', resourceType: 'all', searchTerm: '' })}
                    >
                      Reset Filters
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 dark:bg-gray-800">
                            <th className="py-3 px-4 text-left font-medium">Date</th>
                            <th className="py-3 px-4 text-left font-medium">Supplier</th>
                            <th className="py-3 px-4 text-left font-medium">Resource</th>
                            <th className="py-3 px-4 text-left font-medium">Purchase Type</th>
                            <th className="py-3 px-4 text-right font-medium">Volume (MW)</th>
                            <th className="py-3 px-4 text-right font-medium">Cost (₹)</th>
                            <th className="py-3 px-4 text-right font-medium">Carbon (tons)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPurchases.map((purchase) => (
                            <tr key={purchase.id} className="border-t border-gray-200 dark:border-gray-700">
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                                  {new Date(purchase.date).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="py-3 px-4">{purchase.supplier}</td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className={`${getResourceTypeColor(purchase.resourceType)} capitalize`}>
                                  {purchase.resourceType}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <Badge variant="outline" className={`${getPurchaseTypeColor(purchase.purchaseType)} capitalize`}>
                                  {purchase.purchaseType}
                                  {purchase.iexType && ` (${purchase.iexType.toUpperCase()})`}
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-right">{purchase.volumeMW.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">₹{purchase.cost.toLocaleString()}</td>
                              <td className="py-3 px-4 text-right">{purchase.carbonEstimate.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default PurchaserPurchases;
