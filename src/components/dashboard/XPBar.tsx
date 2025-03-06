
import { useState, useEffect } from "react";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  animated?: boolean;
}

const XPBar = ({ currentXP, maxXP, animated = true }: XPBarProps) => {
  const [animatedXP, setAnimatedXP] = useState(0);
  const percentage = (currentXP / maxXP) * 100;
  
  useEffect(() => {
    if (animated) {
      setAnimatedXP(0);
      const timer = setTimeout(() => {
        setAnimatedXP(currentXP);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedXP(currentXP);
    }
  }, [currentXP, animated]);
  
  const animatedPercentage = (animatedXP / maxXP) * 100;
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-xs">
        <span className="font-pixel">XP</span>
        <span className="font-mono">{currentXP} / {maxXP}</span>
      </div>
      <div className="progress-bar h-3">
        <div 
          className="progress-bar-fill bg-zou-purple transition-all duration-1000 ease-out"
          style={{ width: `${animatedPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default XPBar;
