
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/UserDataContext";
import { useLanguage } from "@/context/LanguageContext";
import Avatar from "@/components/dashboard/Avatar";
import XPBar from "@/components/dashboard/XPBar";
import LifeGauges from "@/components/dashboard/LifeGauges";
import ModulesXPOverview from "@/components/dashboard/ModulesXPOverview";
import { Castle, ChevronRight } from "lucide-react";

const Index = () => {
  const { userData, loading } = useUserData();
  const { t } = useLanguage();
  const [heroName, setHeroName] = useState("");

  useEffect(() => {
    if (!loading) {
      setHeroName(userData.heroProfile.name);
    }
  }, [userData.heroProfile.name, loading]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-pulse text-xl">Chargement...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-pixel mb-2">
            {t("home")}
          </h1>
          <p className="text-muted-foreground">
            Bienvenue {heroName} !
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="pixel-card bg-gradient-to-br from-white to-gray-50 p-6">
              <Avatar 
                seed={userData.heroProfile.name} 
                showLevel={true}
                level={userData.heroProfile.level}
                bgColor={userData.heroProfile.avatarBgColor}
                color={userData.heroProfile.avatarColor}
              />
              <div className="mt-4">
                <XPBar 
                  currentXP={userData.heroProfile.heroXP} 
                  maxXP={userData.heroProfile.maxXP} 
                />
              </div>
            </div>

            <LifeGauges compact={false} />

            {/* Kingdom Card */}
            <div className="pixel-card bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Castle className="text-amber-700" size={24} />
                  <div>
                    <h2 className="font-pixel text-lg text-amber-900">Mon Royaume</h2>
                    <p className="text-sm text-amber-700">
                      {userData.heroProfile.kingdom ? 
                        `Niveau ${userData.heroProfile.kingdom.level} - ${userData.heroProfile.kingdom.elements.length} constructions` :
                        "Construisez votre empire!"
                      }
                    </p>
                  </div>
                </div>
                <Link to="/kingdom">
                  <Button 
                    className="flex items-center gap-1" 
                    size="sm"
                    variant="sound"
                  >
                    Accéder <ChevronRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <ModulesXPOverview />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
