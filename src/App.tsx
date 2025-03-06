
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import Index from "./pages/Index";
import Status from "./pages/Status";
import Look from "./pages/Look";
import Finances from "./pages/Finances";
import Skills from "./pages/Skills";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Component to check if onboarding is completed
const RequireOnboarding = ({ children }: { children: JSX.Element }) => {
  // Check if onboarding is completed
  const onboardingCompleted = localStorage.getItem('zouOnboarding') ? 
    JSON.parse(localStorage.getItem('zouOnboarding') || '{}').isCompleted : 
    false;
  
  const location = useLocation();
  
  // If onboarding is not completed and we're not on the onboarding page, redirect to onboarding
  if (!onboardingCompleted && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return children;
};

// This is the main app container that wraps the Router
const AppContainer = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// This component contains all the routes and needs access to Router context
const AppRoutes = () => {
  return (
    <OnboardingProvider>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={
          <RequireOnboarding>
            <Index />
          </RequireOnboarding>
        } />
        <Route path="/status" element={
          <RequireOnboarding>
            <Status />
          </RequireOnboarding>
        } />
        <Route path="/look" element={
          <RequireOnboarding>
            <Look />
          </RequireOnboarding>
        } />
        <Route path="/finances" element={
          <RequireOnboarding>
            <Finances />
          </RequireOnboarding>
        } />
        <Route path="/skills" element={
          <RequireOnboarding>
            <Skills />
          </RequireOnboarding>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </OnboardingProvider>
  );
};

const App = () => <AppContainer />;

export default App;
