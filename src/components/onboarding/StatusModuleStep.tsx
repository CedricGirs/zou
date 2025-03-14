
import { useState } from "react";
import { useOnboarding } from "../../context/OnboardingContext";
import { useLanguage } from "../../context/LanguageContext";
import { Label } from "../ui/label";
import StatusSelection from "./status/StatusSelection";
import LanguagesSection from "./languages/LanguagesSection";
import SkillsSection from "./skills/SkillsSection";

const StatusModuleStep = () => {
  const { onboarding, updateStatusModule } = useOnboarding();
  const { t } = useLanguage();
  
  const [status, setStatus] = useState(onboarding.statusModule.status);
  const [languages, setLanguages] = useState(onboarding.statusModule.languages);
  const [softSkills, setSoftSkills] = useState(onboarding.statusModule.softSkills);
  
  const [newLanguage, setNewLanguage] = useState("");
  const [newLanguageLevel, setNewLanguageLevel] = useState<"A1" | "A2" | "B1" | "B2" | "C1" | "C2">("A1");
  
  const [newSkill, setNewSkill] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  
  const handleStatusChange = (newStatus: 'student' | 'employee' | 'career-change') => {
    setStatus(newStatus);
    updateStatusModule({ status: newStatus });
  };
  
  const addLanguage = () => {
    if (!newLanguage.trim()) return;
    
    const updatedLanguages = [
      ...languages,
      { name: newLanguage.trim(), level: newLanguageLevel }
    ];
    
    setLanguages(updatedLanguages);
    updateStatusModule({ languages: updatedLanguages });
    setNewLanguage("");
  };
  
  const removeLanguage = (indexToRemove: number) => {
    const updatedLanguages = languages.filter((_, index) => index !== indexToRemove);
    setLanguages(updatedLanguages);
    updateStatusModule({ languages: updatedLanguages });
  };
  
  const addSoftSkill = () => {
    let skillToAdd = "";
    
    if (selectedSkill) {
      skillToAdd = selectedSkill;
      setSelectedSkill("");
    } else if (newSkill.trim()) {
      skillToAdd = newSkill.trim();
      setNewSkill("");
    } else {
      return;
    }
    
    if (softSkills.includes(skillToAdd)) {
      return;
    }
    
    const updatedSkills = [...softSkills, skillToAdd];
    setSoftSkills(updatedSkills);
    updateStatusModule({ softSkills: updatedSkills });
  };
  
  const removeSoftSkill = (indexToRemove: number) => {
    const updatedSkills = softSkills.filter((_, index) => index !== indexToRemove);
    setSoftSkills(updatedSkills);
    updateStatusModule({ softSkills: updatedSkills });
  };
  
  const handleSkillSelect = (value: string) => {
    setSelectedSkill(value);
    
    if (value && !softSkills.includes(value)) {
      const updatedSkills = [...softSkills, value];
      setSoftSkills(updatedSkills);
      updateStatusModule({ softSkills: updatedSkills });
      setSelectedSkill("");
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label>{t("currentStatus")}</Label>
        <StatusSelection 
          status={status} 
          handleStatusChange={handleStatusChange} 
        />
      </div>
      
      <div className="space-y-4">
        <Label>{t("languages")}</Label>
        <LanguagesSection 
          languages={languages}
          removeLanguage={removeLanguage}
          newLanguage={newLanguage}
          setNewLanguage={setNewLanguage}
          newLanguageLevel={newLanguageLevel}
          setNewLanguageLevel={setNewLanguageLevel}
          addLanguage={addLanguage}
        />
      </div>
      
      <div className="space-y-4">
        <Label>{t("softSkills")}</Label>
        <SkillsSection 
          softSkills={softSkills}
          removeSoftSkill={removeSoftSkill}
          newSkill={newSkill}
          setNewSkill={setNewSkill}
          selectedSkill={selectedSkill}
          setSelectedSkill={setSelectedSkill}
          addSoftSkill={addSoftSkill}
          handleSkillSelect={handleSkillSelect}
        />
      </div>
    </div>
  );
};

export default StatusModuleStep;
