
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

const resourceTypes = [
  { id: 'solar', label: 'Solar' },
  { id: 'wind', label: 'Wind' },
  { id: 'hydro', label: 'Hydro' },
  { id: 'coal', label: 'Coal' },
  { id: 'gas', label: 'Natural Gas' },
  { id: 'biomass', label: 'Biomass' },
  { id: 'nuclear', label: 'Nuclear' }
];

const GeneratorManagement = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  
  // Mock user data with resource types
  const initialResourceTypes = ['solar', 'wind']; // In a real app, this would come from user data
  
  const [orgName, setOrgName] = useState(user?.name || 'EnergyVision Generator');
  const [state, setState] = useState(user?.state || 'Karnataka');
  const [selectedResourceTypes, setSelectedResourceTypes] = useState<string[]>(initialResourceTypes);
  const [saving, setSaving] = useState(false);

  const handleResourceTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedResourceTypes([...selectedResourceTypes, typeId]);
    } else {
      setSelectedResourceTypes(selectedResourceTypes.filter(id => id !== typeId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // In a real app, we would update the user data in Firestore
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
              Update your organization details and resource types
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
                  <Label className="mb-2">Resource Types</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resourceTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`resource-${type.id}`}
                          checked={selectedResourceTypes.includes(type.id)}
                          onCheckedChange={(checked) => 
                            handleResourceTypeChange(type.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={`resource-${type.id}`}>{type.label}</Label>
                      </div>
                    ))}
                  </div>
                  {selectedResourceTypes.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      Please select at least one resource type
                    </p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full sm:w-auto" 
                disabled={saving || selectedResourceTypes.length === 0}
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

export default GeneratorManagement;
