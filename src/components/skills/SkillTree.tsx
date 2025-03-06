import { useState, useEffect } from "react";
import { Sword, Shield, Wand } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { playSound } from "@/utils/audioUtils";

interface Skill {
  id: string;
  name: string;
  description: string;
  branch: "weapons" | "defense" | "magic";
  level: number;
  unlocked: boolean;
  position: { x: number; y: number };
  connections: string[];
}

interface SkillTreeProps {
  skills: Skill[];
  onSkillsUpdate: (skills: Skill[]) => Promise<void>;
}

const defaultSkills: Skill[] = [
  {
    id: "pomodoro",
    name: "Pomodoro Master",
    description: "Complete 5 daily focused sessions for 7 days",
    branch: "weapons",
    level: 1,
    unlocked: true,
    position: { x: 20, y: 20 },
    connections: ["deep-work"]
  },
  {
    id: "deep-work",
    name: "Deep Work",
    description: "Complete 2 hours of uninterrupted work for 5 days",
    branch: "weapons",
    level: 2,
    unlocked: false,
    position: { x: 40, y: 40 },
    connections: ["flow-state"]
  },
  {
    id: "flow-state",
    name: "Flow State",
    description: "Enter flow state 10 times",
    branch: "weapons",
    level: 3,
    unlocked: false,
    position: { x: 60, y: 20 },
    connections: []
  },
  {
    id: "meditation",
    name: "Mind Clarity",
    description: "Meditate for 10 minutes daily for 10 days",
    branch: "defense",
    level: 1,
    unlocked: true,
    position: { x: 20, y: 60 },
    connections: ["exercise"]
  },
  {
    id: "exercise",
    name: "Physical Strength",
    description: "Exercise 3 times per week for 4 weeks",
    branch: "defense",
    level: 2,
    unlocked: false,
    position: { x: 40, y: 80 },
    connections: ["healthy-diet"]
  },
  {
    id: "healthy-diet",
    name: "Healthy Diet",
    description: "Track nutrition for 21 days straight",
    branch: "defense",
    level: 3,
    unlocked: false,
    position: { x: 60, y: 60 },
    connections: []
  },
  {
    id: "reading",
    name: "Book Worm",
    description: "Read 20 pages daily for 14 days",
    branch: "magic",
    level: 1,
    unlocked: true,
    position: { x: 20, y: 100 },
    connections: ["language"]
  },
  {
    id: "language",
    name: "Language Learner",
    description: "Practice a language for 15 minutes daily for 30 days",
    branch: "magic",
    level: 2,
    unlocked: false,
    position: { x: 40, y: 120 },
    connections: ["knowledge-master"]
  },
  {
    id: "knowledge-master",
    name: "Knowledge Master",
    description: "Complete 3 online courses",
    branch: "magic",
    level: 3,
    unlocked: false,
    position: { x: 60, y: 100 },
    connections: []
  }
];

