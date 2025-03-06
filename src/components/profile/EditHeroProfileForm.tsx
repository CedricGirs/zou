
import { useState } from "react";
import { useUserData } from "../../context/UserDataContext";
import { useLanguage } from "../../context/LanguageContext";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Avatar from "../dashboard/Avatar";
import { Shuffle, Sword, Brain, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HeroProfile } from "@/context/UserDataContext";

interface EditHeroProfileFormProps {
  onSave: () => void;
}

const EditHeroProfileForm = ({ onSave }: EditHeroProfileFormProps) => {
  const { userData, updateHeroProfile } = useUserData();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [username, setUsername] = useState(userData.heroProfile.username);
  const [avatarSeed, setAvatarSeed] = useState(userData.heroProfile.avatarSeed);
  const [primaryFocus, setPrimaryFocus] = useState<HeroProfile['primaryFocus']>(userData.heroProfile.primaryFocus);
  const [ambitionLevel, setAmbitionLevel] = useState<HeroProfile['ambitionLevel']>(userData.heroProfile.ambitionLevel);
  const [selectedClass, setSelectedClass] = useState<HeroProfile['class']>(userData.heroProfile.class);
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  
  const handleSubmit = async () => {
    if (!username.trim()) {
      toast({
        title: t("error"),
        description: t("usernameRequired"),
        variant: "destructive",
      });
      return;
    }
    
    await updateHeroProfile({
      username,
      avatarSeed,
      primaryFocus,
      ambitionLevel,
      class: selectedClass
    });
    
    onSave();
  };
  
  const generateRandomAvatar = () => {
    const seeds = [
      "Felix", "Zoe", "Alex", "Maya", "Lucas", "Lily", "Nathan", 
      "Emma", "Oliver", "Sophia", "Ethan", "Ava", "Noah", "Isabella"
    ];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
    setAvatarSeed(randomSeed);
    
    toast({
      title: t("avatarUpdated"),
      description: t("newAvatarGenerated"),
    });
  };
  
  const handlePrimaryFocusChange = (focus: HeroProfile['primaryFocus']) => {
    setPrimaryFocus(focus);
  };
  
  const handleAmbitionLevelChange = (level: HeroProfile['ambitionLevel']) => {
    setAmbitionLevel(level);
  };
  
  const handleClassSelect = (heroClass: HeroProfile['class']) => {
    setSelectedClass(heroClass);
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label htmlFor="username">{t("username")}</Label>
          <Input
            id="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder={t("enterUsername")}
            className="font-pixel"
          />
          
          <div className="mt-6">
            <Label>{t("priority")}</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <button
                type="button"
                className={`pixel-card p-3 text-center ${primaryFocus === 'status' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                onClick={() => handlePrimaryFocusChange('status')}
              >
                <span className="block mb-1">{t("status")}</span>
                <span className="text-xs text-muted-foreground">{t("statusPriority")}</span>
              </button>
              <button
                type="button"
                className={`pixel-card p-3 text-center ${primaryFocus === 'look' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                onClick={() => handlePrimaryFocusChange('look')}
              >
                <span className="block mb-1">{t("look")}</span>
                <span className="text-xs text-muted-foreground">{t("lookPriority")}</span>
              </button>
              <button
                type="button"
                className={`pixel-card p-3 text-center ${primaryFocus === 'finances' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                onClick={() => handlePrimaryFocusChange('finances')}
              >
                <span className="block mb-1">{t("finances")}</span>
                <span className="text-xs text-muted-foreground">{t("financesPriority")}</span>
              </button>
              <button
                type="button"
                className={`pixel-card p-3 text-center ${primaryFocus === 'mix' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                onClick={() => handlePrimaryFocusChange('mix')}
              >
                <span className="block mb-1">{t("balanced")}</span>
                <span className="text-xs text-muted-foreground">{t("balancedPriority")}</span>
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <Label>{t("ambitionLevel")}</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <button
                type="button"
                className={`pixel-card p-2 text-center ${ambitionLevel === 'casual' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                onClick={() => handleAmbitionLevelChange('casual')}
              >
                <span className="block text-sm">{t("casual")}</span>
                <span className="text-[10px] text-muted-foreground">{t("casualDesc")}</span>
              </button>
              <button
                type="button"
                className={`pixel-card p-2 text-center ${ambitionLevel === 'pro' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                onClick={() => handleAmbitionLevelChange('pro')}
              >
                <span className="block text-sm">{t("pro")}</span>
                <span className="text-[10px] text-muted-foreground">{t("proDesc")}</span>
              </button>
              <button
                type="button"
                className={`pixel-card p-2 text-center ${ambitionLevel === 'hardcore' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                onClick={() => handleAmbitionLevelChange('hardcore')}
              >
                <span className="block text-sm">{t("hardcore")}</span>
                <span className="text-[10px] text-muted-foreground">{t("hardcoreDesc")}</span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <Label className="self-start">{t("heroAvatar")}</Label>
          <div className="relative">
            <Avatar 
              size="xl" 
              seed={avatarSeed} 
              showLevel 
              level={1} 
            />
            <button
              type="button"
              className="absolute bottom-0 right-0 bg-zou-purple text-white p-2 rounded-full pixel-border"
              onClick={generateRandomAvatar}
              title={t("generateRandomAvatar")}
            >
              <Shuffle size={16} />
            </button>
          </div>
          
          <div className="mt-8 w-full">
            <Label className="block mb-3">{t("heroClass")}</Label>
            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                className={`pixel-card p-3 flex items-center ${selectedClass === 'warrior' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                onClick={() => handleClassSelect('warrior')}
              >
                <div className="bg-red-200 dark:bg-red-900 p-2 rounded-full mr-3">
                  <Sword size={18} className="text-red-600 dark:text-red-300" />
                </div>
                <div className="flex-1">
                  <div className="font-pixel text-sm">{t("warrior")}</div>
                  <div className="text-xs text-muted-foreground">{t("warriorDesc")}</div>
                </div>
              </button>
              
              <button
                type="button"
                className={`pixel-card p-3 flex items-center ${selectedClass === 'mage' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                onClick={() => handleClassSelect('mage')}
              >
                <div className="bg-blue-200 dark:bg-blue-900 p-2 rounded-full mr-3">
                  <Brain size={18} className="text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <div className="font-pixel text-sm">{t("mage")}</div>
                  <div className="text-xs text-muted-foreground">{t("mageDesc")}</div>
                </div>
              </button>
              
              <button
                type="button"
                className={`pixel-card p-3 flex items-center ${selectedClass === 'healer' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                onClick={() => handleClassSelect('healer')}
              >
                <div className="bg-green-200 dark:bg-green-900 p-2 rounded-full mr-3">
                  <Heart size={18} className="text-green-600 dark:text-green-300" />
                </div>
                <div className="flex-1">
                  <div className="font-pixel text-sm">{t("healer")}</div>
                  <div className="text-xs text-muted-foreground">{t("healerDesc")}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pixel-card p-4 bg-zou-purple/10 mt-6">
        <p className="text-sm">
          <span className="font-pixel">{t("heroGrade")}: </span>
          <span className="font-pixel text-zou-purple">{t("newborn")}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {t("gradeDescription")}
        </p>
      </div>
    </div>
  );
};

export default EditHeroProfileForm;
