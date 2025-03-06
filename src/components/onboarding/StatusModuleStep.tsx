import { useState } from "react";
import { useOnboarding } from "../../context/OnboardingContext";
import { useLanguage } from "../../context/LanguageContext";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const COMMON_SOFT_SKILLS = [
  "Communication",
  "Teamwork",
  "Problem-solving",
  "Time management",
  "Leadership",
  "Adaptability",
  "Creativity",
  "Critical thinking",
  "Emotional intelligence",
  "Work ethic",
  "Attention to detail",
  "Conflict resolution",
  "Organization",
  "Decision-making",
  "Negotiation",
];

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
        <div className="grid grid-cols-3 gap-3">
          <button
            className={`pixel-card p-3 text-center ${status === 'student' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => handleStatusChange('student')}
          >
            <span className="block mb-1">{t("student")}</span>
            <span className="text-xs text-muted-foreground">{t("studentDesc")}</span>
          </button>
          <button
            className={`pixel-card p-3 text-center ${status === 'employee' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => handleStatusChange('employee')}
          >
            <span className="block mb-1">{t("employee")}</span>
            <span className="text-xs text-muted-foreground">{t("employeeDesc")}</span>
          </button>
          <button
            className={`pixel-card p-3 text-center ${status === 'career-change' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => handleStatusChange('career-change')}
          >
            <span className="block mb-1">{t("careerChange")}</span>
            <span className="text-xs text-muted-foreground">{t("careerChangeDesc")}</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label>{t("languages")}</Label>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {languages.map((lang, index) => (
            <div key={index} className="pixel-card flex items-center gap-2 p-2 bg-background/80">
              <span>{lang.name}</span>
              <span className="px-2 py-1 bg-zou-purple/20 rounded text-xs">{lang.level}</span>
              <button 
                onClick={() => removeLanguage(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          {languages.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("noLanguagesAdded")}</p>
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder={t("languageName")}
            className="flex-1"
          />
          
          <select
            value={newLanguageLevel}
            onChange={(e) => setNewLanguageLevel(e.target.value as any)}
            className="bg-background border border-input rounded-md px-3 py-2 text-sm"
          >
            {LANGUAGE_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          
          <button 
            onClick={addLanguage}
            className="pixel-button-secondary p-2"
            disabled={!newLanguage.trim()}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label>{t("softSkills")}</Label>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {softSkills.map((skill, index) => (
            <div key={index} className="pixel-card flex items-center gap-2 p-2 bg-background/80">
              <span>{skill}</span>
              <button 
                onClick={() => removeSoftSkill(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          {softSkills.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("noSkillsAdded")}</p>
          )}
        </div>
        
        <div className="space-y-4">
          <Select value={selectedSkill} onValueChange={handleSkillSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("selectSkill")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {COMMON_SOFT_SKILLS.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder={t("customSkillName")}
              className="flex-1"
            />
            
            <button 
              onClick={addSoftSkill}
              className="pixel-button-secondary p-2"
              disabled={!newSkill.trim()}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusModuleStep;