const SkillTree = ({ skills = [], onSkillsUpdate }: SkillTreeProps) => {
  const { t } = useLanguage();
  
  const [localSkills, setLocalSkills] = useState<Skill[]>(skills.length > 0 ? skills : defaultSkills);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  
  useEffect(() => {
    if (skills.length > 0) {
      setLocalSkills(skills);
    }
  }, [skills]);
  
  const getBranchIcon = (branch: string) => {
    switch (branch) {
      case "weapons": return <Sword className="mr-2" size={16} />;
      case "defense": return <Shield className="mr-2" size={16} />;
      case "magic": return <Wand className="mr-2" size={16} />;
      default: return null;
    }
  };
  
  const getBranchColor = (branch: string, unlocked: boolean) => {
    if (!unlocked) return "bg-gray-400 dark:bg-gray-600";
    
    switch (branch) {
      case "weapons": return "bg-weapons";
      case "defense": return "bg-defense";
      case "magic": return "bg-magic";
      default: return "bg-gray-400";
    }
  };
  
  const toggleSkill = (skill: Skill) => {
    if (selectedSkill && selectedSkill.id === skill.id) {
      setSelectedSkill(null);
    } else {
      setSelectedSkill(skill);
    }
  };
  
  const unlockSkill = async (skillId: string) => {
    const skillToUnlock = localSkills.find(s => s.id === skillId);
    if (!skillToUnlock) return;
    
    const prerequisites = localSkills.filter(s => 
      s.connections.includes(skillId)
    );
    
    const canUnlock = prerequisites.every(p => p.unlocked);
    
    if (!canUnlock) {
      toast({
        title: t("cannotUnlock"),
        description: t("unlockPrerequisites"),
        variant: "destructive",
      });
      return;
    }
    
    const updatedSkills = localSkills.map(skill => 
      skill.id === skillId ? { ...skill, unlocked: true } : skill
    );
    
    setLocalSkills(updatedSkills);
    setSelectedSkill(null);
    
    try {
      await onSkillsUpdate(updatedSkills);
      playSound('badge');
      toast({
        title: t("skillUnlocked"),
        description: skillToUnlock.name,
      });
    } catch (error) {
      console.error("Erreur lors du déblocage de la compétence:", error);
      toast({
        title: t("error"),
        description: t("errorUnlockingSkill"),
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex justify-around mb-4">
        <div className="flex items-center">
          <Sword size={16} className="text-weapons mr-1" />
          <span className="text-sm font-medium">{t("weapons")}</span>
        </div>
        <div className="flex items-center">
          <Shield size={16} className="text-defense mr-1" />
          <span className="text-sm font-medium">{t("defense")}</span>
        </div>
        <div className="flex items-center">
          <Wand size={16} className="text-magic mr-1" />
          <span className="text-sm font-medium">{t("magic")}</span>
        </div>
      </div>
      
      <div className="relative h-[500px] w-full bg-muted/50 rounded-lg p-4 overflow-auto">
        <svg className="absolute top-0 left-0 w-full h-full">
          {localSkills.map(skill => 
            skill.connections.map(targetId => {
              const target = localSkills.find(s => s.id === targetId);
              if (!target) return null;
              
              return (
                <line 
                  key={`${skill.id}-${targetId}`}
                  x1={`${skill.position.x}%`}
                  y1={`${skill.position.y}%`}
                  x2={`${target.position.x}%`}
                  y2={`${target.position.y}%`}
                  stroke={skill.unlocked ? (target.unlocked ? "#9b87f5" : "#9b87f580") : "#9b87f520"}
                  strokeWidth="2"
                  strokeDasharray={!target.unlocked ? "5,5" : ""}
                />
              );
            })
          )}
        </svg>
        
        {localSkills.map(skill => (
          <div 
            key={skill.id}
            className={`
              absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer
              transition-all duration-300 ${selectedSkill && selectedSkill.id === skill.id ? 'scale-110' : ''}
            `}
            style={{ left: `${skill.position.x}%`, top: `${skill.position.y}%` }}
            onClick={() => toggleSkill(skill)}
          >
            <div 
              className={`
                w-full h-full rounded-full flex items-center justify-center
                ${getBranchColor(skill.branch, skill.unlocked)}
                ${skill.unlocked ? 'animate-pulse' : 'opacity-60'}
                shadow-lg hover:shadow-xl transition-shadow
              `}
            >
              <span className="font-pixel text-white text-xs">{skill.level}</span>
            </div>
          </div>
        ))}
        
        {selectedSkill && (
          <div 
            className="absolute glass-card p-4 w-64 z-10 animate-fade-in"
            style={{ 
              left: `${Math.min(80, Math.max(20, selectedSkill.position.x))}%`, 
              top: `${Math.min(80, Math.max(20, selectedSkill.position.y + 10))}%`,
            }}
          >
            <div className="flex items-center mb-2">
              {getBranchIcon(selectedSkill.branch)}
              <h3 className="font-pixel text-sm">{selectedSkill.name}</h3>
            </div>
            <p className="text-xs mb-3">{selectedSkill.description}</p>
            
            {!selectedSkill.unlocked && (
              <button 
                className="w-full pixel-button text-[10px]"
                onClick={() => unlockSkill(selectedSkill.id)}
              >
                {t("unlock")}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillTree;
