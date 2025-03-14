
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
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
      {filteredSkills.map(skill => 
        skill.connections.map(targetId => {
          const target = localSkills.find(s => s.id === targetId);
          if (!target || (activeBranch !== "all" && target.branch !== activeBranch)) return null;
          
          return (
            <line 
              key={`${skill.id}-${targetId}`}
              x1={`${skill.position.x}%`}
              y1={`${skill.position.y}%`}
              x2={`${target.position.x}%`}
              y2={`${target.position.y}%`}
              stroke={getConnectionColor(skill.branch, skill.unlocked, target.unlocked)}
              strokeWidth="2"
              strokeDasharray={!target.unlocked ? "5,5" : ""}
            />
          );
        })
      )}
    </svg>
  );
};

export default SkillConnections;
