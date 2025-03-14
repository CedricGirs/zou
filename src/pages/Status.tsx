
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import StatusCard from "../components/status/StatusCard";
import AddItemModal from "../components/status/AddItemModal";
import StatusLevel from "../components/status/StatusLevel";
import StatusAchievements from "../components/status/StatusAchievements";
import StatusAdviceDialog from "../components/status/StatusAdviceDialog";
import { GraduationCap, Globe, Brain, Plus, Award } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/context/UserDataContext";
import { StatusItem } from "@/types/StatusTypes";

const Status = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { userData, updateStatusItems, updateStatusModule } = useUserData();
  
  // Utiliser les status items depuis le context
  const [items, setItems] = useState<StatusItem[]>(userData.statusItems);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"course" | "language" | "skill">("course");
  
  // Synchroniser avec les données du context quand elles changent
  useEffect(() => {
    setItems(userData.statusItems);
  }, [userData.statusItems]);
  
  const updateItem = async (id: string, updates: Partial<StatusItem>) => {
    const updatedItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ) as StatusItem[];
    
    setItems(updatedItems);
    await updateStatusItems(updatedItems);
    
    // Award XP for progress
    const oldItem = items.find(item => item.id === id);
    const newItem = updatedItems.find(item => item.id === id);
    
    // Check if progress increased significantly or reached 100%
    if (newItem && oldItem && 
        ((newItem.progress >= 100 && oldItem.progress < 100) || 
         (newItem.progress - oldItem.progress >= 25))) {
      
      // Calculate XP reward based on progress increase
      let xpReward = 5; // Base XP for progress
      
      if (newItem.progress >= 100 && oldItem.progress < 100) {
        xpReward = 20; // Bonus for completion
        
        toast({
          title: "Félicitations!",
          description: `${newItem.title} terminé! +${xpReward} XP`,
          variant: "default",
        });
      } else {
        toast({
          title: "Progression!",
          description: `+${xpReward} XP pour votre avancement`,
          variant: "default",
        });
      }
      
      // Update XP
      const currentXP = userData.statusModule.statusXP || 0;
      const currentLevel = userData.statusModule.statusLevel || 1;
      const maxXP = userData.statusModule.maxXP || 100;
      
      let newXP = currentXP + xpReward;
      let newLevel = currentLevel;
      let newMaxXP = maxXP;
      
      // Level up if threshold reached
      if (newXP >= maxXP) {
        newLevel += 1;
        newXP = newXP - maxXP;
        newMaxXP = Math.floor(maxXP * 1.5);
        
        toast({
          title: "Niveau supérieur!",
          description: `Vous avez atteint le niveau ${newLevel} en formation!`,
          variant: "default",
        });
      }
      
      await updateStatusModule({
        statusXP: newXP,
        statusLevel: newLevel,
        maxXP: newMaxXP
      });
    }
  };
  
  const deleteItem = async (id: string) => {
    const filteredItems = items.filter(item => item.id !== id) as StatusItem[];
    setItems(filteredItems);
    await updateStatusItems(filteredItems);
    
    toast({
      title: t("success"),
      description: t("itemDeleted"),
    });
  };
  
  const openAddModal = (type: "course" | "language" | "skill") => {
    setModalType(type);
    setModalOpen(true);
  };
  
  const addNewItem = async (item: StatusItem) => {
    const newItems = [...items, item] as StatusItem[];
    setItems(newItems);
    await updateStatusItems(newItems);
    
    // Award XP for adding new item
    const xpReward = 10;
    const currentXP = userData.statusModule.statusXP || 0;
    const currentLevel = userData.statusModule.statusLevel || 1;
    const maxXP = userData.statusModule.maxXP || 100;
    
    let newXP = currentXP + xpReward;
    let newLevel = currentLevel;
    let newMaxXP = maxXP;
    
    // Level up if threshold reached
    if (newXP >= maxXP) {
      newLevel += 1;
      newXP = newXP - maxXP;
      newMaxXP = Math.floor(maxXP * 1.5);
      
      toast({
        title: "Niveau supérieur!",
        description: `Vous avez atteint le niveau ${newLevel} en formation!`,
        variant: "default",
      });
    } else {
      toast({
        title: "XP gagnés!",
        description: `${item.title} ajouté! +${xpReward} XP`,
        variant: "default",
      });
    }
    
    await updateStatusModule({
      statusXP: newXP,
      statusLevel: newLevel,
      maxXP: newMaxXP
    });
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-pixel text-2xl mb-2">{t("statusTitle")}</h1>
        <p className="text-muted-foreground">{t("statusSubtitle")}</p>
      </div>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Award size={20} className="text-zou-purple" />
            <h2 className="font-pixel text-lg">Votre progression</h2>
          </div>
          <StatusAdviceDialog statusItems={items} />
        </div>
        
        <StatusLevel />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="glass-card p-4">
            <div className="flex items-center mb-4">
              <GraduationCap size={18} className="text-zou-purple mr-2" />
              <h2 className="font-pixel text-base">{t("courses")}</h2>
            </div>
            
            <div className="space-y-4">
              {items.filter(c => c.type === "course").map(course => (
                <StatusCard 
                  key={course.id}
                  item={course}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                />
              ))}
            </div>
            
            <button 
              className="w-full mt-4 pixel-button flex items-center justify-center"
              onClick={() => openAddModal("course")}
            >
              <Plus size={14} className="mr-1" />
              {t("addCourse")}
            </button>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center mb-4">
              <Globe size={18} className="text-zou-purple mr-2" />
              <h2 className="font-pixel text-base">{t("languages")}</h2>
            </div>
            
            <div className="space-y-4">
              {items.filter(c => c.type === "language").map(course => (
                <StatusCard 
                  key={course.id}
                  item={course}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                />
              ))}
            </div>
            
            <button 
              className="w-full mt-4 pixel-button flex items-center justify-center"
              onClick={() => openAddModal("language")}
            >
              <Plus size={14} className="mr-1" />
              {t("addLanguage")}
            </button>
          </div>
          
          <div className="glass-card p-4">
            <div className="flex items-center mb-4">
              <Brain size={18} className="text-zou-purple mr-2" />
              <h2 className="font-pixel text-base">{t("skills")}</h2>
            </div>
            
            <div className="space-y-4">
              {items.filter(c => c.type === "skill").map(course => (
                <StatusCard 
                  key={course.id}
                  item={course}
                  onUpdate={updateItem}
                  onDelete={deleteItem}
                />
              ))}
            </div>
            
            <button 
              className="w-full mt-4 pixel-button flex items-center justify-center"
              onClick={() => openAddModal("skill")}
            >
              <Plus size={14} className="mr-1" />
              {t("addSkill")}
            </button>
          </div>
        </div>
        
        <StatusAchievements />
      </div>
      
      <AddItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addNewItem}
        type={modalType}
      />
    </MainLayout>
  );
};

export default Status;
