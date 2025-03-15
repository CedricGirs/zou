
import { ReactNode } from "react";
import { Check } from "lucide-react";

export interface ClothingItemProps {
  id: string;
  name: string;
  category: "tops" | "bottoms" | "jackets" | "shoes";
  color: string;
  icon: ReactNode;
  selected: boolean;
  onToggle: (id: string) => void;
}

const ClothingItem = ({ 
  id, 
  name, 
  category,
  color, 
  icon, 
  selected, 
  onToggle 
}: ClothingItemProps) => {
  const colorClasses: Record<string, string> = {
    white: "bg-white border-gray-200",
    black: "bg-gray-900 border-gray-900",
    gray: "bg-gray-400 border-gray-400",
    navy: "bg-indigo-900 border-indigo-900",
    beige: "bg-amber-100 border-amber-100",
    brown: "bg-amber-800 border-amber-800",
    red: "bg-red-500 border-red-500",
    blue: "bg-blue-500 border-blue-500",
    green: "bg-green-500 border-green-500"
  };

  return (
    <div 
      className={`
        glass-card p-3 cursor-pointer transition-all duration-200
        ${selected ? "ring-2 ring-zou-purple" : "hover:shadow-md"}
      `}
      onClick={() => onToggle(id)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-pixel text-xs truncate pr-2">{name}</div>
        <div className={`
          w-5 h-5 rounded-full flex items-center justify-center
          ${selected ? "bg-zou-purple" : "bg-muted"}
          ${selected ? "text-white" : "text-transparent"}
        `}>
          <Check size={12} />
        </div>
      </div>
      
      <div className="flex items-center justify-center py-3">
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center text-white
          ${colorClasses[color] || "bg-gray-500 border-gray-500"}
        `}>
          {icon}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground text-center mt-1 capitalize">
        {category}
      </div>
    </div>
  );
};

export default ClothingItem;
