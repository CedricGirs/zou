
import { CheckCircle } from "lucide-react";
import { StatusItem } from "@/types/StatusTypes";
import CardHeader from "./card/CardHeader";
import LanguageLevel from "./card/LanguageLevel";
import ProgressSection from "./card/ProgressSection";
import CertificateUpload from "./card/CertificateUpload";

interface StatusCardProps {
  item: StatusItem;
  onUpdate: (id: string, updates: Partial<StatusItem>) => void;
  onDelete: (id: string) => void;
}

const StatusCard = ({ item, onUpdate, onDelete }: StatusCardProps) => {
  return (
    <div className={`
      pixel-card relative overflow-hidden
      ${item.completed ? 'border-green-500' : ''}
      ${item.deadline && new Date(item.deadline) < new Date() ? 'border-red-500' : ''}
    `}>
      {item.completed && (
        <div className="absolute top-0 right-0 bg-green-500 text-white p-1">
          <CheckCircle size={16} />
        </div>
      )}
      
      <CardHeader item={item} onDelete={onDelete} />
      
      {item.type === "language" && item.level && (
        <LanguageLevel item={item} onUpdate={onUpdate} />
      )}
      
      <ProgressSection item={item} onUpdate={onUpdate} />
      
      <div className="flex justify-end">
        <CertificateUpload item={item} onUpdate={onUpdate} />
      </div>
    </div>
  );
};

export default StatusCard;
