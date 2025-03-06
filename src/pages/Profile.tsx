
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { useOnboarding } from "../context/OnboardingContext";
import { useLanguage } from "../context/LanguageContext";
import Avatar from "../components/dashboard/Avatar";
import { Button } from "../components/ui/button";
import { ArrowRight, Edit, Settings, Award, Medal } from "lucide-react";
import { Badge } from "../types/badge";
import { badgeData } from "../data/badgeData";
import CustomBadge from "../components/ui/CustomBadge";
import { useToast } from "@/hooks/use-toast";
import { playSound } from "@/utils/audioUtils";

const Profile = () => {
  const { onboarding } = useOnboarding();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const { heroProfile, statusModule, lookModule, financeModule } = onboarding;
  
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
  
  // Get user rank (level 1 for now, later will be dynamic)
  const userRank = getUserRank(1);
  
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
              <Avatar size="lg" seed={heroProfile.avatarSeed} showLevel level={1} />
              <h2 className="mt-4 mb-1 text-xl">{heroProfile.username}</h2>
              <p className="text-sm text-muted-foreground font-pixel text-zou-purple">{userRank}</p>
              
              <Link to="/onboarding" className="mt-4">
                <Button className="flex items-center gap-2">
                  <Edit size={16} />
                  {t("editProfile")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-pixel text-lg">{t("heroProfile")}</h2>
              <Link to="/onboarding" className="text-zou-purple hover:underline text-sm flex items-center">
                {t("edit")} <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("class")}</p>
                <p>{t(heroProfile.class)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("ambitionLevel")}</p>
                <p>{t(heroProfile.ambitionLevel)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("primaryFocus")}</p>
                <p>{t(heroProfile.primaryFocus)}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-pixel text-lg">{t("statusModule")}</h2>
              <Link to="/onboarding?step=2" className="text-zou-purple hover:underline text-sm flex items-center">
                {t("edit")} <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">{t("currentStatus")}</p>
              <p>{t(statusModule.status)}</p>
              
              {statusModule.languages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{t("languages")}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {statusModule.languages.map((lang, i) => (
                      <span key={i} className="pixel-card p-1 px-2 text-xs">
                        {lang.name} ({lang.level})
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {statusModule.softSkills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{t("softSkills")}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {statusModule.softSkills.map((skill, i) => (
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
              <Link 
                to="/badges" 
                className="text-zou-purple hover:underline text-sm flex items-center"
              >
                {t("viewAllBadges")} <ArrowRight size={14} className="ml-1" />
              </Link>
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
                  <Link 
                    to="/badges" 
                    className="inline-flex items-center mt-2 text-zou-purple hover:underline"
                  >
                    {t("exploreBadges")}
                  </Link>
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
              <Link to="/onboarding" className="block">
                <Button className="w-full justify-between">
                  {t("restartOnboarding")}
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
