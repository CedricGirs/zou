
import { Sword, Shield, Wand, Grid3X3 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface BranchSelectorProps {
  activeBranch: "all" | "weapons" | "defense" | "magic";
  setActiveBranch: (branch: "all" | "weapons" | "defense" | "magic") => void;
}

const BranchSelector = ({ activeBranch, setActiveBranch }: BranchSelectorProps) => {
  const { t } = useLanguage();
  
  const branches = [
    { id: "all", icon: <Grid3X3 size={18} />, name: t("allSkills"), color: "bg-gray-200 dark:bg-gray-700" },
    { id: "weapons", icon: <Sword size={18} />, name: t("weapons"), color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" },
    { id: "defense", icon: <Shield size={18} />, name: t("defense"), color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" },
    { id: "magic", icon: <Wand size={18} />, name: t("magic"), color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" }
  ];
  
  return (
    <div className="flex gap-2 mb-4">
      {branches.map(branch => (
        <button
          key={branch.id}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
            transition-colors ${branch.color}
            ${activeBranch === branch.id ? 'ring-2 ring-offset-2 ring-offset-background' : ''}
          `}
          onClick={() => setActiveBranch(branch.id as any)}
        >
          {branch.icon}
          <span>{branch.name}</span>
        </button>
      ))}
    </div>
  );
};

export default BranchSelector;
