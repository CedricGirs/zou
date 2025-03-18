
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/hooks/useTranslation';
import { KingdomBuildingPurpose } from '@/types/KingdomTypes';

interface NameBuildingDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string, purpose: KingdomBuildingPurpose) => void;
  defaultName: string;
}

const NameBuildingDialog = ({
  open,
  onClose,
  onConfirm,
  defaultName
}: NameBuildingDialogProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState(defaultName);
  const [purpose, setPurpose] = useState<KingdomBuildingPurpose>('savingGoal');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError(t('buildingNameRequired'));
      return;
    }
    
    onConfirm(name, purpose);
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('nameBuilding')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="building-name">{t('title')}</Label>
            <Input
              id="building-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder={t('enterBuildingName')}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>{t('buildingPurpose')}</Label>
            <RadioGroup value={purpose} onValueChange={(val) => setPurpose(val as KingdomBuildingPurpose)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="saving-goal" value="savingGoal" />
                <Label htmlFor="saving-goal">{t('savingGoal')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="achievement" value="achievement" />
                <Label htmlFor="achievement">{t('achievement')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="milestone" value="milestone" />
                <Label htmlFor="milestone">{t('milestone')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="contact" value="contact" />
                <Label htmlFor="contact">{t('contact')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="other" value="other" />
                <Label htmlFor="other">{t('other')}</Label>
              </div>
            </RadioGroup>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit">{t('save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NameBuildingDialog;
