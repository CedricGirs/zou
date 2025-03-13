
import { Sword, Shield, Wand } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { Skill } from "@/types/StatusTypes";
import { useUserData } from "@/context/userData";
import { iconMap } from "./tree/iconMap";
import { defaultSkills } from "./tree/defaultSkills";
import { useSkillTree } from "./tree/useSkillTree";
import BranchSelector from "./tree/BranchSelector";
import SkillBackground from "./tree/SkillBackground";
import SkillConnections from "./tree/SkillConnections";
import SkillNode from "./tree/SkillNode";
import SkillDetails from "./tree/SkillDetails";

interface SkillTreeProps {
  skills: Skill[];
  onSkillsUpdate: (skills: Skill[]) => Promise<void>;
}

const SkillTree = ({ skills = [], onSkillsUpdate }: SkillTreeProps) => {
  const { 
    localSkills,
    filteredSkills,
    selectedSkill,
    activeBranch,
    setActiveBranch,
    getBranchColor,
    getTextColor,
    getConnectionColor,
    toggleSkill,
    canLevelUp,
    canUnlock,
    unlockSkill,
    levelUpSkill
  } = useSkillTree(
    skills.length > 0 ? skills : defaultSkills, 
    onSkillsUpdate
  );
  
  return (
    <div className="relative w-full overflow-hidden">
      <BranchSelector 
        activeBranch={activeBranch} 
        setActiveBranch={setActiveBranch} 
      />
      
      <div className="relative h-[600px] w-full bg-gray-900 dark:bg-black rounded-lg p-4 overflow-auto"
           style={{
             backgroundImage: `url(${'/lovable-uploads/af0182df-122e-49cb-9e24-a327d4b9cce9.png'})`,
             backgroundSize: 'cover',
             backgroundPosition: 'center'
           }}>
        <SkillBackground />
        
        <SkillConnections 
          filteredSkills={filteredSkills}
          localSkills={localSkills}
          activeBranch={activeBranch}
          getConnectionColor={getConnectionColor}
        />
        
        {filteredSkills.map(skill => (
          <SkillNode 
            key={skill.id}
            skill={skill}
            selectedSkill={selectedSkill}
            toggleSkill={toggleSkill}
            iconMap={iconMap}
            getBranchColor={getBranchColor}
            getTextColor={getTextColor}
          />
        ))}
        
        <SkillDetails 
          selectedSkill={selectedSkill}
          getTextColor={getTextColor}
          iconMap={iconMap}
          canUnlock={canUnlock}
          unlockSkill={unlockSkill}
          canLevelUp={canLevelUp}
          levelUpSkill={levelUpSkill}
        />
      </div>
    </div>
  );
};

export default SkillTree;
