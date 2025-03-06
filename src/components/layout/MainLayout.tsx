
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const location = useLocation();

  // Auto switch theme based on time of day
  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 18) {
        setTheme("light");
      } else {
        setTheme("dark");
      }
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Toggle navigation visibility when sidebar is opened/closed on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsNavVisible(!isSidebarOpen);
    } else {
      setIsNavVisible(true);
    }
  }, [isSidebarOpen]);

  return (
    <div className={`app-container ${theme}`}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className={`main-content ${isSidebarOpen ? "md:ml-64" : "md:ml-20"}`}>
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} theme={theme} setTheme={setTheme} />
        <div className="page-enter">
          {children}
        </div>
      </main>
      
      <BottomNav isVisible={isNavVisible} />
    </div>
  );
};

export default MainLayout;
