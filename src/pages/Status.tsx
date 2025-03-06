
import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import StatusCard from "../components/status/StatusCard";
import { GraduationCap, Globe, Brain, Plus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Status = () => {
  const { t } = useLanguage();
  
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
  
  const updateCourse = (id: string, updates: any) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ));
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
              />
            ))}
          </div>
          
          <button className="w-full mt-4 pixel-button flex items-center justify-center">
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
              />
            ))}
          </div>
          
          <button className="w-full mt-4 pixel-button flex items-center justify-center">
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
              />
            ))}
          </div>
          
          <button className="w-full mt-4 pixel-button flex items-center justify-center">
            <Plus size={14} className="mr-1" />
            {t("addSkill")}
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Status;
