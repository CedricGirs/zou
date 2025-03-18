
import { NavLink } from "react-router-dom";
import { 
  Home, GraduationCap, ShoppingBag, DollarSign, Zap, 
  Settings, Bell, Package, ChevronLeft, ChevronRight, Dumbbell, Castle
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { t } = useLanguage();

  const mainNavItems = [
    { to: "/", icon: Home, label: t("home") },
    { to: "/status", icon: GraduationCap, label: t("status") },
    { to: "/look", icon: ShoppingBag, label: t("look") },
    { to: "/finances", icon: DollarSign, label: t("finances") },
    { to: "/skills", icon: Zap, label: t("skills") },
    { to: "/sport", icon: Dumbbell, label: t("sport") },
    { to: "/kingdom", icon: Castle, label: "Royaume" }
  ];

  const secondaryNavItems = [
    { to: "/settings", icon: Settings, label: t("settings") },
    { to: "/notifications", icon: Bell, label: t("notifications") },
    { to: "/inventory", icon: Package, label: t("inventory") }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full bg-sidebar 
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-0 md:w-20'} 
          border-r border-border shadow-xl
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-border p-4">
            <h1 className={`font-pixel text-xl text-zou-purple truncate ${!isOpen && 'md:hidden'}`}>ZOU</h1>
            {!isOpen && <h1 className="hidden md:block font-pixel text-xl text-zou-purple">Z</h1>}
          </div>

          {/* Toggle button */}
          <button 
            className="hidden md:flex absolute top-4 -right-3 bg-sidebar border border-border rounded-full p-1 shadow-md"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>

          {/* Main navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center px-3 py-3 rounded-md text-sm font-medium
                    ${isActive ? 'bg-sidebar-accent text-zou-purple' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}
                    transition-all duration-200
                  `}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  {isOpen && <span className="ml-3 truncate">{item.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Secondary navigation */}
          <div className="p-2 border-t border-border">
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2 rounded-md text-xs font-medium
                    ${isActive ? 'bg-sidebar-accent text-zou-purple' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}
                    transition-all duration-200
                  `}
                >
                  <item.icon size={16} className="flex-shrink-0" />
                  {isOpen && <span className="ml-3 truncate">{item.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
