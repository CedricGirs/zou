
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
  return (
    <div 
      key={skill.id}
      className={`
        absolute w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
        transition-all duration-300 ${selectedSkill && selectedSkill.id === skill.id ? 'scale-110 z-10' : ''}
      `}
      style={{ left: `${skill.position.x}%`, top: `${skill.position.y}%` }}
      onClick={() => toggleSkill(skill)}
    >
      <div 
        className={`
          w-full h-full rounded-full flex items-center justify-center
          ${getBranchColor(skill.branch, skill.unlocked, skill.level)}
          ${skill.unlocked ? 'animate-pulse' : ''}
          transition-shadow relative
        `}
      >
        <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
        <div className="text-white">
          {iconMap[skill.icon] || <Circle size={14} />}
        </div>
        
        {skill.unlocked && skill.level > 0 && (
          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-medium border border-gray-200 dark:border-gray-700">
            {skill.level}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillNode;
