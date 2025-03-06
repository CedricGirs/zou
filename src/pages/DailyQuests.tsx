
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Award, Plus, ListChecks, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "@/components/ui/button";
import { playSound } from "@/utils/audioUtils";

interface Quest {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
  completedDate?: string;
}

const DailyQuests = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [newQuestTitle, setNewQuestTitle] = useState("");
  const [newQuestXP, setNewQuestXP] = useState(50);

  // Load quests from localStorage on component mount
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
        
        setQuests(resetQuests);
        localStorage.setItem("zouDailyQuests", JSON.stringify(resetQuests));
        localStorage.setItem("zouLastQuestDate", today);
      } else {
        setQuests(parsedQuests);
      }
    }
  }, []);

  // Save quests to localStorage whenever they change
  useEffect(() => {
    if (quests.length > 0) {
      localStorage.setItem("zouDailyQuests", JSON.stringify(quests));
    }
  }, [quests]);

  const addQuest = () => {
    if (newQuestTitle.trim() === "") {
      toast({
        title: t("error"),
        description: t("pleaseEnterQuestTitle"),
        variant: "destructive",
      });
      return;
    }

    const newQuest: Quest = {
      id: Date.now().toString(),
      title: newQuestTitle,
      xp: newQuestXP,
      completed: false
    };

    setQuests([...quests, newQuest]);
    setNewQuestTitle("");
    setNewQuestXP(50);

    toast({
      title: t("questAdded"),
      description: t("newQuestAdded"),
    });
  };

  const toggleQuestCompletion = (questId: string) => {
    const updatedQuests = quests.map(quest => {
      if (quest.id === questId) {
        const completed = !quest.completed;
        return {
          ...quest,
          completed,
          completedDate: completed ? new Date().toISOString() : undefined
        };
      }
      return quest;
    });

    setQuests(updatedQuests);
    
    const completedQuest = quests.find(q => q.id === questId);
    if (completedQuest && !completedQuest.completed) {
      playSound('click');
      toast({
        title: t("questCompleted"),
        description: `+${completedQuest.xp} XP`,
      });
    }
  };

  const deleteQuest = (questId: string) => {
    setQuests(quests.filter(quest => quest.id !== questId));
    toast({
      title: t("questDeleted"),
      description: t("questHasBeenDeleted"),
    });
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ListChecks size={24} className="text-zou-purple mr-2" />
              <h1 className="text-2xl font-pixel">{t("dailyQuests")}</h1>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar size={16} className="mr-1" />
              <span className="text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          {/* Add new quest form */}
          <div className="glass-card p-4 mb-6">
            <h2 className="font-pixel text-lg mb-3">{t("addNewQuest")}</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newQuestTitle}
                onChange={(e) => setNewQuestTitle(e.target.value)}
                placeholder={t("questTitle")}
                className="pixel-input flex-1"
              />
              <div className="flex items-center">
                <input
                  type="number"
                  value={newQuestXP}
                  onChange={(e) => setNewQuestXP(Number(e.target.value))}
                  min="10"
                  max="200"
                  className="pixel-input w-20 text-center"
                />
                <span className="ml-2 mr-4">XP</span>
                <Button 
                  onClick={addQuest}
                  variant="default"
                  className="bg-zou-purple hover:bg-zou-purple/90"
                >
                  <Plus size={18} />
                  <span>{t("add")}</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Quests list */}
          <div className="space-y-3">
            {quests.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Award size={40} className="mx-auto mb-2 opacity-50" />
                <p>{t("noQuestsYet")}</p>
                <p className="text-sm">{t("addYourFirstQuest")}</p>
              </div>
            ) : (
              quests.map(quest => (
                <div 
                  key={quest.id}
                  className={`
                    pixel-card flex justify-between items-center
                    transition-all hover:translate-x-1 ${quest.completed ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex items-center flex-1">
                    <button
                      className={`
                        w-5 h-5 border-2 border-foreground rounded-sm mr-3 flex items-center justify-center
                        ${quest.completed ? 'bg-zou-purple' : 'bg-transparent'}
                      `}
                      onClick={() => toggleQuestCompletion(quest.id)}
                    >
                      {quest.completed && <Award size={12} className="text-white m-0.5" />}
                    </button>
                    <div>
                      <span className="text-sm">{quest.title}</span>
                      {quest.completedDate && (
                        <p className="text-xs text-muted-foreground">
                          {t("completed")}: {new Date(quest.completedDate).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <span className="text-xs font-medium mr-1">+{quest.xp}</span>
                      <span className="text-xs">XP</span>
                    </div>
                    <button
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => deleteQuest(quest.id)}
                    >
                      <span className="sr-only">{t("delete")}</span>
                      &times;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DailyQuests;
