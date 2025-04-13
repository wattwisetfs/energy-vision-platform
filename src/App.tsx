
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';

// Public pages
import LandingPage from "./pages/landing/LandingPage";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/Signup";

// Generator pages
import GeneratorDashboard from "./pages/generator/Dashboard";
import GeneratorSchedules from "./pages/generator/Schedules";
import GeneratorManagement from "./pages/generator/Management";
import GeneratorNotifications from "./pages/generator/Notifications";

// Purchaser pages
import PurchaserDashboard from "./pages/purchaser/Dashboard";
import PurchaserPredictions from "./pages/purchaser/Predictions";
import PurchaserGridMap from "./pages/purchaser/GridMap";
import PurchaserPurchases from "./pages/purchaser/Purchases";
import PurchaserReports from "./pages/purchaser/Reports";
import PurchaserManagement from "./pages/purchaser/Management";
import PurchaserNotifications from "./pages/purchaser/Notifications";

// SLDC pages
import SldcDashboard from "./pages/sldc/Dashboard";
import SldcSchedules from "./pages/sldc/Schedules";
import SldcReports from "./pages/sldc/Reports";
import SldcManagement from "./pages/sldc/Management";
import SldcNotifications from "./pages/sldc/Notifications";

// 404 page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              
              {/* Generator Routes */}
              <Route path="/generator/dashboard" element={<GeneratorDashboard />} />
              <Route path="/generator/schedules" element={<GeneratorSchedules />} />
              <Route path="/generator/management" element={<GeneratorManagement />} />
              <Route path="/generator/notifications" element={<GeneratorNotifications />} />
              
              {/* Purchaser Routes */}
              <Route path="/purchaser/dashboard" element={<PurchaserDashboard />} />
              <Route path="/purchaser/predictions" element={<PurchaserPredictions />} />
              <Route path="/purchaser/grid-map" element={<PurchaserGridMap />} />
              <Route path="/purchaser/purchases" element={<PurchaserPurchases />} />
              <Route path="/purchaser/reports" element={<PurchaserReports />} />
              <Route path="/purchaser/management" element={<PurchaserManagement />} />
              <Route path="/purchaser/notifications" element={<PurchaserNotifications />} />
              
              {/* SLDC Routes - now using our implemented pages */}
              <Route path="/sldc/dashboard" element={<SldcDashboard />} />
              <Route path="/sldc/schedules" element={<SldcSchedules />} />
              <Route path="/sldc/reports" element={<SldcReports />} />
              <Route path="/sldc/management" element={<SldcManagement />} />
              <Route path="/sldc/notifications" element={<SldcNotifications />} />
              
              {/* Default redirect to home */}
              <Route path="/index" element={<Navigate replace to="/" />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
