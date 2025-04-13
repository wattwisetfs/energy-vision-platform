
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Save, Settings, Upload, AlertCircle } from 'lucide-react';

const PurchaserManagement = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  
  // Mock user data
  const [orgName, setOrgName] = useState(user?.organizationName || 'My Discom Company');
  const [state, setState] = useState(user?.state || 'Karnataka');
  const [demandProfile, setDemandProfile] = useState('mixed'); // industrial, residential, mixed
  const [purchasePriority, setPurchasePriority] = useState('balanced'); // cost, sustainability, balanced
  
  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file (e.g., CSV or JSON only)
      const validTypes = ['text/csv', 'application/json'];
      if (!validTypes.includes(selectedFile.type)) {
        setFileUploadError('Please select a CSV or JSON file.');
        return;
      }
      
      // Validate file size (e.g., max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFileUploadError('File size should be less than 5MB.');
        return;
      }
      
      setFile(selectedFile);
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

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    
    try {
      // In a real app, we would upload the file to Firebase Storage
      // For demo, simulate an API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
      
      setFile(null);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
              Update your organization details and preferences
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

                <div className="grid gap-2">
                  <Label htmlFor="demandProfile">Demand Profile</Label>
                  <Select
                    value={demandProfile}
                    onValueChange={setDemandProfile}
                  >
                    <SelectTrigger id="demandProfile">
                      <SelectValue placeholder="Select demand profile" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">This helps tailor forecasting models to your consumption patterns.</p>
                </div>

                <div className="grid gap-2 pt-2">
                  <Label>Purchase Priority</Label>
                  <RadioGroup 
                    value={purchasePriority} 
                    onValueChange={setPurchasePriority}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cost" id="cost" />
                      <Label htmlFor="cost" className="font-normal">Cost Optimized</Label>
                      <span className="text-sm text-gray-500">(Prioritize lowest cost options)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sustainability" id="sustainability" />
                      <Label htmlFor="sustainability" className="font-normal">Sustainability</Label>
                      <span className="text-sm text-gray-500">(Prioritize renewable sources)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="balanced" id="balanced" />
                      <Label htmlFor="balanced" className="font-normal">Balanced</Label>
                      <span className="text-sm text-gray-500">(Balance cost and sustainability)</span>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full sm:w-auto" 
                disabled={saving}
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Upload Historical Consumption
            </CardTitle>
            <CardDescription>
              Upload historical consumption data to improve prediction accuracy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.json"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-gray-500">
                  Upload CSV or JSON file containing hourly consumption data. Max file size: 5MB.
                </p>
                {fileUploadError && (
                  <div className="flex items-center text-red-500 text-sm mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {fileUploadError}
                  </div>
                )}
              </div>
              
              {file && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Button 
                    variant="secondary"
                    onClick={handleUpload}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </Button>
                </div>
              )}
              
              <div className="grid gap-2 pt-2">
                <h3 className="text-sm font-medium">Expected Format</h3>
                <div className="bg-slate-950 p-4 rounded-md overflow-x-auto">
                  <pre className="text-slate-50 text-xs">
{`[
  {
    "date": "2023-01-01",
    "hour": 0,
    "demand_mw": 310.5,
    "temperature": 28.2,
    "is_weekend": true
  },
  {
    "date": "2023-01-01",
    "hour": 1,
    "demand_mw": 290.8,
    "temperature": 27.5,
    "is_weekend": true
  },
  ...
]`}
                  </pre>
                </div>
                <p className="text-xs text-gray-500">
                  Include at least one year of historical data for best results. Temperature and weekend/holiday flags improve forecast accuracy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PurchaserManagement;
