import MainLayout from "../components/layout/MainLayout";
import SkillTree from "../components/skills/SkillTree";
import Badge from "../components/ui/badge";
import { BookOpen, Globe, Lightbulb, Heart, Code, Brain, Trophy, Dumbbell } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Skills = () => {
  const { t } = useLanguage();
  
  const badges = [
    { 
      id: "polyglot", 
      icon: <Globe size={16} />, 
      name: "Polyglot", 
      description: "Reach C1 proficiency in 3 languages", 
      rarity: "legendary", 
      unlocked: false 
    },
    { 
      id: "bookworm", 
      icon: <BookOpen size={16} />, 
      name: "Book Worm", 
      description: "Read 12 books in a year", 
      rarity: "rare", 
      unlocked: true 
    },
    { 
      id: "creative", 
      icon: <Lightbulb size={16} />, 
      name: "Creative Genius", 
      description: "Complete 5 creative projects", 
      rarity: "epic", 
      unlocked: false 
    },
    { 
      id: "mindful", 
      icon: <Heart size={16} />, 
      name: "Mindfulness Master", 
      description: "Meditate for 30 consecutive days", 
      rarity: "rare", 
      unlocked: true 
    },
    { 
      id: "coder", 
      icon: <Code size={16} />, 
      name: "Code Ninja", 
      description: "Complete 3 programming courses", 
      rarity: "epic", 
      unlocked: false 
    },
    { 
      id: "quiz", 
      icon: <Brain size={16} />, 
      name: "Quiz Champion", 
      description: "Score 90%+ on 10 knowledge quizzes", 
      rarity: "uncommon", 
      unlocked: true 
    },
    { 
      id: "fitness", 
      icon: <Dumbbell size={16} />, 
      name: "Fitness Freak", 
      description: "Work out 20 times in a month", 
      rarity: "rare", 
      unlocked: false 
    },
    { 
      id: "achiever", 
      icon: <Trophy size={16} />, 
      name: "Ultimate Achiever", 
      description: "Reach level 50 in Zou", 
      rarity: "legendary", 
      unlocked: false 
    }
  ];
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-pixel text-2xl mb-2">{t("skillsTitle")}</h1>
        <p className="text-muted-foreground">{t("skillsSubtitle")}</p>
      </div>
      
      <div className="glass-card p-4 mb-6">
        <h2 className="font-pixel text-lg mb-4">{t("skillTree")}</h2>
        <SkillTree />
      </div>
      
      <div className="glass-card p-4">
        <h2 className="font-pixel text-lg mb-4">{t("badgesAchievements")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {badges.map(badge => (
            <Badge 
              key={badge.id}
              icon={badge.icon}
              name={badge.name}
              description={badge.description}
              rarity={badge.rarity as any}
              unlocked={badge.unlocked}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Skills;
