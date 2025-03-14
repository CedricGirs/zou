
import { Skill } from "@/types/StatusTypes";

interface SkillConnectionsProps {
  filteredSkills: Skill[];
  localSkills: Skill[];
  activeBranch: "all" | "weapons" | "defense" | "magic";
  getConnectionColor: (branch: string, sourceUnlocked: boolean, targetUnlocked: boolean) => string;
}

const SkillConnections = ({ 
  filteredSkills, 
  localSkills, 
  activeBranch, 
  getConnectionColor 
}: SkillConnectionsProps) => {
  return (
    <svg className="absolute inset-0 w-full h-full z-0">
      {filteredSkills.map(skill => 
        skill.connections.map(connId => {
          const connectedSkill = localSkills.find(s => s.id === connId);
          
          // Skip if connected skill doesn't exist or isn't in view (filtered)
          if (!connectedSkill || 
              (activeBranch !== "all" && connectedSkill.branch !== activeBranch)) {
            return null;
          }
          
          return (
            <line
              key={`${skill.id}-${connId}`}
              x1={`${skill.position.x}%`}
              y1={`${skill.position.y}%`}
              x2={`${connectedSkill.position.x}%`}
              y2={`${connectedSkill.position.y}%`}
              stroke={getConnectionColor(
                skill.branch, 
                skill.unlocked, 
                connectedSkill.unlocked
              )}
              strokeWidth="3"
              strokeDasharray={connectedSkill.unlocked ? "none" : "5,5"}
              strokeLinecap="round"
            />
          );
        })
      )}
    </svg>
  );
};

export default SkillConnections;
