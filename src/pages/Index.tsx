import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import Avatar from "../components/dashboard/Avatar";
import LifeGauges from "../components/dashboard/LifeGauges";
import XPBar from "../components/dashboard/XPBar";
import Badge from "../components/ui/badge";
import { Book, Award, Dumbbell, Globe, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "../context/LanguageContext";

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [level, setLevel] = useState(5);
  const [currentXP, setCurrentXP] = useState(350);
  const maxXP = 1000;
  
  const recentBadges = [
    { 
      id: "book-worm", 
      icon: <Book size={16} />, 
      name: "Book Worm", 
      description: "Read 5 books in a month", 
      rarity: "uncommon", 
      unlocked: true 
    },
    { 
      id: "polyglot", 
      icon: <Globe size={16} />, 
      name: "Polyglot", 
      description: "Reach B2 level in 2 languages", 
      rarity: "rare", 
      unlocked: true 
    },
    { 
      id: "gym-rat", 
      icon: <Dumbbell size={16} />, 
      name: "Gym Rat", 
      description: "Work out 20 times in a month", 
      rarity: "uncommon", 
      unlocked: false 
    }
  ];
  
  const dailyQuests = [
    { id: "meditation", title: "Meditate for 10 minutes", xp: 50, completed: false },
    { id: "study", title: "Study for 1 hour", xp: 100, completed: false },
    { id: "exercise", title: "30 minutes of exercise", xp: 75, completed: false }
  ];
  
  const addXP = (amount: number) => {
    let newXP = currentXP + amount;
    let newLevel = level;
    
    if (newXP >= maxXP) {
      newXP = newXP - maxXP;
      newLevel = level + 1;
      
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
    const quest = dailyQuests.find(q => q.id === questId);
    if (quest && !quest.completed) {
      quest.completed = true;
      addXP(quest.xp);
      
      toast({
        title: "Quest Completed!",
        description: `+${quest.xp} XP earned`,
        duration: 3000,
      });
    }
  };
  
  const showBadgeDetails = (badge: any) => {
    if (badge.unlocked) {
      toast({
        title: badge.name,
        description: badge.description,
        duration: 3000,
      });
    } else {
      toast({
        title: "Badge Locked",
        description: "Complete the requirements to unlock this badge!",
        duration: 3000,
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1">
          <div className="glass-card p-6 flex flex-col items-center">
            <Avatar size="lg" showLevel level={level} />
            <h2 className="mt-4 mb-2 text-xl">{t("welcome")}</h2>
            <XPBar currentXP={currentXP} maxXP={maxXP} />
            <div className="mt-6 w-full">
              <h3 className="font-pixel text-sm mb-3">{t("lifeGauges")}</h3>
              <LifeGauges />
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="glass-card p-6 h-full">
            <div className="flex items-center mb-4">
              <Zap size={18} className="text-zou-purple mr-2" />
              <h2 className="font-pixel text-lg">{t("dailyQuests")}</h2>
            </div>
            
            <div className="space-y-3">
              {dailyQuests.map(quest => (
                <div 
                  key={quest.id}
                  className={`
                    pixel-card flex justify-between items-center cursor-pointer
                    transition-all hover:translate-x-1 ${quest.completed ? 'opacity-50' : ''}
                  `}
                  onClick={() => completeQuest(quest.id)}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-5 h-5 border-2 border-foreground rounded-sm mr-3
                      ${quest.completed ? 'bg-zou-purple' : 'bg-transparent'}
                    `}>
                      {quest.completed && <Award size={12} className="text-white m-0.5" />}
                    </div>
                    <span className="text-sm">{quest.title}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium mr-1">+{quest.xp}</span>
                    <span className="text-xs">XP</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <div className="flex items-center mb-4">
                <Award size={18} className="text-zou-purple mr-2" />
                <h2 className="font-pixel text-lg">{t("recentBadges")}</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recentBadges.map(badge => (
                  <Badge 
                    key={badge.id}
                    icon={badge.icon}
                    name={badge.name}
                    description={badge.description}
                    rarity={badge.rarity as any}
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
