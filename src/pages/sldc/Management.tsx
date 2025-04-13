
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Settings } from 'lucide-react';

const SldcManagement = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { toast } = useToast();
  
  const [orgName, setOrgName] = useState(user?.organizationId || 'WattWise SLDC');
  const [state, setState] = useState(user?.state || 'Karnataka');
  const [settings, setSettings] = useState({
    automaticVerification: false,
    notifyOnScheduleSubmission: true,
    notifyOnReportSubmission: true,
    enablePredictionCorrection: false
  });
  const [saving, setSaving] = useState(false);

  const handleSettingChange = (setting: keyof typeof settings, checked: boolean) => {
    setSettings({
      ...settings,
      [setting]: checked
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // In a real app, we would update the user data in backend
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
              Update your SLDC details and notification preferences
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

                <div className="grid gap-4 pt-2">
                  <Label className="mb-2">Notification Preferences</Label>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notify on Schedule Submission</p>
                      <p className="text-sm text-gray-500">Get notified when generators submit schedules</p>
                    </div>
                    <Switch
                      checked={settings.notifyOnScheduleSubmission}
                      onCheckedChange={(checked) => handleSettingChange('notifyOnScheduleSubmission', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notify on Report Submission</p>
                      <p className="text-sm text-gray-500">Get notified when purchasers submit reports</p>
                    </div>
                    <Switch
                      checked={settings.notifyOnReportSubmission}
                      onCheckedChange={(checked) => handleSettingChange('notifyOnReportSubmission', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Automatic Verification</p>
                      <p className="text-sm text-gray-500">Enable automatic verification of reports with minor issues</p>
                    </div>
                    <Switch
                      checked={settings.automaticVerification}
                      onCheckedChange={(checked) => handleSettingChange('automaticVerification', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Prediction Correction</p>
                      <p className="text-sm text-gray-500">Automatically suggest corrections for prediction errors</p>
                    </div>
                    <Switch
                      checked={settings.enablePredictionCorrection}
                      onCheckedChange={(checked) => handleSettingChange('enablePredictionCorrection', checked)}
                    />
                  </div>
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
      </div>
    </MainLayout>
  );
};

export default SldcManagement;
