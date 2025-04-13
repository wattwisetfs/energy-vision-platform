
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

// Purchaser pages
import PurchaserDashboard from "./pages/purchaser/Dashboard";

// SLDC pages
import SldcDashboard from "./pages/sldc/Dashboard";

// 404 page
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/generator/schedules" element={<div>Schedules Page - Coming Soon</div>} />
            <Route path="/generator/management" element={<div>Management Page - Coming Soon</div>} />
            <Route path="/generator/notifications" element={<div>Notifications Page - Coming Soon</div>} />
            
            {/* Purchaser Routes */}
            <Route path="/purchaser/dashboard" element={<PurchaserDashboard />} />
            <Route path="/purchaser/predictions" element={<div>Predictions Page - Coming Soon</div>} />
            <Route path="/purchaser/grid-map" element={<div>Grid Map Page - Coming Soon</div>} />
            <Route path="/purchaser/purchases" element={<div>Purchases Page - Coming Soon</div>} />
            <Route path="/purchaser/reports" element={<div>Reports Page - Coming Soon</div>} />
            <Route path="/purchaser/management" element={<div>Management Page - Coming Soon</div>} />
            <Route path="/purchaser/notifications" element={<div>Notifications Page - Coming Soon</div>} />
            
            {/* SLDC Routes */}
            <Route path="/sldc/dashboard" element={<SldcDashboard />} />
            <Route path="/sldc/schedules" element={<div>Schedules Page - Coming Soon</div>} />
            <Route path="/sldc/reports" element={<div>Reports Page - Coming Soon</div>} />
            <Route path="/sldc/management" element={<div>Management Page - Coming Soon</div>} />
            <Route path="/sldc/notifications" element={<div>Notifications Page - Coming Soon</div>} />
            
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

export default App;
