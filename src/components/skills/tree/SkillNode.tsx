
import { Circle } from "lucide-react";
import { Skill } from "@/types/StatusTypes";

interface SkillNodeProps {
  skill: Skill;
  selectedSkill: Skill | null;
  toggleSkill: (skill: Skill) => void;
  iconMap: Record<string, JSX.Element>;
  getBranchColor: (branch: string, unlocked: boolean, level: number) => string;
  getTextColor: (branch: string) => string;
}

const SkillNode = ({ 
  skill, 
  selectedSkill, 
  toggleSkill, 
  iconMap, 
  getBranchColor,
  getTextColor 
}: SkillNodeProps) => {
  // Calculate progress indicator rings based on level and maxLevel
  const progressRings = [];
  if (skill.unlocked) {
    const progress = skill.level / skill.maxLevel;
    
    // Only show progress rings for unlocked skills
    for (let i = 0; i < 3; i++) {
      // Determine if this ring should be filled based on progress
      const isFilled = i < Math.ceil(progress * 3);
      progressRings.push(
        <div 
          key={`ring-${i}`}
          className={`absolute rounded-full border ${isFilled ? getBranchColor(skill.branch, true, skill.level) : 'border-white/30 bg-transparent'}`}
          style={{
            width: `${26 + i * 12}px`, 
            height: `${26 + i * 12}px`,
            top: `${50 - (26 + i * 12) / 2}%`,
            left: `${50 - (26 + i * 12) / 2}%`,
            zIndex: 3 - i,
            opacity: isFilled ? 0.8 : 0.2
          }}
        ></div>
      );
    }
  }
  
  return (
    <div 
      key={skill.id}
      className={`
        absolute w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
        transition-all duration-300 ${selectedSkill && selectedSkill.id === skill.id ? 'scale-125 z-10' : ''}
      `}
      style={{ left: `${skill.position.x}%`, top: `${skill.position.y}%` }}
      onClick={() => toggleSkill(skill)}
    >
      {/* Progress rings */}
      {progressRings}
      
      {/* Main skill node */}
      <div 
        className={`
          w-full h-full rounded-full flex items-center justify-center z-10 relative
          ${getBranchColor(skill.branch, skill.unlocked, skill.level)}
          ${skill.unlocked ? 'animate-pulse' : ''}
          transition-shadow
        `}
      >
        <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
        <div className="text-white z-20">
          {iconMap[skill.icon] || <Circle size={14} />}
        </div>
        
        {skill.unlocked && skill.level > 0 && (
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-medium border border-gray-200 dark:border-gray-700 z-20">
            {skill.level}
          </div>
        )}
      </div>
      
      {/* Skill name tooltip on hover */}
      <div className="absolute w-20 text-center -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-xs font-medium whitespace-nowrap bg-black/70 text-white px-1.5 py-0.5 rounded">
          {skill.name}
        </span>
      </div>
    </div>
  );
};

export default SkillNode;
