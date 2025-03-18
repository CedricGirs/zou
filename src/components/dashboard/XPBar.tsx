
import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Progress } from "@/components/ui/progress";

interface XPBarProps {
  currentXP: number;
  maxXP: number;
  animated?: boolean;
  variant?: "default" | "success" | "warning" | "danger" | "purple" | "gradient" | "minimal";
}

const XPBar = ({ currentXP, maxXP, animated = true, variant = "purple" }: XPBarProps) => {
  const { t } = useLanguage();
  const [animatedXP, setAnimatedXP] = useState(0);
  const percentage = Math.min(100, (currentXP / maxXP) * 100);
  
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
  
  const animatedPercentage = Math.min(100, (animatedXP / maxXP) * 100);
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-xs">
        <span className="font-pixel">{t("xp")}</span>
        <span className="font-mono">{currentXP} / {maxXP}</span>
      </div>
      <Progress 
        value={animatedPercentage} 
        className="h-3" 
        variant={variant}
      />
    </div>
  );
};

export default XPBar;
