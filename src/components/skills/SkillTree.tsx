import { useState, useEffect } from "react";
import { Sword, Shield, Wand, Star, Target, Flame, Zap, Book, Award, Diamond, Circle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { playSound } from "@/utils/audioUtils";
import { Skill } from "@/types/StatusTypes";
import { useUserData } from "@/context/userData";

const iconMap: Record<string, JSX.Element> = {
  sword: <Sword size={14} />,
  shield: <Shield size={14} />,
  wand: <Wand size={14} />,
  star: <Star size={14} />,
  target: <Target size={14} />,
  flame: <Flame size={14} />,
  zap: <Zap size={14} />,
  book: <Book size={14} />,
  award: <Award size={14} />,
  diamond: <Diamond size={14} />,
  circle: <Circle size={14} />
};

interface SkillTreeProps {
  skills: Skill[];
  onSkillsUpdate: (skills: Skill[]) => Promise<void>;
}

const defaultSkills: Skill[] = [
  // Weapons branch - 10 skills
  {
    id: "pomodoro",
    name: "Pomodoro Master",
    description: "Complete 5 daily focused sessions for 7 days",
    branch: "weapons",
    tier: 1,
    level: 0,
    maxLevel: 3,
    unlocked: true,
    xpReward: 15,
    icon: "sword",
    position: { x: 50, y: 50 },
    connections: ["deep-work", "flow-state"]
  },
  {
    id: "deep-work",
    name: "Deep Work",
    description: "Complete 2 hours of uninterrupted work for 5 days",
    branch: "weapons",
    tier: 2,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 20,
    icon: "target",
    position: { x: 45, y: 35 },
    connections: ["flow-state", "time-blocking"]
  },
  {
    id: "flow-state",
    name: "Flow State",
    description: "Enter flow state 10 times",
    branch: "weapons",
    tier: 2,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 20,
    icon: "zap",
    position: { x: 55, y: 35 },
    connections: ["rapid-learning"]
  },
  {
    id: "time-blocking",
    name: "Time Blocking",
    description: "Plan your day with time blocks for 14 days",
    branch: "weapons",
    tier: 3,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 25,
    icon: "target",
    position: { x: 40, y: 25 },
    connections: ["habit-stacking"]
  },
  {
    id: "rapid-learning",
    name: "Rapid Learning",
    description: "Learn a new concept in under an hour 5 times",
    branch: "weapons",
    tier: 3,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 25,
    icon: "flame",
    position: { x: 60, y: 25 },
    connections: ["mental-models"]
  },
  {
    id: "habit-stacking",
    name: "Habit Stacking",
    description: "Stack 3 habits successfully for 21 days",
    branch: "weapons",
    tier: 4,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 30,
    icon: "sword",
    position: { x: 35, y: 20 },
    connections: ["deliberate-practice"]
  },
  {
    id: "mental-models",
    name: "Mental Models",
    description: "Apply 5 mental models to solve problems",
    branch: "weapons",
    tier: 4,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 30,
    icon: "diamond",
    position: { x: 65, y: 20 },
    connections: ["second-brain"]
  },
  {
    id: "deliberate-practice",
    name: "Deliberate Practice",
    description: "Practice with focused improvement for 30 days",
    branch: "weapons",
    tier: 5,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 40,
    icon: "target",
    position: { x: 32, y: 12 },
    connections: ["expert-level"]
  },
  {
    id: "second-brain",
    name: "Second Brain",
    description: "Build a personal knowledge system with 50+ notes",
    branch: "weapons",
    tier: 5,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 40,
    icon: "zap",
    position: { x: 68, y: 12 },
    connections: ["expert-level"]
  },
  {
    id: "expert-level",
    name: "Expert Level",
    description: "Reach proficiency in a skill that puts you in the top 5%",
    branch: "weapons",
    tier: 6,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 50,
    icon: "star",
    position: { x: 50, y: 8 },
    connections: []
  },
  
  // Defense branch - 10 skills
  {
    id: "meditation",
    name: "Mind Clarity",
    description: "Meditate for 10 minutes daily for 10 days",
    branch: "defense",
    tier: 1,
    level: 0,
    maxLevel: 3,
    unlocked: true,
    xpReward: 15,
    icon: "shield",
    position: { x: 20, y: 50 },
    connections: ["exercise", "sleep-hygiene"]
  },
  {
    id: "exercise",
    name: "Physical Strength",
    description: "Exercise 3 times per week for 4 weeks",
    branch: "defense",
    tier: 2,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 20,
    icon: "shield",
    position: { x: 15, y: 35 },
    connections: ["nutrition"]
  },
  {
    id: "sleep-hygiene",
    name: "Sleep Hygiene",
    description: "Maintain a consistent sleep schedule for 21 days",
    branch: "defense",
    tier: 2,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 20,
    icon: "circle",
    position: { x: 25, y: 35 },
    connections: ["stress-management"]
  },
  {
    id: "nutrition",
    name: "Balanced Nutrition",
    description: "Track and maintain balanced meals for 14 days",
    branch: "defense",
    tier: 3,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 25,
    icon: "shield",
    position: { x: 10, y: 25 },
    connections: ["immune-strength"]
  },
  {
    id: "stress-management",
    name: "Stress Management",
    description: "Apply 3 stress-reduction techniques for 30 days",
    branch: "defense",
    tier: 3,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 25,
    icon: "shield",
    position: { x: 30, y: 25 },
    connections: ["emotional-mastery"]
  },
  {
    id: "immune-strength",
    name: "Immune Strength",
    description: "Boost immune system with supplements and self-care",
    branch: "defense",
    tier: 4,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 30,
    icon: "shield",
    position: { x: 5, y: 20 },
    connections: ["resilience"]
  },
  {
    id: "emotional-mastery",
    name: "Emotional Mastery",
    description: "Practice emotional intelligence daily for 30 days",
    branch: "defense",
    tier: 4,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 30,
    icon: "shield",
    position: { x: 35, y: 20 },
    connections: ["mindfulness"]
  },
  {
    id: "resilience",
    name: "Resilience",
    description: "Bounce back from setbacks stronger 5 times",
    branch: "defense",
    tier: 5,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 40,
    icon: "shield",
    position: { x: 8, y: 12 },
    connections: ["armor-mastery"]
  },
  {
    id: "mindfulness",
    name: "Mindfulness",
    description: "Practice being present in all activities for 21 days",
    branch: "defense",
    tier: 5,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 40,
    icon: "shield",
    position: { x: 32, y: 12 },
    connections: ["armor-mastery"]
  },
  {
    id: "armor-mastery",
    name: "Armor Mastery",
    description: "Develop unshakable mental defenses against life's challenges",
    branch: "defense",
    tier: 6,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 50,
    icon: "star",
    position: { x: 20, y: 8 },
    connections: []
  },
  
  // Magic branch - 10 skills
  {
    id: "reading",
    name: "Book Worm",
    description: "Read 20 pages daily for 14 days",
    branch: "magic",
    tier: 1,
    level: 0,
    maxLevel: 3,
    unlocked: true,
    xpReward: 15,
    icon: "wand",
    position: { x: 80, y: 50 },
    connections: ["language-learning", "active-learning"]
  },
  {
    id: "language-learning",
    name: "Language Learner",
    description: "Practice a language for 15 minutes daily for 30 days",
    branch: "magic",
    tier: 2,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 20,
    icon: "book",
    position: { x: 75, y: 35 },
    connections: ["teaching-others"]
  },
  {
    id: "active-learning",
    name: "Active Learning",
    description: "Take structured notes on 10 topics",
    branch: "magic",
    tier: 2,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 20,
    icon: "book",
    position: { x: 85, y: 35 },
    connections: ["course-completion"]
  },
  {
    id: "teaching-others",
    name: "Teaching Others",
    description: "Teach a concept to someone else 5 times",
    branch: "magic",
    tier: 3,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 25,
    icon: "wand",
    position: { x: 70, y: 25 },
    connections: ["knowledge-synthesis"]
  },
  {
    id: "course-completion",
    name: "Course Completion",
    description: "Complete 3 online courses",
    branch: "magic",
    tier: 3,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 25,
    icon: "book",
    position: { x: 90, y: 25 },
    connections: ["creative-thinking"]
  },
  {
    id: "knowledge-synthesis",
    name: "Knowledge Synthesis",
    description: "Combine ideas from different domains 10 times",
    branch: "magic",
    tier: 4,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 30,
    icon: "wand",
    position: { x: 65, y: 20 },
    connections: ["critical-thinking"]
  },
  {
    id: "creative-thinking",
    name: "Creative Thinking",
    description: "Generate 50 unique ideas for problems",
    branch: "magic",
    tier: 4,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 30,
    icon: "wand",
    position: { x: 95, y: 20 },
    connections: ["problem-solving"]
  },
  {
    id: "critical-thinking",
    name: "Critical Thinking",
    description: "Analyze and evaluate 10 complex situations",
    branch: "magic",
    tier: 5,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 40,
    icon: "wand",
    position: { x: 68, y: 12 },
    connections: ["enlightenment"]
  },
  {
    id: "problem-solving",
    name: "Problem Solving",
    description: "Solve 20 challenging problems using structured methods",
    branch: "magic",
    tier: 5,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 40,
    icon: "wand",
    position: { x: 92, y: 12 },
    connections: ["enlightenment"]
  },
  {
    id: "enlightenment",
    name: "Enlightenment",
    description: "Achieve wisdom by synthesizing all knowledge domains",
    branch: "magic",
    tier: 6,
    level: 0,
    maxLevel: 3,
    unlocked: false,
    xpReward: 50,
    icon: "star",
    position: { x: 80, y: 8 },
    connections: []
  }
];

const SkillTree = ({ skills = [], onSkillsUpdate }: SkillTreeProps) => {
  const { t } = useLanguage();
  const { userData, updateStatusModule } = useUserData();
  const [localSkills, setLocalSkills] = useState<Skill[]>(skills.length > 0 ? skills : defaultSkills);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeBranch, setActiveBranch] = useState<"all" | "weapons" | "defense" | "magic">("all");
  
  useEffect(() => {
    if (skills.length > 0) {
      setLocalSkills(skills);
    }
  }, [skills]);
  
  const getBranchColor = (branch: string, unlocked: boolean, level: number) => {
    if (!unlocked) return "bg-gray-400 dark:bg-gray-600 opacity-60";
    
    const intensity = Math.min(100, 50 + level * 15);
    
    switch (branch) {
      case "weapons":
        return `bg-red-${intensity} shadow-lg shadow-red-${intensity}/50`;
      case "defense":
        return `bg-blue-${intensity} shadow-lg shadow-blue-${intensity}/50`;
      case "magic":
        return `bg-purple-${intensity} shadow-lg shadow-purple-${intensity}/50`;
      default:
        return "bg-gray-400";
    }
  };
  
  const getTextColor = (branch: string) => {
    switch (branch) {
      case "weapons": return "text-red-500";
      case "defense": return "text-blue-500";
      case "magic": return "text-purple-500";
      default: return "text-gray-500";
    }
  };
  
  const getConnectionColor = (branch: string, sourceUnlocked: boolean, targetUnlocked: boolean) => {
    if (!sourceUnlocked) return "#444444";
    
    switch (branch) {
      case "weapons":
        return targetUnlocked ? "#ff6b6b" : "#ff6b6b80";
      case "defense":
        return targetUnlocked ? "#4dabf7" : "#4dabf780";
      case "magic":
        return targetUnlocked ? "#cc5de8" : "#cc5de880";
      default:
        return "#9b87f5";
    }
  };
  
  const toggleSkill = (skill: Skill) => {
    if (selectedSkill && selectedSkill.id === skill.id) {
      setSelectedSkill(null);
    } else {
      setSelectedSkill(skill);
    }
  };
  
  const canLevelUp = (skill: Skill) => {
    if (!skill.unlocked) return false;
    return skill.level < skill.maxLevel;
  };
  
  const canUnlock = (skillId: string) => {
    const skillToUnlock = localSkills.find(s => s.id === skillId);
    if (!skillToUnlock || skillToUnlock.unlocked) return false;
    
    if (skillToUnlock.requirements) {
      return skillToUnlock.requirements.every(req => {
        const prereqSkill = localSkills.find(s => s.id === req.skillId);
        return prereqSkill && prereqSkill.unlocked && 
               (!req.level || prereqSkill.level >= req.level);
      });
    }
    
    const connectedSkills = localSkills.filter(s => 
      s.connections.includes(skillId)
    );
    
    return connectedSkills.some(s => s.unlocked);
  };
  
  const unlockSkill = async (skillId: string) => {
    const skillToUnlock = localSkills.find(s => s.id === skillId);
    if (!skillToUnlock) return;
    
    if (!canUnlock(skillId)) {
      toast({
        title: t("cannotUnlock"),
        description: t("unlockPrerequisites"),
        variant: "destructive",
      });
      return;
    }
    
    const updatedSkills = localSkills.map(skill => 
      skill.id === skillId ? { ...skill, unlocked: true, level: 1 } : skill
    );
    
    setLocalSkills(updatedSkills);
    setSelectedSkill(updatedSkills.find(s => s.id === skillId) || null);
    
    try {
      await onSkillsUpdate(updatedSkills);
      
      const xpReward = skillToUnlock.xpReward;
      const newXP = userData.statusModule.statusXP + xpReward;
      let newLevel = userData.statusModule.statusLevel;
      let newMaxXP = userData.statusModule.maxXP;
      
      if (newXP >= newMaxXP) {
        newLevel += 1;
        newMaxXP = Math.floor(newMaxXP * 1.5);
      }
      
      await updateStatusModule({
        statusXP: newXP,
        statusLevel: newLevel,
        maxXP: newMaxXP
      });
      
      playSound('badge');
      toast({
        title: t("skillUnlocked"),
        description: `${skillToUnlock.name} (+${xpReward} XP)`,
      });
    } catch (error) {
      console.error("Error unlocking skill:", error);
      toast({
        title: t("error"),
        description: t("errorUnlockingSkill"),
        variant: "destructive",
      });
    }
  };
  
  const levelUpSkill = async (skillId: string) => {
    const skillToLevel = localSkills.find(s => s.id === skillId);
    if (!skillToLevel || !canLevelUp(skillToLevel)) return;
    
    const newLevel = skillToLevel.level + 1;
    const updatedSkills = localSkills.map(skill => 
      skill.id === skillId ? { ...skill, level: newLevel } : skill
    );
    
    setLocalSkills(updatedSkills);
    setSelectedSkill(updatedSkills.find(s => s.id === skillId) || null);
    
    try {
      await onSkillsUpdate(updatedSkills);
      
      const xpReward = Math.floor(skillToLevel.xpReward * 0.5);
      const newXP = userData.statusModule.statusXP + xpReward;
      let newLevel = userData.statusModule.statusLevel;
      let newMaxXP = userData.statusModule.maxXP;
      
      if (newXP >= newMaxXP) {
        newLevel += 1;
        newMaxXP = Math.floor(newMaxXP * 1.5);
      }
      
      await updateStatusModule({
        statusXP: newXP,
        statusLevel: newLevel,
        maxXP: newMaxXP
      });
      
      playSound('levelUp');
      toast({
        title: t("skillLevelUp"),
        description: `${skillToLevel.name} (${t("level")} ${newLevel}) (+${xpReward} XP)`,
      });
    } catch (error) {
      console.error("Error leveling up skill:", error);
      toast({
        title: t("error"),
        description: t("errorLevelingSkill"),
        variant: "destructive",
      });
    }
  };
  
  const filteredSkills = activeBranch === "all" 
    ? localSkills 
    : localSkills.filter(skill => skill.branch === activeBranch);
  
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex justify-around mb-4">
        <button
          className={`flex items-center ${activeBranch === "all" ? "bg-muted px-3 py-1 rounded-md" : ""}`}
          onClick={() => setActiveBranch("all")}
        >
          <span className="text-sm font-medium">{t("allSkills")}</span>
        </button>
        <button
          className={`flex items-center ${activeBranch === "weapons" ? "bg-red-100 dark:bg-red-900/20 px-3 py-1 rounded-md" : ""}`}
          onClick={() => setActiveBranch("weapons")}
        >
          <Sword size={16} className="text-red-500 mr-1" />
          <span className="text-sm font-medium">{t("weapons")}</span>
        </button>
        <button
          className={`flex items-center ${activeBranch === "defense" ? "bg-blue-100 dark:bg-blue-900/20 px-3 py-1 rounded-md" : ""}`}
          onClick={() => setActiveBranch("defense")}
        >
          <Shield size={16} className="text-blue-500 mr-1" />
          <span className="text-sm font-medium">{t("defense")}</span>
        </button>
        <button
          className={`flex items-center ${activeBranch === "magic" ? "bg-purple-100 dark:bg-purple-900/20 px-3 py-1 rounded-md" : ""}`}
          onClick={() => setActiveBranch("magic")}
        >
          <Wand size={16} className="text-purple-500 mr-1" />
          <span className="text-sm font-medium">{t("magic")}</span>
        </button>
      </div>
      
      <div className="relative h-[600px] w-full bg-gray-900 dark:bg-black rounded-lg p-4 overflow-auto"
           style={{
             backgroundImage: `url(${'/lovable-uploads/af0182df-122e-49cb-9e24-a327d4b9cce9.png'})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full border border-gray-700 opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full border border-gray-700 opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full border border-gray-700 opacity-40"></div>
        
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
        
        {filteredSkills.map(skill => (
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
        ))}
        
        {selectedSkill && (
          <div 
            className="absolute glass-card p-4 w-72 z-20 animate-fade-in backdrop-blur-lg"
            style={{ 
              left: `${Math.min(80, Math.max(20, selectedSkill.position.x))}%`, 
              top: `${Math.min(80, Math.max(20, selectedSkill.position.y + 10))}%`,
              borderColor: selectedSkill.branch === "weapons" ? "rgba(255,100,100,0.3)" : 
                         selectedSkill.branch === "defense" ? "rgba(100,150,255,0.3)" : 
                         "rgba(200,100,255,0.3)"
            }}
          >
            <div className="flex items-center mb-2">
              <div className={`mr-2 ${getTextColor(selectedSkill.branch)}`}>
                {iconMap[selectedSkill.icon] || <Circle size={16} />}
              </div>
              <h3 className="font-pixel text-sm">{selectedSkill.name}</h3>
              {selectedSkill.unlocked && (
                <div className="ml-auto">
                  <div className={`text-xs font-semibold px-2 py-0.5 rounded 
                    ${selectedSkill.branch === "weapons" ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" : 
                      selectedSkill.branch === "defense" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" : 
                      "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"}`
                    }
                  >
                    {t("level")} {selectedSkill.level}/{selectedSkill.maxLevel}
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs mb-3">{selectedSkill.description}</p>
            
            <div className="flex justify-between gap-2">
              {!selectedSkill.unlocked && (
                <button 
                  className={`w-full pixel-button text-[10px] ${!canUnlock(selectedSkill.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => canUnlock(selectedSkill.id) && unlockSkill(selectedSkill.id)}
                  disabled={!canUnlock(selectedSkill.id)}
                >
                  {t("unlock")} (+{selectedSkill.xpReward} XP)
                </button>
              )}
              
              {selectedSkill.unlocked && canLevelUp(selectedSkill) && (
                <button 
                  className="w-full pixel-button text-[10px]"
                  onClick={() => levelUpSkill(selectedSkill.id)}
                >
                  {t("levelUp")} (+{Math.floor(selectedSkill.xpReward * 0.5)} XP)
                </button>
              )}
              
              {selectedSkill.unlocked && !canLevelUp(selectedSkill) && (
                <div className="w-full text-center text-xs text-green-500 font-medium py-1">
                  {t("maxLevelReached")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillTree;
