
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Save, Settings } from 'lucide-react';

const purchaserTypes = [
  { id: 'distribution', label: 'Distribution Company' },
  { id: 'industrial', label: 'Industrial Consumer' },
  { id: 'commercial', label: 'Commercial Entity' },
  { id: 'aggregator', label: 'Demand Aggregator' },
  { id: 'trader', label: 'Power Trader' }
];

const PurchaserManagement = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  
  // Mock user data
  const initialPurchaserTypes = ['distribution']; // In a real app, this would come from user data
  
  const [orgName, setOrgName] = useState(user?.name || 'EnergyVision Purchaser');
  const [state, setState] = useState(user?.state || 'Karnataka');
  const [selectedPurchaserTypes, setSelectedPurchaserTypes] = useState<string[]>(initialPurchaserTypes);
  const [saving, setSaving] = useState(false);

  const handlePurchaserTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedPurchaserTypes([...selectedPurchaserTypes, typeId]);
    } else {
      setSelectedPurchaserTypes(selectedPurchaserTypes.filter(id => id !== typeId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // In a real app, we would update the user data in backend
      // For demo, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings updated",
        description: "Your organization settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Organization Settings
            </CardTitle>
            <CardDescription>
              Update your organization details and purchaser types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2 pt-2">
                  <Label className="mb-2">Purchaser Types</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {purchaserTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`purchaser-${type.id}`}
                          checked={selectedPurchaserTypes.includes(type.id)}
                          onCheckedChange={(checked) => 
                            handlePurchaserTypeChange(type.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={`purchaser-${type.id}`}>{type.label}</Label>
                      </div>
                    ))}
                  </div>
                  {selectedPurchaserTypes.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      Please select at least one purchaser type
                    </p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full sm:w-auto" 
                disabled={saving || selectedPurchaserTypes.length === 0}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PurchaserManagement;
