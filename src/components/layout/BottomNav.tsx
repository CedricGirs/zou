
import { NavLink } from "react-router-dom";
import { Home, GraduationCap, ShoppingBag, DollarSign, Zap, Dumbbell } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const BottomNav = ({ isVisible = true }) => {
  const { t } = useLanguage();

  const navItems = [
    { to: "/status", icon: GraduationCap, label: t("status") },
    { to: "/look", icon: ShoppingBag, label: t("look") },
    { to: "/", icon: Home, label: t("home") },
    { to: "/finances", icon: DollarSign, label: t("finances") },
    { to: "/skills", icon: Zap, label: t("skills") },
    { to: "/sport", icon: Dumbbell, label: t("sport") }
  ];

  if (!isVisible) return null;

  return (
    <nav className="fixed bottom-0 w-full md:hidden bg-white dark:bg-zinc-900 border-t border-border shadow-lg z-50 h-16 animate-fade-in">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item) => (
          <NavLink 
            key={item.label} 
            to={item.to} 
            className={({ isActive }) => `
              flex flex-col items-center justify-center w-16 h-full 
              ${isActive ? 'text-zou-purple' : 'text-muted-foreground'} 
              transition-all duration-200 ease-in-out
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon size={24} className={`${isActive ? 'animate-pulse' : ''}`} />
                <span className="sr-only">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
