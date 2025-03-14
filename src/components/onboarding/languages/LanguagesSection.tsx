
import { Input } from "../../ui/input";
import { Plus, X } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { LANGUAGE_LEVELS } from "../constants/language-levels";

interface LanguageSectionProps {
  languages: Array<{ name: string; level: string }>;
  removeLanguage: (index: number) => void;
  newLanguage: string;
  setNewLanguage: (value: string) => void;
  newLanguageLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  setNewLanguageLevel: (value: any) => void;
  addLanguage: () => void;
}

const LanguagesSection = ({ 
  languages, 
  removeLanguage, 
  newLanguage, 
  setNewLanguage, 
  newLanguageLevel, 
  setNewLanguageLevel, 
  addLanguage 
}: LanguageSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
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
  );
};

export default LanguagesSection;
