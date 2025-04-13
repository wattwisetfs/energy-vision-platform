
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signUp } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Loader2, Sun, Wind, Box, Zap } from 'lucide-react';
import { UserRole } from '@/types';

// Helper components for role selection
interface RoleButtonProps {
  role: UserRole;
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: (role: UserRole) => void;
  selected: boolean;
}

const RoleButton = ({ role, icon, title, description, onClick, selected }: RoleButtonProps) => (
  <button
    type="button"
    onClick={() => onClick(role)}
    className={`p-4 rounded-lg border ${
      selected 
        ? 'border-primary bg-primary/5 ring-2 ring-primary/30' 
        : 'border-gray-200 hover:border-primary/50 dark:border-gray-700 dark:hover:border-gray-600'
    } transition-all w-full text-left flex flex-col`}
  >
    <div className="flex items-center mb-2">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selected ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
        {icon}
      </div>
      <h3 className="ml-3 font-medium">{title}</h3>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </button>
);

const SignUp = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orgName, setOrgName] = useState('');
  const [state, setState] = useState('Karnataka');
  const [resourceTypes, setResourceTypes] = useState<string[]>(['solar']);
  const [demandProfile, setDemandProfile] = useState<'industrial' | 'residential' | 'mixed'>('mixed');
  const [purchasePriority, setPurchasePriority] = useState<'cost' | 'sustainability' | 'balanced'>('balanced');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) {
      setError('Please select a role to continue.');
      return;
    }
    setStep(2);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedRole || !email || !password || !orgName || !state) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // @ts-ignore
      const resultAction = await dispatch(signUp({
        email,
        password,
        role: selectedRole,
        orgName,
        state,
        // Additional fields based on role
        ...(selectedRole === 'generator' && { resourceTypes }),
        ...(selectedRole === 'purchaser' && { demandProfile, purchasePriority })
      }));
      
      if (signUp.fulfilled.match(resultAction)) {
        navigate(`/${selectedRole}/dashboard`);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setError(typeof error === 'string' ? error : 'An error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  const states = [
    "Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", 
    "Telangana", "Maharashtra", "Gujarat", "Rajasthan"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-16 h-16 rounded-xl energy-gradient-bg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
            <path d="M12 2v4M12 18v4M5 5l2 2M17 17l2 2M2 12h4M18 12h4M5 19l2-2M17 7l2-2" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Join the EnergyVision platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {step === 1 ? (
            // Step 1: Role selection
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Choose your role</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select the role that best describes your organization.</p>
              </div>
              
              <div className="grid gap-4">
                <RoleButton
                  role="generator"
                  icon={<Sun className="h-5 w-5" />}
                  title="Generator"
                  description="Power producers with solar, wind, hydro, or thermal plants."
                  onClick={handleSelectRole}
                  selected={selectedRole === 'generator'}
                />
                
                <RoleButton
                  role="purchaser"
                  icon={<Zap className="h-5 w-5" />}
                  title="Purchaser (Discom)"
                  description="Distribution companies purchasing power for customers."
                  onClick={handleSelectRole}
                  selected={selectedRole === 'purchaser'}
                />
                
                <RoleButton
                  role="sldc"
                  icon={<Box className="h-5 w-5" />}
                  title="SLDC"
                  description="State Load Dispatch Centre for monitoring and verification."
                  onClick={handleSelectRole}
                  selected={selectedRole === 'sldc'}
                />
              </div>

              {error && (
                <div className="text-sm text-red-500">
                  {error}
                </div>
              )}

              <Button
                onClick={handleContinue}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          ) : (
            // Step 2: Registration form
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role-specific fields */}
              {selectedRole === 'generator' && (
                <div>
                  <Label>Resource Types</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {['solar', 'wind', 'hydro', 'coal'].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          id={`resource-${type}`}
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={resourceTypes.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setResourceTypes([...resourceTypes, type]);
                            } else {
                              setResourceTypes(resourceTypes.filter(t => t !== type));
                            }
                          }}
                        />
                        <label htmlFor={`resource-${type}`} className="ml-2 block text-sm capitalize">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedRole === 'purchaser' && (
                <>
                  <div>
                    <Label htmlFor="demandProfile">Demand Profile</Label>
                    <Select value={demandProfile} onValueChange={(value: any) => setDemandProfile(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="purchasePriority">Purchase Priority</Label>
                    <Select value={purchasePriority} onValueChange={(value: any) => setPurchasePriority(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cost">Cost</SelectItem>
                        <SelectItem value="sustainability">Sustainability</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {error && (
                <div className="text-sm text-red-500">
                  {error}
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Sign up"
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
