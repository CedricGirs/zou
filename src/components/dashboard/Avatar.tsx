
import { useState, useEffect } from "react";

export interface AvatarProps {
  seed?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showLevel?: boolean;
  level?: number;
  name?: string; // Added name prop
  color?: string; // Added color prop
  bgColor?: string; // Added bgColor prop
}

const Avatar = ({ 
  seed = "Felix", 
  size = "md", 
  className = "", 
  showLevel = false,
  level = 1,
  name, // New prop
  color, // New prop
  bgColor // New prop
}: AvatarProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Map size to dimensions
  const sizeMap = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-40 h-40"
  };
  
  // Generate random avatar if seed not provided
  const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed || name || "Felix"}&backgroundColor=b6e3f4`;
  
  // Animation when level up (just for demo purposes)
  useEffect(() => {
    if (level > 1) {
      setIsHovering(true);
      const timer = setTimeout(() => setIsHovering(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [level]);
  
  return (
    <div className={`relative group ${className}`}>
      <div 
        className={`
          ${sizeMap[size]} 
          relative overflow-hidden rounded-lg pixel-border
          ${isHovering ? 'animate-pulse' : ''}
          ${isLoaded ? '' : 'bg-muted animate-pulse'}
        `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img 
          src={avatarUrl} 
          alt="Avatar" 
          className={`
            w-full h-full object-cover pixel-art transition-all duration-300
            ${isHovering ? 'scale-110' : 'scale-100'}
          `}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Add artistic overlay for modern gaming feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-70 pointer-events-none"></div>
      </div>
      
      {showLevel && (
        <div className="absolute -bottom-2 -right-2 bg-zou-purple text-white font-pixel text-xs px-2 py-1 rounded-md pixel-border animate-pulse">
          LVL {level}
        </div>
      )}
    </div>
  );
};

export default Avatar;
