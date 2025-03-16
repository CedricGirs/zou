
import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Shield, Sun, Moon, Globe, Volume2, VolumeX } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useTranslation } from "../hooks/useTranslation";
import { useLanguage } from "../context/LanguageContext";

const Settings = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [privacySettings, setPrivacySettings] = useState({
    shareProgress: false,
    publicProfile: false,
    allowFriendRequests: true
  });

  const handleThemeChange = () => {
    setTheme(theme === "light" ? "dark" : "light");
    // Here you would actually change the theme in your theme provider
  };

  const handleLanguageChange = () => {
    setLanguage(language === "en" ? "fr" : "en");
  };

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">{t("settings")}</h1>
        
        <div className="grid gap-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun size={20} />
                {t("appearance")}
              </CardTitle>
              <CardDescription>{t("appearanceDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
                  <span>{t("darkMode")}</span>
                </div>
                <Switch 
                  checked={theme === "dark"}
                  onCheckedChange={handleThemeChange}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={20} />
                {t("language")}
              </CardTitle>
              <CardDescription>{t("languageDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>{language === "en" ? "English" : "Français"}</span>
                <Button 
                  variant="outline" 
                  onClick={handleLanguageChange}
                >
                  {language === "en" ? "Français" : "English"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Sound Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                {t("sound")}
              </CardTitle>
              <CardDescription>{t("soundDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span>{t("gameSounds")}</span>
                <Switch 
                  checked={soundEnabled}
                  onCheckedChange={() => setSoundEnabled(!soundEnabled)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} />
                {t("privacy")}
              </CardTitle>
              <CardDescription>{t("privacyDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>{t("shareProgress")}</span>
                <Switch 
                  checked={privacySettings.shareProgress}
                  onCheckedChange={(checked) => 
                    setPrivacySettings({...privacySettings, shareProgress: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>{t("publicProfile")}</span>
                <Switch 
                  checked={privacySettings.publicProfile}
                  onCheckedChange={(checked) => 
                    setPrivacySettings({...privacySettings, publicProfile: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span>{t("allowFriendRequests")}</span>
                <Switch 
                  checked={privacySettings.allowFriendRequests}
                  onCheckedChange={(checked) => 
                    setPrivacySettings({...privacySettings, allowFriendRequests: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Settings;
