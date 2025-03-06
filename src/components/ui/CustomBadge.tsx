
import { ReactNode } from "react";

interface BadgeProps {
  icon: ReactNode;
  name: string;
  description: string;
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
  unlocked?: boolean;
  onClick?: () => void;
}

const Badge = ({ 
  icon, 
  name, 
  description, 
  rarity = "common", 
  unlocked = false,
  onClick
}: BadgeProps) => {
  const rarityColors = {
    common: "bg-gray-200 dark:bg-gray-700",
    uncommon: "bg-green-200 dark:bg-green-900",
    rare: "bg-blue-200 dark:bg-blue-900",
    epic: "bg-purple-200 dark:bg-purple-900",
    legendary: "bg-amber-200 dark:bg-amber-900"
  };
  
  return (
    <div 
      className={`
        glass-card overflow-hidden cursor-pointer transition-all duration-300
        hover:shadow-xl ${unlocked ? "" : "grayscale opacity-70"}
      `}
      onClick={onClick}
    >
      <div className={`
        h-2 ${rarityColors[rarity]}
        ${unlocked ? "animate-shimmer" : ""}
      `}></div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${unlocked ? "bg-zou-purple" : "bg-muted"}
            ${unlocked ? "text-white" : "text-muted-foreground"}
          `}>
            {icon}
          </div>
          <div className="ml-3">
            <h3 className="font-pixel text-xs">{name}</h3>
            <div className="flex items-center mt-1">
              <span className={`
                text-[10px] px-1 rounded
                ${rarityColors[rarity]} text-black dark:text-white
              `}>
                {rarity.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Badge;
