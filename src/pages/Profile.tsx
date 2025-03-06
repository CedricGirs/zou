import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useOnboarding } from "../context/OnboardingContext";
import { useLanguage } from "../context/LanguageContext";
import Avatar from "../components/dashboard/Avatar";
import { Button } from "../components/ui/button";
import { ArrowRight, Edit, Settings, Award, Medal, Shuffle, Sword, Brain, Heart } from "lucide-react";
import { Badge } from "../types/badge";
import { badgeData } from "../data/badgeData";
import CustomBadge from "../components/ui/CustomBadge";
import { useToast } from "@/hooks/use-toast";
import { playSound } from "@/utils/audioUtils";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useUserData } from "@/context/UserDataContext";

const Profile = () => {
  const { onboarding, updateHeroProfile: updateOnboardingHeroProfile } = useOnboarding();
  const { userData, updateHeroProfile: updateUserHeroProfile } = useUserData();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(userData.heroProfile.username || onboarding.heroProfile.username);
  const [avatarSeed, setAvatarSeed] = useState(userData.heroProfile.avatarSeed || onboarding.heroProfile.avatarSeed);
  const [primaryFocus, setPrimaryFocus] = useState(userData.heroProfile.primaryFocus || onboarding.heroProfile.primaryFocus);
  const [ambitionLevel, setAmbitionLevel] = useState(userData.heroProfile.ambitionLevel || onboarding.heroProfile.ambitionLevel);
  const [selectedClass, setSelectedClass] = useState(userData.heroProfile.class || onboarding.heroProfile.class);
  
  // Get recently unlocked badges (up to 3)
  const recentBadges = badgeData
    .filter(badge => badge.unlocked && badge.unlockedDate)
    .sort((a, b) => {
      const dateA = new Date(a.unlockedDate || "");
      const dateB = new Date(b.unlockedDate || "");
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 3);
  
  // Function to determine user rank based on level
  const getUserRank = (level: number): string => {
    if (level >= 1 && level <= 10) return "Apprentice";
    if (level >= 11 && level <= 30) return "Fighter";
    if (level >= 31 && level <= 50) return "Hero";
    if (level >= 51 && level <= 70) return "Master";
    if (level >= 71 && level <= 90) return "Legendary";
    if (level >= 91) return "Divine";
    return "Novice"; // Default
  };
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
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
    playSound('click');
  };
  
  const handlePrimaryFocusChange = (focus: 'status' | 'look' | 'finances' | 'mix') => {
    setPrimaryFocus(focus);
  };
  
  const handleAmbitionLevelChange = (level: 'casual' | 'pro' | 'hardcore') => {
    setAmbitionLevel(level);
  };
  
  const handleClassSelect = (heroClass: 'warrior' | 'mage' | 'healer') => {
    setSelectedClass(heroClass);
  };
  
  const showBadgeDetails = (badge: Badge) => {
    if (badge.unlocked) {
      playSound('badge');
      toast({
        title: badge.name,
        description: `${badge.description}${badge.unlockedDate ? `\n${t("unlockedOn")}: ${new Date(badge.unlockedDate).toLocaleDateString()}` : ''}`,
        duration: 3000,
      });
    } else {
      toast({
        title: t("badgeLocked"),
        description: t("completeRequirements"),
        duration: 3000,
      });
    }
  };
  
  const saveProfile = () => {
    // Update both contexts to ensure synchronization
    const profileUpdates = {
      username,
      avatarSeed,
      primaryFocus,
      ambitionLevel,
      class: selectedClass
    };
    
    updateUserHeroProfile(profileUpdates);
    updateOnboardingHeroProfile(profileUpdates);
    
    setIsEditing(false);
    
    toast({
      title: t("profileUpdated"),
      description: t("profileUpdateSuccess"),
    });
    playSound('click');
  };

  // Get user rank (level 1 for now, later will be dynamic)
  const userRank = getUserRank(1);
  
  if (isEditing) {
    return (
      <MainLayout>
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-pixel mb-2">{t("editProfile")}</h1>
          <p className="text-muted-foreground">{t("updateYourProfileInfo")}</p>
        </div>
        
        <div className="glass-card p-6 max-w-4xl mx-auto">
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
                    className={`pixel-card p-3 text-center ${primaryFocus === 'status' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                    onClick={() => handlePrimaryFocusChange('status')}
                  >
                    <span className="block mb-1">{t("status")}</span>
                    <span className="text-xs text-muted-foreground">{t("statusPriority")}</span>
                  </button>
                  <button
                    className={`pixel-card p-3 text-center ${primaryFocus === 'look' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                    onClick={() => handlePrimaryFocusChange('look')}
                  >
                    <span className="block mb-1">{t("look")}</span>
                    <span className="text-xs text-muted-foreground">{t("lookPriority")}</span>
                  </button>
                  <button
                    className={`pixel-card p-3 text-center ${primaryFocus === 'finances' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                    onClick={() => handlePrimaryFocusChange('finances')}
                  >
                    <span className="block mb-1">{t("finances")}</span>
                    <span className="text-xs text-muted-foreground">{t("financesPriority")}</span>
                  </button>
                  <button
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
                    className={`pixel-card p-2 text-center ${ambitionLevel === 'casual' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                    onClick={() => handleAmbitionLevelChange('casual')}
                  >
                    <span className="block text-sm">{t("casual")}</span>
                    <span className="text-[10px] text-muted-foreground">{t("casualDesc")}</span>
                  </button>
                  <button
                    className={`pixel-card p-2 text-center ${ambitionLevel === 'pro' ? 'bg-zou-purple/20 border-zou-purple' : ''}`}
                    onClick={() => handleAmbitionLevelChange('pro')}
                  >
                    <span className="block text-sm">{t("pro")}</span>
                    <span className="text-[10px] text-muted-foreground">{t("proDesc")}</span>
                  </button>
                  <button
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
          
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={saveProfile}>
              {t("saveChanges")}
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-pixel mb-2">{t("profileTitle")}</h1>
        <p className="text-muted-foreground">{t("profileDescription")}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1">
          <div className="glass-card p-6">
            <div className="flex flex-col items-center">
              <Avatar size="lg" seed={userData.heroProfile.avatarSeed} showLevel level={1} />
              <h2 className="mt-4 mb-1 text-xl">{userData.heroProfile.username}</h2>
              <p className="text-sm text-muted-foreground font-pixel text-zou-purple">{userRank}</p>
              
              <Button className="mt-4 flex items-center gap-2" onClick={() => setIsEditing(true)}>
                <Edit size={16} />
                {t("editProfile")}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-pixel text-lg">{t("heroProfile")}</h2>
              <Button variant="ghost" className="text-zou-purple hover:underline text-sm flex items-center" onClick={() => setIsEditing(true)}>
                {t("edit")} <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("class")}</p>
                <p>{t(userData.heroProfile.class)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("ambitionLevel")}</p>
                <p>{t(userData.heroProfile.ambitionLevel)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("primaryFocus")}</p>
                <p>{t(userData.heroProfile.primaryFocus)}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-pixel text-lg">{t("statusModule")}</h2>
              <Button variant="ghost" className="text-zou-purple hover:underline text-sm flex items-center" onClick={() => setIsEditing(true)}>
                {t("edit")} <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">{t("currentStatus")}</p>
              <p>{onboarding.statusModule.status ? t(onboarding.statusModule.status) : t("notSpecified")}</p>
              
              {userData.statusModule.languages?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{t("languages")}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {userData.statusModule.languages.map((lang, i) => (
                      <span key={i} className="pixel-card p-1 px-2 text-xs">
                        {lang.name} ({lang.level})
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {userData.statusModule.softSkills?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{t("softSkills")}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {userData.statusModule.softSkills.map((skill, i) => (
                      <span key={i} className="pixel-card p-1 px-2 text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Award size={18} className="text-zou-purple mr-2" />
                <h2 className="font-pixel text-lg">{t("recentBadges")}</h2>
              </div>
              <Button variant="ghost" className="text-zou-purple hover:underline text-sm flex items-center" asChild>
                <a href="/badges">
                  {t("viewAllBadges")} <ArrowRight size={14} className="ml-1" />
                </a>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recentBadges.length > 0 ? (
                recentBadges.map(badge => (
                  <CustomBadge
                    key={badge.id}
                    icon={badge.icon}
                    name={badge.name}
                    description={badge.description}
                    rarity={badge.rarity}
                    unlocked={badge.unlocked}
                    onClick={() => showBadgeDetails(badge)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-6 text-muted-foreground">
                  <Medal size={32} className="mx-auto mb-2 opacity-50" />
                  <p>{t("noBadgesYet")}</p>
                  <a href="/badges" className="inline-flex items-center mt-2 text-zou-purple hover:underline">
                    {t("exploreBadges")}
                  </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-pixel text-lg">{t("settings")}</h2>
              <Settings size={16} className="text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-between" onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}>
                {t("resetAllData")}
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
