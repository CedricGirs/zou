
import { useState } from "react";
import { useUserData } from "../../context/UserDataContext";
import { useLanguage } from "../../context/LanguageContext";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, X } from "lucide-react";
import { StatusModule } from "@/context/UserDataContext";

interface EditStatusModuleFormProps {
  onSave: () => void;
}

const EditStatusModuleForm = ({ onSave }: EditStatusModuleFormProps) => {
  const { userData, updateStatusModule } = useUserData();
  const { t } = useLanguage();
  
  const [status, setStatus] = useState<StatusModule['status']>(userData.statusModule.status);
  const [languages, setLanguages] = useState<StatusModule['languages']>([...userData.statusModule.languages]);
  const [softSkills, setSoftSkills] = useState<string[]>([...userData.statusModule.softSkills]);
  
  const [newLanguage, setNewLanguage] = useState<{ name: string; level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" }>({ name: "", level: "A1" });
  const [newSkill, setNewSkill] = useState("");
  
  const handleStatusChange = (newStatus: StatusModule['status']) => {
    setStatus(newStatus);
  };
  
  const addLanguage = () => {
    if (newLanguage.name.trim()) {
      setLanguages([...languages, { ...newLanguage }]);
      setNewLanguage({ name: "", level: "A1" });
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
              <span className="flex-1">{lang.name} ({lang.level})</span>
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
          <Input
            value={newLanguage.name}
            onChange={(e) => setNewLanguage({ ...newLanguage, name: e.target.value })}
            placeholder={t("languageName")}
            className="flex-1"
          />
          <select
            value={newLanguage.level}
            onChange={(e) => setNewLanguage({ 
              ...newLanguage, 
              level: e.target.value as "A1" | "A2" | "B1" | "B2" | "C1" | "C2" 
            })}
            className="rounded-md border border-input bg-background px-3 py-2"
          >
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
            <option value="C1">C1</option>
            <option value="C2">C2</option>
          </select>
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
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder={t("skillName")}
            className="flex-1"
          />
          <Button type="button" size="sm" onClick={addSkill}>
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditStatusModuleForm;
