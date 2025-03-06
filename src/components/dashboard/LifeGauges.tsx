
import { useState, useEffect } from "react";
import { Heart, Users, Battery, Droplet } from "lucide-react";

interface LifeGaugesProps {
  compact?: boolean;
}

const LifeGauges = ({ compact = false }: LifeGaugesProps) => {
  // Mock data - in a real app, this would come from an API or state
  const [gauges, setGauges] = useState({
    fun: 75,
    social: 60,
    energy: 45,
    hygiene: 90
  });
  
  // For demo purposes, randomly fluctuate values
  useEffect(() => {
    const interval = setInterval(() => {
      setGauges(prev => ({
        fun: Math.max(20, Math.min(100, prev.fun + (Math.random() * 10 - 5))),
        social: Math.max(20, Math.min(100, prev.social + (Math.random() * 10 - 5))),
        energy: Math.max(20, Math.min(100, prev.energy + (Math.random() * 10 - 5))),
        hygiene: Math.max(20, Math.min(100, prev.hygiene + (Math.random() * 10 - 5)))
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const gaugeItems = [
    { label: "Fun", value: gauges.fun, icon: Heart, color: "bg-fun" },
    { label: "Social", value: gauges.social, icon: Users, color: "bg-social" },
    { label: "Energy", value: gauges.energy, icon: Battery, color: "bg-energy" },
    { label: "Hygiene", value: gauges.hygiene, icon: Droplet, color: "bg-hygiene" }
  ];
  
  if (compact) {
    return (
      <div className="flex space-x-2">
        {gaugeItems.map((item) => (
          <div key={item.label} className="relative group">
            <div 
              className={`w-6 h-6 rounded-full flex items-center justify-center ${gauges[item.label.toLowerCase() as keyof typeof gauges] < 30 ? 'animate-pulse' : ''}`}
            >
              <item.icon 
                size={16} 
                className={`
                  ${gauges[item.label.toLowerCase() as keyof typeof gauges] > 70 ? 'text-zou-purple' : 
                  gauges[item.label.toLowerCase() as keyof typeof gauges] > 30 ? 'text-muted-foreground' : 
                  'text-destructive'}
                `} 
              />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs rounded px-2 py-1 hidden group-hover:block whitespace-nowrap z-50">
              {item.label}: {Math.round(gauges[item.label.toLowerCase() as keyof typeof gauges])}%
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {gaugeItems.map((item) => (
        <div key={item.label} className="flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <item.icon size={16} className="mr-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
            <span className="text-xs font-mono">{Math.round(gauges[item.label.toLowerCase() as keyof typeof gauges])}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-bar-fill ${item.color} ${gauges[item.label.toLowerCase() as keyof typeof gauges] < 30 ? 'animate-pulse' : ''}`}
              style={{ width: `${gauges[item.label.toLowerCase() as keyof typeof gauges]}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LifeGauges;
