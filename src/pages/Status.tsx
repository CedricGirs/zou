
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import StatusCard from "../components/status/StatusCard";
import AddItemModal from "../components/status/AddItemModal";
import { GraduationCap, Globe, Brain, Plus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useUserData } from "../context/UserDataContext";
import { useToast } from "@/hooks/use-toast";

const Status = () => {
  const { t } = useLanguage();
  const { userData, updateStatusModule } = useUserData();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState([
    {
      id: "cs101",
      title: "Computer Science 101",
      type: "course" as const,
      progress: 75,
      deadline: "2023-12-31",
      completed: false
    },
    {
      id: "french",
      title: "French",
      type: "language" as const,
      level: "B1",
      progress: 40,
      completed: false
    },
    {
      id: "spanish",
      title: "Spanish",
      type: "language" as const,
      level: "A2",
      progress: 20,
      completed: false
    },
    {
      id: "public-speaking",
      title: "Public Speaking",
      type: "skill" as const,
      progress: 90,
      completed: true,
      certificate: "certificate.pdf"
    }
  ]);
  
  // Load data from userData if available
  useEffect(() => {
    // If we have any skills or languages in userData, add them to courses
    const userItems = [];
    
    // Add skills from userData
    if (userData.statusModule.skills?.length > 0) {
      userData.statusModule.skills.forEach((skill, index) => {
        userItems.push({
          id: `skill-${index}`,
          title: skill,
          type: "skill" as const,
          progress: 10,
          completed: false
        });
      });
    }
    
    // Add languages from userData
    if (userData.statusModule.languages?.length > 0) {
      userData.statusModule.languages.forEach((lang) => {
        userItems.push({
          id: `lang-${lang.name}`,
          title: lang.name,
          type: "language" as const,
          level: lang.level,
          progress: 10,
          completed: false
        });
      });
    }
    
    // Add education from userData
    if (userData.statusModule.education?.length > 0) {
      userData.statusModule.education.forEach((edu, index) => {
        userItems.push({
          id: `edu-${index}`,
          title: edu,
          type: "course" as const,
          progress: 10,
          deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
          completed: false
        });
      });
    }
    
    if (userItems.length > 0) {
      // Combine with existing courses, avoiding duplicates by title
      const existingTitles = courses.map(c => c.title.toLowerCase());
      const newItems = userItems.filter(item => !existingTitles.includes(item.title.toLowerCase()));
      
      if (newItems.length > 0) {
        setCourses(prevCourses => [...prevCourses, ...newItems]);
      }
    }
  }, [userData.statusModule]);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"course" | "language" | "skill">("course");
  
  const updateCourse = (id: string, updates: any) => {
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
  
  const addNewItem = (item: any) => {
    setCourses([...courses, item]);
    
    // Update user data when adding new items
    if (item.type === "skill") {
      updateStatusModule({
        skills: [...(userData.statusModule.skills || []), item.title]
      });
    } else if (item.type === "language") {
      updateStatusModule({
        languages: [...(userData.statusModule.languages || []), { name: item.title, level: item.level || "A1" }]
      });
    } else if (item.type === "course") {
      updateStatusModule({
        education: [...(userData.statusModule.education || []), item.title]
      });
    }
    
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
