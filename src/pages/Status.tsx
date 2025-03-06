
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import StatusCard from "../components/status/StatusCard";
import AddItemModal from "../components/status/AddItemModal";
import { GraduationCap, Globe, Brain, Plus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useSyncUserData } from "../hooks/useSyncUserData";
import { StatusItem, CourseItem, LanguageItem, SkillItem } from "../types/course";

const Status = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { statusModule, updateStatusModule } = useSyncUserData();
  
  const [courses, setCourses] = useState<StatusItem[]>([
    {
      id: "cs101",
      title: "Computer Science 101",
      type: "course",
      progress: 75,
      deadline: "2023-12-31",
      completed: false
    } as CourseItem,
    {
      id: "french",
      title: "French",
      type: "language",
      level: "B1",
      progress: 40,
      completed: false
    } as LanguageItem,
    {
      id: "spanish",
      title: "Spanish",
      type: "language",
      level: "A2",
      progress: 20,
      completed: false
    } as LanguageItem,
    {
      id: "public-speaking",
      title: "Public Speaking",
      type: "skill",
      progress: 90,
      completed: true,
      certificate: "certificate.pdf"
    } as SkillItem
  ]);
  
  useEffect(() => {
    if (statusModule && statusModule.languages && statusModule.languages.length > 0) {
      const existingLanguageIds = courses
        .filter(c => c.type === "language")
        .map(c => c.id);
      
      const newLanguageCourses: LanguageItem[] = statusModule.languages
        .filter(lang => !existingLanguageIds.includes(lang.name.toLowerCase()))
        .map(lang => ({
          id: lang.name.toLowerCase(),
          title: lang.name,
          type: "language",
          level: lang.level,
          progress: 20,
          completed: false
        }));
      
      if (newLanguageCourses.length > 0) {
        setCourses(prev => [...prev, ...newLanguageCourses]);
      }
    }
  }, [statusModule.languages]);
  
  useEffect(() => {
    if (statusModule && statusModule.softSkills && statusModule.softSkills.length > 0) {
      const existingSkillIds = courses
        .filter(c => c.type === "skill")
        .map(c => c.id);
      
      const newSkillCourses: SkillItem[] = statusModule.softSkills
        .filter(skill => !existingSkillIds.includes(skill.toLowerCase().replace(/\s+/g, '-')))
        .map(skill => ({
          id: skill.toLowerCase().replace(/\s+/g, '-'),
          title: skill,
          type: "skill",
          progress: 10,
          completed: false
        }));
      
      if (newSkillCourses.length > 0) {
        setCourses(prev => [...prev, ...newSkillCourses]);
      }
    }
  }, [statusModule.softSkills]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"course" | "language" | "skill">("course");
  
  const updateCourse = (id: string, updates: Partial<StatusItem>) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ));
  };
  
  const deleteItem = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
    toast({
      title: t("success"),
      description: t("itemDeleted"),
    });
  };
  
  const openAddModal = (type: "course" | "language" | "skill") => {
    setModalType(type);
    setModalOpen(true);
  };
  
  const addNewItem = (item: StatusItem) => {
    setCourses([...courses, item]);
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
        {statusModule.status && (
          <p className="mt-2 text-zou-purple font-pixel">
            {t("currentStatus")}: {t(statusModule.status)}
          </p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="glass-card p-4">
          <div className="flex items-center mb-4">
            <GraduationCap size={18} className="text-zou-purple mr-2" />
            <h2 className="font-pixel text-base">{t("courses")}</h2>
          </div>
          
          <div className="space-y-4">
            {courses.filter(c => c.type === "course").map(course => (
              <StatusCard 
                key={course.id}
                item={course}
                onUpdate={updateCourse}
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
            {courses.filter(c => c.type === "language").map(course => (
              <StatusCard 
                key={course.id}
                item={course}
                onUpdate={updateCourse}
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
            {courses.filter(c => c.type === "skill").map(course => (
              <StatusCard 
                key={course.id}
                item={course}
                onUpdate={updateCourse}
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
