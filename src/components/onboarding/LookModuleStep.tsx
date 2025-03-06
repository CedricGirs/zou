
import { useState } from "react";
import { useOnboarding } from "../../context/OnboardingContext";
import { useLanguage } from "../../context/LanguageContext";
import { Label } from "../ui/label";
import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const SPORTS_FREQUENCY = [
  "daily",
  "several-times-week",
  "weekly",
  "monthly",
  "rarely",
  "never"
];

const COMMON_WARDROBE_ITEMS = [
  "t-shirt",
  "jeans",
  "sweater",
  "dress",
  "shirt",
  "skirt",
  "jacket",
  "coat",
  "hoodie",
  "shorts",
  "suit",
  "sneakers",
  "boots",
  "heels",
  "sandals"
];

const LookModuleStep = () => {
  const { onboarding, updateLookModule } = useOnboarding();
  const { t } = useLanguage();
  
  const [style, setStyle] = useState(onboarding.lookModule.style);
  const [sportsFrequency, setSportsFrequency] = useState(onboarding.lookModule.sportsFrequency);
  const [wardrobe, setWardrobe] = useState(onboarding.lookModule.wardrobe);
  
  // New wardrobe item
  const [newWardrobeItem, setNewWardrobeItem] = useState("");
  
  const handleStyleChange = (newStyle: 'classic' | 'sporty' | 'streetwear') => {
    setStyle(newStyle);
    updateLookModule({ style: newStyle });
  };
  
  const handleSportsFrequencyChange = (frequency: string) => {
    setSportsFrequency(frequency);
    updateLookModule({ sportsFrequency: frequency });
  };
  
  const addWardrobeItem = (item: string) => {
    if (!item.trim() || wardrobe.includes(item)) return;
    
    const updatedWardrobe = [...wardrobe, item];
    setWardrobe(updatedWardrobe);
    updateLookModule({ wardrobe: updatedWardrobe });
    setNewWardrobeItem("");
  };
  
  const removeWardrobeItem = (indexToRemove: number) => {
    const updatedWardrobe = wardrobe.filter((_, index) => index !== indexToRemove);
    setWardrobe(updatedWardrobe);
    updateLookModule({ wardrobe: updatedWardrobe });
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label>{t("style")}</Label>
        <div className="grid grid-cols-3 gap-3">
          <button
            className={`pixel-card p-3 text-center ${style === 'classic' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => handleStyleChange('classic')}
          >
            <span className="block mb-1">{t("classic")}</span>
            <span className="text-xs text-muted-foreground">{t("classicDesc")}</span>
          </button>
          <button
            className={`pixel-card p-3 text-center ${style === 'sporty' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => handleStyleChange('sporty')}
          >
            <span className="block mb-1">{t("sporty")}</span>
            <span className="text-xs text-muted-foreground">{t("sportyDesc")}</span>
          </button>
          <button
            className={`pixel-card p-3 text-center ${style === 'streetwear' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
            onClick={() => handleStyleChange('streetwear')}
          >
            <span className="block mb-1">{t("streetwear")}</span>
            <span className="text-xs text-muted-foreground">{t("streetwearDesc")}</span>
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        <Label>{t("sportsFrequency")}</Label>
        <Select value={sportsFrequency} onValueChange={handleSportsFrequencyChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("selectFrequency")} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {SPORTS_FREQUENCY.map((frequency) => (
                <SelectItem key={frequency} value={frequency}>
                  {t(frequency)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-4">
        <Label>{t("wardrobe")}</Label>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {wardrobe.map((item, index) => (
            <div key={index} className="pixel-card flex items-center gap-2 p-2 bg-background/80">
              <span>{item}</span>
              <button 
                onClick={() => removeWardrobeItem(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          
          {wardrobe.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("noWardrobeItems")}</p>
          )}
        </div>
        
        <div className="space-y-4">
          {/* Dropdown for selecting common wardrobe items */}
          <Select onValueChange={(value) => {
            addWardrobeItem(value);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("selectWardrobeItem")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {COMMON_WARDROBE_ITEMS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {t(item)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          {/* Manual input for custom wardrobe items */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newWardrobeItem}
              onChange={(e) => setNewWardrobeItem(e.target.value)}
              placeholder={t("customWardrobeItem")}
              className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            
            <button 
              onClick={() => addWardrobeItem(newWardrobeItem)}
              className="pixel-button-secondary p-2"
              disabled={!newWardrobeItem.trim()}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LookModuleStep;
