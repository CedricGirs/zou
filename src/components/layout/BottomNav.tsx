
import { NavLink } from "react-router-dom";
import { Home, GraduationCap, ShoppingBag, DollarSign, Zap } from "lucide-react";

const BottomNav = () => {
  const navItems = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/status", icon: GraduationCap, label: "Status" },
    { to: "/look", icon: ShoppingBag, label: "Look" },
    { to: "/finances", icon: DollarSign, label: "Finances" },
    { to: "/skills", icon: Zap, label: "Skills" }
  ];

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
                <item.icon size={20} className={`mb-1 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="text-[10px] font-pixel truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
