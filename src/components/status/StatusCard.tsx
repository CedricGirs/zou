
import { useState } from "react";
import { CheckCircle, X, Upload, Clock, Trash2, ArrowUp } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "@/hooks/use-toast";

interface CourseItem {
  id: string;
  title: string;
  type: "course" | "language" | "skill";
  progress: number;
  level?: string;
  deadline?: string;
  completed: boolean;
  certificate?: string;
}

interface StatusCardProps {
  item: CourseItem;
  onUpdate: (id: string, updates: Partial<CourseItem>) => void;
  onDelete: (id: string) => void;
}

// Language level definitions
const languageLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const levelToProgress = {
  "A1": 17,
  "A2": 33,
  "B1": 50,
  "B2": 67,
  "C1": 83,
  "C2": 100
};

const StatusCard = ({ item, onUpdate, onDelete }: StatusCardProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showUpload, setShowUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const handleProgressChange = (newProgress: number) => {
    onUpdate(item.id, { progress: newProgress });
    
    // Mark as completed if progress is 100%
    if (newProgress === 100) {
      onUpdate(item.id, { completed: true });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (file) {
      // In a real app, you would upload the file to a server
      onUpdate(item.id, { 
        certificate: URL.createObjectURL(file),
        completed: true,
        progress: 100
      });
      setShowUpload(false);
      setFile(null);
    }
  };

  const handleDelete = () => {
    if (confirm(t('deleteConfirm'))) {
      onDelete(item.id);
    }
  };

  // Function to increment language level
  const incrementLanguageLevel = () => {
    if (item.type === "language" && item.level) {
      const currentLevelIndex = languageLevels.indexOf(item.level);
      if (currentLevelIndex < languageLevels.length - 1) {
        const newLevel = languageLevels[currentLevelIndex + 1];
        const newProgress = levelToProgress[newLevel as keyof typeof levelToProgress];
        
        onUpdate(item.id, { 
          level: newLevel,
          progress: newProgress,
          completed: newLevel === "C2"
        });
        
        toast({
          title: t("success"),
          description: `${t("levelUpgraded")} ${item.level} → ${newLevel}`,
        });
      }
    }
  };
  
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
      
      {item.type === "language" && item.level && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <span className="text-xs font-medium mr-2">{t("level")}:</span>
              <div className="bg-zou-purple text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold">
                {item.level}
              </div>
            </div>
            {item.level !== "C2" && (
              <button 
                onClick={incrementLanguageLevel}
                className="text-zou-purple hover:bg-zou-purple/10 p-1 rounded-full transition-colors"
                title={t('upgradeLevel')}
              >
                <ArrowUp size={16} />
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span>{t("progress")}</span>
          <span>{item.progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-bar-fill bg-zou-purple"
            style={{ width: `${item.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex justify-between space-x-2">
        <div className="flex-1">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={item.progress} 
            onChange={(e) => handleProgressChange(Number(e.target.value))}
            className="w-full h-2 accent-zou-purple cursor-pointer"
            disabled={item.type === "language"}
          />
        </div>
        
        {!showUpload ? (
          <button 
            className="pixel-button text-[10px] py-1 flex items-center"
            onClick={() => setShowUpload(true)}
          >
            <Upload size={12} className="mr-1" />
            {t("cert")}
          </button>
        ) : (
          <button 
            className="text-[10px] text-red-500"
            onClick={() => setShowUpload(false)}
          >
            <X size={16} />
          </button>
        )}
      </div>
      
      {showUpload && (
        <div className="mt-3 bg-muted p-2 rounded-md animate-appear-from-bottom">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium">{t("uploadCertificate")}</span>
          </div>
          <input 
            type="file" 
            accept=".pdf,.jpg,.jpeg,.png" 
            onChange={handleFileChange}
            className="text-xs w-full mb-2"
          />
          <button 
            className="pixel-button w-full text-[10px] py-1"
            onClick={handleUpload}
            disabled={!file}
          >
            {t("upload")}
          </button>
        </div>
      )}
      
      {item.certificate && (
        <div className="mt-3 flex items-center text-xs">
          <CheckCircle size={12} className="text-green-500 mr-1" />
          <span>{t("certificate")}</span>
        </div>
      )}
    </div>
  );
};

export default StatusCard;
