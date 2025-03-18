
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Save, Trash2, Paintbrush } from 'lucide-react';
import { KingdomStyle } from '@/types/KingdomTypes';

interface KingdomToolbarProps {
  onSave: () => Promise<boolean>;
  onClear: () => void;
  onChangeStyle: (style: KingdomStyle) => void;
  currentStyle: KingdomStyle;
  autosaveEnabled: boolean;
  setAutosaveEnabled: (enabled: boolean) => void;
  unsavedChanges: boolean;
}

const KingdomToolbar = ({
  onSave,
  onClear,
  onChangeStyle,
  currentStyle,
  autosaveEnabled,
  setAutosaveEnabled,
  unsavedChanges
}: KingdomToolbarProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button onClick={onSave} variant="default" disabled={!unsavedChanges}>
        <Save className="mr-2 h-4 w-4" />
        {t('saveKingdom')}
      </Button>
      
      <div className="flex items-center space-x-2 ml-2">
        <Switch
          id="autosave"
          checked={autosaveEnabled}
          onCheckedChange={setAutosaveEnabled}
        />
        <Label htmlFor="autosave">{t('autosaveEnabled')}</Label>
      </div>
      
      <div className="flex-grow"></div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Paintbrush className="mr-2 h-4 w-4" />
            {t('changeStyle')}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onChangeStyle('medieval')}>
            {t('medieval')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStyle('roman')}>
            {t('roman')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onChangeStyle('fantasy')}>
            {t('fantasy')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button onClick={onClear} variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        {t('clearCanvas')}
      </Button>
    </div>
  );
};

export default KingdomToolbar;
