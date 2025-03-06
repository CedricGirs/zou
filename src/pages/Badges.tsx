
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import CustomBadge from "../components/ui/CustomBadge";
import { Award, Filter, Search, BookOpen, Shirt, DollarSign, Gamepad, Calendar, Trophy, Coffee, Users, Code, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "../types/badge";
import { badgeData } from "../data/badgeData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Badges = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Load badges from the data file
  useEffect(() => {
    setBadges(badgeData);
  }, []);

  const filteredBadges = badges.filter(badge => {
    const matchesFilter = filter === "all" || badge.category === filter;
    const matchesSearch = badge.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         badge.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group badges by category for the tab view
  const getBadgesByCategory = (category: string) => {
    return badges.filter(badge => badge.category === category);
  };
  
  const categories = [
    { id: "status", label: t("status"), icon: <BookOpen size={16} /> },
    { id: "look", label: t("look"), icon: <Shirt size={16} /> },
    { id: "finances", label: t("finances"), icon: <DollarSign size={16} /> },
    { id: "gamification", label: t("gamification"), icon: <Gamepad size={16} /> },
    { id: "daily", label: t("dailyQuests"), icon: <Calendar size={16} /> },
    { id: "special", label: t("specialRewards"), icon: <Trophy size={16} /> },
    { id: "humor", label: t("humor"), icon: <Coffee size={16} /> },
    { id: "social", label: t("social"), icon: <Users size={16} /> },
    { id: "technical", label: t("technical"), icon: <Code size={16} /> },
    { id: "events", label: t("events"), icon: <Sparkles size={16} /> }
  ];

  const showBadgeDetails = (badge: Badge) => {
    if (badge.unlocked) {
      const unlockedDate = badge.unlockedDate ? 
        `\n${t("unlockedOn")}: ${new Date(badge.unlockedDate).toLocaleDateString()}` : '';
      
      toast({
        title: badge.name,
        description: `${badge.description}${unlockedDate}`,
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
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {searchTerm || filter !== "all" ? (
            // Search/filter results view
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
          ) : (
            // Tabbed view for normal browsing
            <Tabs defaultValue="status" className="w-full">
              <TabsList className="grid grid-cols-5 mb-6 sm:grid-cols-10">
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                    {category.icon}
                    <span className="hidden sm:inline">{category.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getBadgesByCategory(category.id).length > 0 ? (
                      getBadgesByCategory(category.id).map(badge => (
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
                        <p>{t("noBadgesInCategory")}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Badges;
