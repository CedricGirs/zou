
import MainLayout from "../components/layout/MainLayout";
import { Plus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Look = () => {
  const { t } = useLanguage();
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-pixel text-2xl mb-2">{t("lookTitle")}</h1>
        <p className="text-muted-foreground">{t("lookSubtitle")}</p>
      </div>
      
      <div className="glass-card p-4">
        <button className="pixel-button flex items-center">
          <Plus size={16} className="mr-2" />
          {t("addClothingItem")}
        </button>
        <div className="mt-4">
          <p className="text-muted-foreground">{t("lookModuleComing")}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Look;
