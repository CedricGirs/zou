import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Avatar from "../components/dashboard/Avatar";
import LifeGauges from "../components/dashboard/LifeGauges";
import XPBar from "../components/dashboard/XPBar";
import CustomBadge from "../components/ui/CustomBadge";
import { Award, ArrowRight, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "../context/LanguageContext";
import { playSound, preloadSounds } from "@/utils/audioUtils";
import { badgeData } from "../data/badgeData";
import { Badge } from "../types/badge";

// Interface for quests
interface Quest {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  completedDate?: string;
}

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

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [level, setLevel] = useState(5);
  const [currentXP, setCurrentXP] = useState(350);
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const maxXP = 1000;
  
  // Preload sounds when component mounts
  useEffect(() => {
    preloadSounds();
  }, []);
  
  // Load quests from localStorage
  useEffect(() => {
    const storedQuests = localStorage.getItem("zouDailyQuests");
    if (storedQuests) {
      const parsedQuests = JSON.parse(storedQuests);
      
      // Check if quests need to be reset for the new day
      const lastCompletedDate = localStorage.getItem("zouLastQuestDate");
      const today = new Date().toDateString();
      
      if (lastCompletedDate !== today) {
        // Reset completion status for all quests
        const resetQuests = parsedQuests.map((quest: Quest) => ({
          ...quest,
          completed: false,
          completedDate: undefined
        }));
        
        setDailyQuests(resetQuests);
        localStorage.setItem("zouDailyQuests", JSON.stringify(resetQuests));
        localStorage.setItem("zouLastQuestDate", today);
      } else {
        setDailyQuests(parsedQuests);
      }
    }
  }, []);

  // Filter out completed quests for display
  const incompleteQuests = dailyQuests.filter(quest => !quest.completed);
  
  // Get recently unlocked badges (max 3)
  const recentBadges = badgeData
    .filter(badge => badge.unlocked && badge.unlockedDate)
    .sort((a, b) => {
      const dateA = new Date(a.unlockedDate || "");
      const dateB = new Date(b.unlockedDate || "");
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 3);
  
  const addXP = (amount: number) => {
    let newXP = currentXP + amount;
    let newLevel = level;
    
    if (newXP >= maxXP) {
      newXP = newXP - maxXP;
      newLevel = level + 1;
      
      playSound('levelUp');
      toast({
        title: "Level Up!",
        description: `Congratulations! You've reached level ${newLevel}!`,
        duration: 5000,
      });
    }
    
    setCurrentXP(newXP);
    setLevel(newLevel);
  };
  
  const completeQuest = (questId: string) => {
    const updatedQuests = dailyQuests.map(quest => {
      if (quest.id === questId && !quest.completed) {
        playSound('click');
        addXP(quest.xp);
        
        toast({
          title: "Quest Completed!",
          description: `+${quest.xp} XP earned`,
          duration: 3000,
        });
        
        return {
          ...quest,
          completed: true,
          completedDate: new Date().toISOString()
        };
      }
      return quest;
    });
    
    setDailyQuests(updatedQuests);
    localStorage.setItem("zouDailyQuests", JSON.stringify(updatedQuests));
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
  
  // User rank
  const userRank = getUserRank(level);
  
  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1">
          <div className="glass-card p-6 flex flex-col items-center">
            <Avatar size="lg" showLevel level={level} />
            <h2 className="mt-4 mb-1 text-xl">{t("welcome")}</h2>
            <p className="text-sm text-muted-foreground mb-2 font-pixel text-zou-purple">{userRank}</p>
            <XPBar currentXP={currentXP} maxXP={maxXP} />
            <div className="mt-6 w-full">
              <h3 className="font-pixel text-sm mb-3">{t("lifeGauges")}</h3>
              <LifeGauges />
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="glass-card p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Award size={18} className="text-zou-purple mr-2" />
                <h2 className="font-pixel text-lg">{t("dailyQuests")}</h2>
              </div>
              <Link 
                to="/daily-quests" 
                className="text-zou-purple hover:underline text-sm flex items-center"
              >
                {t("manageQuests")} <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {incompleteQuests.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <Award size={40} className="mx-auto mb-2 opacity-50" />
                  <p>{t("allQuestsCompleted")}</p>
                  <Link 
                    to="/daily-quests" 
                    className="inline-flex items-center mt-4 text-zou-purple hover:underline"
                  >
                    <Plus size={14} className="mr-1" />
                    {t("addMoreQuests")}
                  </Link>
                </div>
              ) : (
                incompleteQuests.map(quest => (
                  <div 
                    key={quest.id}
                    className="pixel-card flex justify-between items-center cursor-pointer transition-all hover:translate-x-1"
                    onClick={() => completeQuest(quest.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-foreground rounded-sm mr-3 bg-transparent">
                        {quest.completed && <Award size={12} className="text-white m-0.5" />}
                      </div>
                      <span className="text-sm">{quest.title}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-xs font-medium mr-1">+{quest.xp}</span>
                      <span className="text-xs">XP</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6">
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
                {recentBadges.map(badge => (
                  <CustomBadge 
                    key={badge.id}
                    icon={badge.icon}
                    name={badge.name}
                    description={badge.description}
                    rarity={badge.rarity}
                    unlocked={badge.unlocked}
                    onClick={() => showBadgeDetails(badge)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
