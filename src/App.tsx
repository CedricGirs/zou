
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { UserDataProvider } from "./context/UserDataContext";
import Index from "./pages/Index";
import Status from "./pages/Status";
import Look from "./pages/Look";
import Finances from "./pages/Finances";
import Skills from "./pages/Skills";
import DailyQuests from "./pages/DailyQuests";
import Badges from "./pages/Badges";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// This is the main app container that wraps the Router
const AppContainer = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <UserDataProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </UserDataProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// This component contains all the routes and needs access to Router context
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/status" element={<Status />} />
      <Route path="/look" element={<Look />} />
      <Route path="/finances" element={<Finances />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/daily-quests" element={<DailyQuests />} />
      <Route path="/badges" element={<Badges />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => <AppContainer />;

export default App;
