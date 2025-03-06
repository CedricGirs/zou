
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { useOnboarding } from "../context/OnboardingContext";
import { useLanguage } from "../context/LanguageContext";
import Avatar from "../components/dashboard/Avatar";
import { Button } from "../components/ui/button";
import { ArrowRight, Edit, Settings } from "lucide-react";

const Profile = () => {
  const { onboarding } = useOnboarding();
  const { t } = useLanguage();
  
  const { heroProfile, statusModule, lookModule, financeModule } = onboarding;
  
  return (
    <MainLayout>
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-pixel mb-2">{t("profileTitle")}</h1>
        <p className="text-muted-foreground">{t("profileDescription")}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-1">
          <div className="glass-card p-6">
            <div className="flex flex-col items-center">
              <Avatar size="lg" seed={heroProfile.avatarSeed} showLevel level={1} />
              <h2 className="mt-4 mb-1 text-xl">{heroProfile.username}</h2>
              <p className="text-sm text-muted-foreground">{t("level")} 1</p>
              
              <Link to="/onboarding" className="mt-4">
                <Button className="flex items-center gap-2">
                  <Edit size={16} />
                  {t("editProfile")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-pixel text-lg">{t("heroProfile")}</h2>
              <Link to="/onboarding" className="text-zou-purple hover:underline text-sm flex items-center">
                {t("edit")} <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("class")}</p>
                <p>{t(heroProfile.class)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("ambitionLevel")}</p>
                <p>{t(heroProfile.ambitionLevel)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("primaryFocus")}</p>
                <p>{t(heroProfile.primaryFocus)}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-pixel text-lg">{t("statusModule")}</h2>
              <Link to="/onboarding?step=2" className="text-zou-purple hover:underline text-sm flex items-center">
                {t("edit")} <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">{t("currentStatus")}</p>
              <p>{t(statusModule.status)}</p>
              
              {statusModule.languages.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{t("languages")}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {statusModule.languages.map((lang, i) => (
                      <span key={i} className="pixel-card p-1 px-2 text-xs">
                        {lang.name} ({lang.level})
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {statusModule.softSkills.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{t("softSkills")}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {statusModule.softSkills.map((skill, i) => (
                      <span key={i} className="pixel-card p-1 px-2 text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-pixel text-lg">{t("settings")}</h2>
              <Settings size={16} className="text-muted-foreground" />
            </div>
            
            <div className="space-y-4">
              <Link to="/onboarding" className="block">
                <Button className="w-full justify-between">
                  {t("restartOnboarding")}
                  <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
