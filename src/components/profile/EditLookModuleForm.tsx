
import { useState } from "react";
import { useUserData } from "../../context/UserDataContext";
import { useLanguage } from "../../context/LanguageContext";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, X } from "lucide-react";
import { LookModule } from "@/context/UserDataContext";

interface EditLookModuleFormProps {
  onSave: () => void;
}

const EditLookModuleForm = ({ onSave }: EditLookModuleFormProps) => {
  const { userData, updateLookModule } = useUserData();
  const { t } = useLanguage();
  
  const [style, setStyle] = useState<LookModule['style']>(userData.lookModule.style);
  const [sportsFrequency, setSportsFrequency] = useState(userData.lookModule.sportsFrequency);
  const [wardrobe, setWardrobe] = useState<string[]>([...userData.lookModule.wardrobe]);
  
  const [newItem, setNewItem] = useState("");
  
  const handleStyleChange = (newStyle: LookModule['style']) => {
    setStyle(newStyle);
  };
  
  const addWardrobeItem = () => {
    if (newItem.trim()) {
      setWardrobe([...wardrobe, newItem]);
      setNewItem("");
    }
  };
  
  const removeWardrobeItem = (index: number) => {
    const updatedWardrobe = [...wardrobe];
    updatedWardrobe.splice(index, 1);
    setWardrobe(updatedWardrobe);
  };
  
  const handleSubmit = async () => {
    await updateLookModule({
      style,
      sportsFrequency,
      wardrobe
    });
    
    onSave();
  };
  
  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">{t("style")}</Label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            className={`pixel-card p-3 text-center ${style === 'classic' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => handleStyleChange('classic')}
          >
            {t("classic")}
          </button>
          <button
            type="button"
            className={`pixel-card p-3 text-center ${style === 'sporty' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => handleStyleChange('sporty')}
          >
            {t("sporty")}
          </button>
          <button
            type="button"
            className={`pixel-card p-3 text-center ${style === 'streetwear' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => handleStyleChange('streetwear')}
          >
            {t("streetwear")}
          </button>
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">{t("sportsFrequency")}</Label>
        <div className="grid grid-cols-4 gap-3">
          <button
            type="button"
            className={`pixel-card p-2 text-center ${sportsFrequency === 'never' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => setSportsFrequency('never')}
          >
            {t("never")}
          </button>
          <button
            type="button"
            className={`pixel-card p-2 text-center ${sportsFrequency === 'rarely' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => setSportsFrequency('rarely')}
          >
            {t("rarely")}
          </button>
          <button
            type="button"
            className={`pixel-card p-2 text-center ${sportsFrequency === 'weekly' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => setSportsFrequency('weekly')}
          >
            {t("weekly")}
          </button>
          <button
            type="button"
            className={`pixel-card p-2 text-center ${sportsFrequency === 'daily' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => setSportsFrequency('daily')}
          >
            {t("daily")}
          </button>
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">{t("wardrobe")}</Label>
        <div className="space-y-2">
          {wardrobe.map((item, index) => (
            <div key={index} className="flex items-center bg-muted/50 p-2 rounded-md">
              <span className="flex-1">{item}</span>
              <button
                type="button"
                onClick={() => removeWardrobeItem(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex mt-3 gap-2">
          <Input
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={t("clothingItem")}
            className="flex-1"
          />
          <Button type="button" size="sm" onClick={addWardrobeItem}>
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditLookModuleForm;
