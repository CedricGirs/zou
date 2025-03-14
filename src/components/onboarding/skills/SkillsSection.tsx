
import { Input } from "../../ui/input";
import { Plus, X } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../ui/select";
import { COMMON_SOFT_SKILLS } from "../constants/language-levels";

interface SkillsSectionProps {
  softSkills: string[];
  removeSoftSkill: (index: number) => void;
  newSkill: string;
  setNewSkill: (value: string) => void;
  selectedSkill: string;
  setSelectedSkill: (value: string) => void;
  addSoftSkill: () => void;
  handleSkillSelect: (value: string) => void;
}

const SkillsSection = ({
  softSkills,
  removeSoftSkill,
  newSkill,
  setNewSkill,
  selectedSkill,
  handleSkillSelect,
  addSoftSkill
}: SkillsSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
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
  );
};

export default SkillsSection;
