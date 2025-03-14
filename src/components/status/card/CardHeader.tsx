
import { Clock, Trash2 } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { StatusItem } from "@/types/StatusTypes";

interface CardHeaderProps {
  item: StatusItem;
  onDelete: (id: string) => void;
}

const CardHeader = ({ item, onDelete }: CardHeaderProps) => {
  const { t } = useLanguage();
  
  const handleDelete = () => {
    if (confirm(t('deleteConfirm'))) {
      onDelete(item.id);
    }
  };
  
  return (
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-pixel text-sm">{item.title}</h3>
      <div className="flex space-x-1">
        {item.deadline && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock size={12} className="mr-1" />
            {new Date(item.deadline).toLocaleDateString()}
          </div>
        )}
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 transition-colors"
          title={t('delete')}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default CardHeader;
