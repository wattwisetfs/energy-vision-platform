import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { 
  BarChart3, 
  Zap, 
  Sun, 
  Wind,
  LineChart,
  AreaChart,
  MapPin,
  Check
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header/Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Logo />
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                  Features
                </a>
                <a href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                  How It Works
                </a>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                  About
                </Link>
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
                Smarter Energy Predictions for a Sustainable Future
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto lg:mx-0">
                WattWise combines advanced analytics with real-time data to optimize energy forecasting, 
                generation scheduling, and consumption patterns - helping build a more sustainable grid.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Log In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-energy-blue/10 to-energy-green/10 rounded-xl" />
              <div className="relative p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <Logo size="sm" withText={false} />
                    <span className="text-sm text-gray-500">Last 7 Days</span>
                  </div>
                  <div className="aspect-[1.5/1] bg-gradient-to-r from-energy-blue/80 to-energy-green/80 rounded-lg flex items-end p-3">
                    {/* Mock chart visualization */}
                    <div className="h-1/3 w-1/8 bg-white/90 rounded-sm mx-0.5 animate-pulse"></div>
                    <div className="h-1/2 w-1/8 bg-white/90 rounded-sm mx-0.5"></div>
                    <div className="h-2/5 w-1/8 bg-white/90 rounded-sm mx-0.5"></div>
                    <div className="h-3/4 w-1/8 bg-white/90 rounded-sm mx-0.5"></div>
                    <div className="h-1/2 w-1/8 bg-white/90 rounded-sm mx-0.5"></div>
                    <div className="h-2/3 w-1/8 bg-white/90 rounded-sm mx-0.5 animate-pulse"></div>
                    <div className="h-4/5 w-1/8 bg-white/90 rounded-sm mx-0.5"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Peak Load</div>
                      <div className="text-xl font-semibold">482 MW</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Avg. Load</div>
                      <div className="text-xl font-semibold">356 MW</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">Carbon</div>
                      <div className="text-xl font-semibold">0.32 t/MWh</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white dark:bg-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features for All Energy Stakeholders
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Our platform caters to Generators, Purchasers, and SLDCs with tailored tools for each role.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Generator Features */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Sun className="h-6 w-6 text-energy-blue" />
                </div>
                <h3 className="mt-5 text-xl font-medium text-gray-900 dark:text-white">For Generators</h3>
                <ul className="mt-4 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-energy-green" />
                    </div>
                    <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      Resource-specific dashboard with production analytics
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-energy-green" />
                    </div>
                    <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      Schedule submission system with status tracking
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-energy-green" />
                    </div>
                    <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      Carbon offset and efficiency metrics
                    </p>
                  </li>
                </ul>
              </div>

              {/* Purchaser Features */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-energy-green" />
                </div>
                <h3 className="mt-5 text-xl font-medium text-gray-900 dark:text-white">For Purchasers (Discoms)</h3>
                <ul className="mt-4 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-energy-green" />
                    </div>
                    <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      AI-powered demand forecasting with feature analysis
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-energy-green" />
                    </div>
                    <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      Interactive supplier map with sustainability metrics
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-energy-green" />
                    </div>
                    <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      Purchase optimization for cost or carbon reduction
                    </p>
                  </li>
                </ul>
              </div>

              {/* SLDC Features */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="mt-5 text-xl font-medium text-gray-900 dark:text-white">For SLDCs</h3>
                <ul className="mt-4 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-energy-green" />
                    </div>
                    <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      Unified dashboard with all schedules and reports
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-energy-green" />
                    </div>
                    <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      Streamlined verification system with suggestions
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-energy-green" />
                    </div>
                    <p className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      Grid-level analytics and supplier recommendations
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              How WattWise Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              A streamlined platform connecting energy producers, purchasers and regulators
            </p>
          </div>

          <div className="mt-16">
            <div className="relative">
              {/* Connection line */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2" />
              
              <div className="relative z-10">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                  <div className="mt-10 lg:mt-0 lg:col-start-1">
                    <div className="pr-4 -ml-4 relative lg:ml-0">
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:p-10">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-energy-blue text-white">
                          <Sun className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">1. Generators Submit Schedules</h3>
                        <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                          Energy producers submit their generation schedules through our platform, providing details on resource types,
                          production forecasts, and available capacity.
                        </p>
                      </div>
                      
                      {/* Connector dot */}
                      <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-energy-blue border-4 border-white dark:border-gray-900" />
                    </div>
                  </div>
                  
                  <div className="lg:col-start-2">
                    {/* Placeholder for first step */}
                    <div className="mt-10 lg:mt-0 relative h-64 bg-gradient-to-r from-energy-blue/10 to-energy-green/10 rounded-xl flex items-center justify-center">
                      <LineChart className="h-16 w-16 text-energy-blue/50" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-12 sm:mt-16">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                  <div className="lg:col-start-2">
                    <div className="pl-4 -mr-4 relative lg:mr-0">
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:p-10">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-energy-green text-white">
                          <AreaChart className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">2. AI Predicts Demand</h3>
                        <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                          Our XGBoost model processes historical data, weather conditions, time factors, and more to generate
                          accurate demand forecasts for purchasers, with detailed feature impact analysis.
                        </p>
                      </div>
                      
                      {/* Connector dot */}
                      <div className="hidden lg:block absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-energy-green border-4 border-white dark:border-gray-900" />
                    </div>
                  </div>
                  
                  <div className="mt-10 lg:mt-0 lg:col-start-1">
                    {/* Placeholder for second step */}
                    <div className="relative h-64 bg-gradient-to-r from-energy-green/10 to-energy-blue/10 rounded-xl flex items-center justify-center">
                      <Zap className="h-16 w-16 text-energy-green/50" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-12 sm:mt-16">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                  <div className="mt-10 lg:mt-0 lg:col-start-1">
                    <div className="pr-4 -ml-4 relative lg:ml-0">
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:p-10">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-600 text-white">
                          <MapPin className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">3. Purchasers Optimize Buying</h3>
                        <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                          Using our interactive grid map, purchasers can identify optimal suppliers based on cost, carbon
                          impact, and location, creating a more sustainable and efficient energy market.
                        </p>
                      </div>
                      
                      {/* Connector dot */}
                      <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-purple-600 border-4 border-white dark:border-gray-900" />
                    </div>
                  </div>
                  
                  <div className="lg:col-start-2">
                    {/* Placeholder for third step */}
                    <div className="mt-10 lg:mt-0 relative h-64 bg-gradient-to-r from-purple-600/10 to-energy-blue/10 rounded-xl flex items-center justify-center">
                      <Wind className="h-16 w-16 text-purple-600/50" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-12 sm:mt-16">
                <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                  <div className="lg:col-start-2">
                    <div className="pl-4 -mr-4 relative lg:mr-0">
                      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 lg:p-10">
                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-energy-blue text-white">
                          <BarChart3 className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-xl font-medium text-gray-900 dark:text-white">4. SLDC Verification</h3>
                        <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
                          SLDCs review and verify submitted schedules and reports, providing feedback and supplier 
                          recommendations to ensure grid stability and regulatory compliance.
                        </p>
                      </div>
                      
                      {/* Connector dot */}
                      <div className="hidden lg:block absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-energy-blue border-4 border-white dark:border-gray-900" />
                    </div>
                  </div>
                  
                  <div className="mt-10 lg:mt-0 lg:col-start-1">
                    {/* Placeholder for fourth step */}
                    <div className="relative h-64 bg-gradient-to-r from-energy-blue/10 to-energy-green/10 rounded-xl flex items-center justify-center">
                      <BarChart3 className="h-16 w-16 text-energy-blue/50" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-energy-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <div className="flex justify-center mb-6">
            <Logo size="lg" className="text-white" />
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Ready to transform your energy operations?
          </h2>
          <p className="mt-4 text-lg leading-6 max-w-2xl mx-auto">
            Join WattWise today and access powerful tools for forecasting, optimization, and sustainability.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-energy-blue hover:bg-gray-100">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Logo className="text-white" />
              <p className="mt-4 text-sm">
                Smarter energy predictions for a sustainable future.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Navigate</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#features" className="text-sm hover:text-white">Features</a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-sm hover:text-white">How It Works</a>
                </li>
                <li>
                  <Link to="/about" className="text-sm hover:text-white">About</Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">Account</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/login" className="text-sm hover:text-white">Log In</Link>
                </li>
                <li>
                  <Link to="/signup" className="text-sm hover:text-white">Sign Up</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between">
            <p className="text-sm">© 2023 WattWise. All rights reserved.</p>
            <div className="mt-4 sm:mt-0 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
