
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./context/LanguageContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import { UserDataProvider } from "./context/UserDataContext";
import { useSyncUserData } from "./hooks/useSyncUserData";

import Index from "./pages/Index";
import Status from "./pages/Status";
import Look from "./pages/Look";
import Skills from "./pages/Skills";
import Finances from "./pages/Finances";
import DailyQuests from "./pages/DailyQuests";
import Badges from "./pages/Badges";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import "./App.css";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

// Component to handle data synchronization
const DataSyncLayer = ({ children }: { children: React.ReactNode }) => {
  useSyncUserData();
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <LanguageProvider>
          <UserDataProvider>
            <OnboardingProvider>
              <DataSyncLayer>
                <Router>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/status" element={<Status />} />
                    <Route path="/look" element={<Look />} />
                    <Route path="/skills" element={<Skills />} />
                    <Route path="/finances" element={<Finances />} />
                    <Route path="/daily-quests" element={<DailyQuests />} />
                    <Route path="/badges" element={<Badges />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Toaster />
                </Router>
              </DataSyncLayer>
            </OnboardingProvider>
          </UserDataProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
