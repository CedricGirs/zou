
import { Sword, Shield, Wand } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

interface BranchSelectorProps {
  activeBranch: "all" | "weapons" | "defense" | "magic";
  setActiveBranch: (branch: "all" | "weapons" | "defense" | "magic") => void;
}

const BranchSelector = ({ activeBranch, setActiveBranch }: BranchSelectorProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-around mb-4">
      <button
        className={`flex items-center ${activeBranch === "all" ? "bg-muted px-3 py-1 rounded-md" : ""}`}
        onClick={() => setActiveBranch("all")}
      >
        <span className="text-sm font-medium">{t("allSkills")}</span>
      </button>
      <button
        className={`flex items-center ${activeBranch === "weapons" ? "bg-red-100 dark:bg-red-900/20 px-3 py-1 rounded-md" : ""}`}
        onClick={() => setActiveBranch("weapons")}
      >
        <Sword size={16} className="text-red-500 mr-1" />
        <span className="text-sm font-medium">{t("weapons")}</span>
      </button>
      <button
        className={`flex items-center ${activeBranch === "defense" ? "bg-blue-100 dark:bg-blue-900/20 px-3 py-1 rounded-md" : ""}`}
        onClick={() => setActiveBranch("defense")}
      >
        <Shield size={16} className="text-blue-500 mr-1" />
        <span className="text-sm font-medium">{t("defense")}</span>
      </button>
      <button
        className={`flex items-center ${activeBranch === "magic" ? "bg-purple-100 dark:bg-purple-900/20 px-3 py-1 rounded-md" : ""}`}
        onClick={() => setActiveBranch("magic")}
      >
        <Wand size={16} className="text-purple-500 mr-1" />
        <span className="text-sm font-medium">{t("magic")}</span>
      </button>
    </div>
  );
};

export default BranchSelector;
