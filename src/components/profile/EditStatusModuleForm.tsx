
import { useState } from "react";
import { useUserData } from "../../context/UserDataContext";
import { useLanguage } from "../../context/LanguageContext";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, X } from "lucide-react";
import { StatusModule } from "@/context/UserDataContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface EditStatusModuleFormProps {
  onSave: () => void;
}

// Common language options
const languageOptions = [
  "English", "French", "Spanish", "German", "Italian", 
  "Portuguese", "Russian", "Chinese", "Japanese", "Arabic",
  "Hindi", "Korean", "Dutch", "Swedish", "Norwegian"
];

// Common soft skills
const softSkillOptions = [
  "Communication", "Team Work", "Problem Solving", "Time Management", 
  "Leadership", "Adaptability", "Creativity", "Critical Thinking",
  "Emotional Intelligence", "Work Ethic", "Attention to Detail", 
  "Conflict Resolution", "Empathy", "Negotiation"
];

const languageLevelDescriptions = {
  "A1": "Beginner",
  "A2": "Elementary",
  "B1": "Intermediate",
  "B2": "Upper Intermediate",
  "C1": "Advanced",
  "C2": "Proficient"
};

const EditStatusModuleForm = ({ onSave }: EditStatusModuleFormProps) => {
  const { userData, updateStatusModule } = useUserData();
  const { t } = useLanguage();
  
  const [status, setStatus] = useState<StatusModule['status']>(userData.statusModule.status);
  const [languages, setLanguages] = useState<StatusModule['languages']>([...userData.statusModule.languages]);
  const [softSkills, setSoftSkills] = useState<string[]>([...userData.statusModule.softSkills]);
  
  const [newLanguage, setNewLanguage] = useState<{ name: string; level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" }>({ name: "", level: "A1" });
  const [newSkill, setNewSkill] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  
  const handleStatusChange = (newStatus: StatusModule['status']) => {
    setStatus(newStatus);
  };
  
  const addLanguage = () => {
    if (newLanguage.name.trim()) {
      setLanguages([...languages, { ...newLanguage }]);
      setNewLanguage({ name: "", level: "A1" });
      setShowLanguageDropdown(false);
    }
  };
  
  const removeLanguage = (index: number) => {
    const updatedLanguages = [...languages];
    updatedLanguages.splice(index, 1);
    setLanguages(updatedLanguages);
  };
  
  const addSkill = () => {
    if (newSkill.trim()) {
      setSoftSkills([...softSkills, newSkill]);
      setNewSkill("");
      setShowSkillDropdown(false);
    }
  };
  
  const removeSkill = (index: number) => {
    const updatedSkills = [...softSkills];
    updatedSkills.splice(index, 1);
    setSoftSkills(updatedSkills);
  };
  
  const handleSubmit = async () => {
    await updateStatusModule({
      status,
      languages,
      softSkills
    });
    
    onSave();
  };
  
  const filteredLanguageOptions = languageOptions.filter(
    lang => !languages.some(l => l.name.toLowerCase() === lang.toLowerCase())
  );
  
  const filteredSkillOptions = softSkillOptions.filter(
    skill => !softSkills.some(s => s.toLowerCase() === skill.toLowerCase())
  );

  const selectLanguage = (lang: string) => {
    setNewLanguage({ ...newLanguage, name: lang });
    setShowLanguageDropdown(false);
  };

  const selectSkill = (skill: string) => {
    setNewSkill(skill);
    setShowSkillDropdown(false);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">{t("currentStatus")}</Label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            className={`pixel-card p-3 text-center ${status === 'student' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => handleStatusChange('student')}
          >
            {t("student")}
          </button>
          <button
            type="button"
            className={`pixel-card p-3 text-center ${status === 'employee' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => handleStatusChange('employee')}
          >
            {t("employee")}
          </button>
          <button
            type="button"
            className={`pixel-card p-3 text-center ${status === 'career-change' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => handleStatusChange('career-change')}
          >
            {t("careerChange")}
          </button>
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">{t("languages")}</Label>
        <div className="space-y-2">
          {languages.map((lang, index) => (
            <div key={index} className="flex items-center bg-muted/50 p-2 rounded-md">
              <span className="flex-1">{lang.name} - {lang.level} ({languageLevelDescriptions[lang.level]})</span>
              <button
                type="button"
                onClick={() => removeLanguage(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex mt-3 gap-2">
          <div className="relative flex-1">
            <Input
              value={newLanguage.name}
              onChange={(e) => {
                setNewLanguage({ ...newLanguage, name: e.target.value });
                setShowLanguageDropdown(true);
              }}
              onFocus={() => setShowLanguageDropdown(true)}
              placeholder={t("languageName")}
              className="flex-1"
            />
            {showLanguageDropdown && filteredLanguageOptions.length > 0 && (
              <div className="absolute z-10 w-full bg-popover shadow-md rounded-md mt-1 max-h-60 overflow-auto">
                {filteredLanguageOptions
                  .filter(lang => lang.toLowerCase().includes(newLanguage.name.toLowerCase()) || newLanguage.name === "")
                  .map((lang, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 hover:bg-accent cursor-pointer"
                      onClick={() => selectLanguage(lang)}
                    >
                      {lang}
                    </div>
                  ))}
              </div>
            )}
          </div>
          
          <Select
            value={newLanguage.level}
            onValueChange={(value) => setNewLanguage({ 
              ...newLanguage, 
              level: value as "A1" | "A2" | "B1" | "B2" | "C1" | "C2" 
            })}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A1">A1 - {languageLevelDescriptions.A1}</SelectItem>
              <SelectItem value="A2">A2 - {languageLevelDescriptions.A2}</SelectItem>
              <SelectItem value="B1">B1 - {languageLevelDescriptions.B1}</SelectItem>
              <SelectItem value="B2">B2 - {languageLevelDescriptions.B2}</SelectItem>
              <SelectItem value="C1">C1 - {languageLevelDescriptions.C1}</SelectItem>
              <SelectItem value="C2">C2 - {languageLevelDescriptions.C2}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button type="button" size="sm" onClick={addLanguage}>
            <Plus size={16} />
          </Button>
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">{t("softSkills")}</Label>
        <div className="space-y-2">
          {softSkills.map((skill, index) => (
            <div key={index} className="flex items-center bg-muted/50 p-2 rounded-md">
              <span className="flex-1">{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex mt-3 gap-2">
          <div className="relative flex-1">
            <Input
              value={newSkill}
              onChange={(e) => {
                setNewSkill(e.target.value);
                setShowSkillDropdown(true);
              }}
              onFocus={() => setShowSkillDropdown(true)}
              placeholder={t("skillName")}
              className="flex-1"
            />
            {showSkillDropdown && filteredSkillOptions.length > 0 && (
              <div className="absolute z-10 w-full bg-popover shadow-md rounded-md mt-1 max-h-60 overflow-auto">
                {filteredSkillOptions
                  .filter(skill => skill.toLowerCase().includes(newSkill.toLowerCase()) || newSkill === "")
                  .map((skill, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 hover:bg-accent cursor-pointer"
                      onClick={() => selectSkill(skill)}
                    >
                      {skill}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <Button type="button" size="sm" onClick={addSkill}>
            <Plus size={16} />
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>{t("save")}</Button>
      </div>
    </div>
  );
};

export default EditStatusModuleForm;
