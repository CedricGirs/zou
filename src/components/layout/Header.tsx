
import { Bell, Moon, Sun } from "lucide-react";
import XPBar from "../dashboard/XPBar";
import LifeGauges from "../dashboard/LifeGauges";
import { useLanguage } from "../../context/LanguageContext";

interface HeaderProps {
  toggleSidebar: () => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

const Header = ({ toggleSidebar, theme, setTheme }: HeaderProps) => {
  const { t } = useLanguage();
  const level = 5; // Mock level
  const avatarUrl = "https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix&backgroundColor=b6e3f4";
  
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-border z-30 transition-all duration-300">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-3">
          <button 
            className="md:hidden p-2 rounded-md hover:bg-muted"
            onClick={toggleSidebar}
          >
            <span className="font-pixel text-sm">{t("menu")}</span>
          </button>
          
          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden pixel-border">
              <img 
                src={avatarUrl} 
                alt="User avatar" 
                className="w-full h-full object-cover pixel-art"
              />
            </div>
            <div className="flex items-center">
              <span className="font-pixel text-xs">{t("level")}</span>
              <span className="font-pixel text-lg text-zou-purple ml-1">{level}</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 max-w-md mx-4">
          <XPBar currentXP={350} maxXP={1000} />
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="hidden md:block">
            <LifeGauges compact />
          </div>
          
          <button 
            className="p-2 rounded-full hover:bg-muted relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-zou-purple rounded-full"></span>
          </button>
          
          <button 
            className="p-2 rounded-full hover:bg-muted"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
