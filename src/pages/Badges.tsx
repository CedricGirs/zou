
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import CustomBadge from "../components/ui/CustomBadge";
import { Award, Filter, Search } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface Badge {
  id: string;
  icon: JSX.Element;
  name: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  unlocked: boolean;
  unlockedDate?: string;
  category: string;
}

const Badges = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Mock badges data - in a real app, this would come from your backend or localStorage
  useEffect(() => {
    const mockBadges: Badge[] = [
      { 
        id: "book-worm", 
        icon: <Book size={16} />, 
        name: "Book Worm", 
        description: "Read 5 books in a month", 
        rarity: "uncommon", 
        unlocked: true, 
        unlockedDate: "2023-05-15T14:30:00Z",
        category: "status"
      },
      { 
        id: "polyglot", 
        icon: <Globe size={16} />, 
        name: "Polyglot", 
        description: "Reach B2 level in 2 languages", 
        rarity: "rare", 
        unlocked: true,
        unlockedDate: "2023-06-01T09:15:00Z",
        category: "status"
      },
      { 
        id: "gym-rat", 
        icon: <Dumbbell size={16} />, 
        name: "Gym Rat", 
        description: "Work out 20 times in a month", 
        rarity: "uncommon", 
        unlocked: false,
        category: "look"
      },
      { 
        id: "fashionista", 
        icon: <Shirt size={16} />, 
        name: "Fashionista", 
        description: "Create 50 unique outfit combinations", 
        rarity: "rare", 
        unlocked: false,
        category: "look"
      },
      { 
        id: "investor", 
        icon: <DollarSign size={16} />, 
        name: "Investor", 
        description: "Diversify in 3 different assets", 
        rarity: "rare", 
        unlocked: true,
        unlockedDate: "2023-04-10T16:45:00Z",
        category: "finances"
      },
      { 
        id: "budget-master", 
        icon: <Calculator size={16} />, 
        name: "Budget Master", 
        description: "6 months without exceeding your budget", 
        rarity: "epic", 
        unlocked: false,
        category: "finances"
      },
      { 
        id: "pomodoro-master", 
        icon: <Clock size={16} />, 
        name: "Pomodoro Master", 
        description: "Complete 100 Pomodoro sessions", 
        rarity: "uncommon", 
        unlocked: true,
        unlockedDate: "2023-03-22T11:20:00Z",
        category: "skills"
      },
      { 
        id: "legend", 
        icon: <Crown size={16} />, 
        name: "Legend", 
        description: "Reach level 99", 
        rarity: "legendary", 
        unlocked: false,
        category: "special"
      }
    ];
    
    setBadges(mockBadges);
  }, []);

  const filteredBadges = badges.filter(badge => {
    const matchesFilter = filter === "all" || badge.category === filter;
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         badge.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const showBadgeDetails = (badge: Badge) => {
    if (badge.unlocked) {
      toast({
        title: badge.name,
        description: `${badge.description}${badge.unlockedDate ? `\nUnlocked on: ${new Date(badge.unlockedDate).toLocaleDateString()}` : ''}`,
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
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center">
              <Award size={24} className="text-zou-purple mr-2" />
              <h1 className="text-2xl font-pixel">{t("badges")}</h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("searchBadges")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pixel-input pl-9 w-full sm:w-48"
                />
              </div>
              
              <div className="flex items-center space-x-1">
                <Filter size={16} className="text-muted-foreground" />
                <select 
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pixel-input"
                >
                  <option value="all">{t("allCategories")}</option>
                  <option value="status">{t("status")}</option>
                  <option value="look">{t("look")}</option>
                  <option value="finances">{t("finances")}</option>
                  <option value="skills">{t("skills")}</option>
                  <option value="special">{t("special")}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBadges.length > 0 ? (
              filteredBadges.map(badge => (
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
              <div className="col-span-full text-center py-10 text-muted-foreground">
                <Award size={40} className="mx-auto mb-2 opacity-50" />
                <p>{t("noBadgesFound")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Badges;

// Import necessary icons
import { Book, Globe, Dumbbell, Shirt, DollarSign, Calculator, Clock, Crown } from "lucide-react";
