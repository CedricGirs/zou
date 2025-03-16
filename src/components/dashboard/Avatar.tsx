
import { useState, useEffect } from "react";

interface AvatarProps {
  seed?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showLevel?: boolean;
  level?: number;
}

const Avatar = ({ 
  seed = "Felix", 
  size = "md", 
  className = "", 
  showLevel = false,
  level = 1
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
  
  // Generate avatar with improved artistic style
  const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${seed}&backgroundColor=b6e3f4&scale=90&radius=50`;
  
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
          relative overflow-hidden rounded-xl pixel-border
          ${isHovering ? 'animate-pulse' : ''}
          ${isLoaded ? '' : 'bg-muted animate-pulse'}
          transition-all duration-300
        `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Inner glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/20 z-10 pointer-events-none" />
        
        <img 
          src={avatarUrl} 
          alt="Avatar" 
          className={`
            w-full h-full object-cover pixel-art transition-all duration-300
            ${isHovering ? 'scale-110' : 'scale-100'}
          `}
          onLoad={() => setIsLoaded(true)}
        />
        
        {/* Overlay effect on hover */}
        <div className={`
          absolute inset-0 bg-gradient-to-t from-zou-purple/30 to-transparent opacity-0 group-hover:opacity-100 
          transition-opacity duration-300 pointer-events-none
        `} />
      </div>
      
      {showLevel && (
        <div className="absolute -bottom-2 -right-2 bg-zou-purple text-white font-pixel text-xs px-2 py-1 rounded-md pixel-border
                      shadow-lg transform transition-transform group-hover:scale-110">
          LVL {level}
        </div>
      )}
    </div>
  );
};

export default Avatar;
