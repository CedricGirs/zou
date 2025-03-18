
import { useTranslation } from '@/hooks/useTranslation';
import { Progress } from '@/components/ui/progress';

interface KingdomHeaderProps {
  level: number;
  experience: number;
  maxExperience: number;
  objectsPlaced: number;
  lastSaved: string;
}

const KingdomHeader = ({
  level,
  experience,
  maxExperience,
  objectsPlaced,
  lastSaved
}: KingdomHeaderProps) => {
  const { t } = useTranslation();
  
  const formattedDate = new Date(lastSaved).toLocaleString();
  const progressPercentage = Math.min(Math.round((experience / maxExperience) * 100), 100);
  
  return (
    <div className="space-y-2 mb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('kingdomTitle')}</h1>
          <p className="text-muted-foreground">{t('kingdomSubtitle')}</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <span className="text-sm text-muted-foreground">
            {t('lastSaved')}: {formattedDate}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mt-4 p-4 bg-background rounded-lg border">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">{t('kingdomLevel')}: {level}</span>
            <span className="text-sm">{experience}/{maxExperience} XP</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="border-l pl-4 hidden md:block">
          <div className="text-sm">
            <span className="font-medium">{t('objectsPlaced')}:</span> {objectsPlaced}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KingdomHeader;
