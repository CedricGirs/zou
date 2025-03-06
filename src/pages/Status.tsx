
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import StatusCard from "../components/status/StatusCard";
import AddItemModal from "../components/status/AddItemModal";
import { GraduationCap, Globe, Brain, Plus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useUserData } from "@/context/UserDataContext";
import { StatusItem } from "@/context/UserDataContext";

const Status = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { userData, updateStatusItems } = useUserData();
  
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
    
    toast({
      title: t("success"),
      description: `${item.title} ${t("added")}`,
    });
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-pixel text-2xl mb-2">{t("statusTitle")}</h1>
        <p className="text-muted-foreground">{t("statusSubtitle")}</p>
      </div>
      
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
