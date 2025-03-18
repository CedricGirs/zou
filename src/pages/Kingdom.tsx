
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useKingdom } from '@/hooks/useKingdom';
import { KingdomAsset } from '@/types/KingdomTypes';
import MainLayout from '@/components/layout/MainLayout';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import KingdomHeader from '@/components/kingdom/KingdomHeader';
import KingdomToolbar from '@/components/kingdom/KingdomToolbar';
import AssetPalette from '@/components/kingdom/AssetPalette';
import KingdomCanvas from '@/components/kingdom/KingdomCanvas';

const Kingdom = () => {
  const { t } = useTranslation();
  const kingdom = useKingdom();
  const [selectedAsset, setSelectedAsset] = useState<KingdomAsset | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  
  const totalObjects = kingdom.buildings.length + kingdom.decorations.length + kingdom.roads.length;
  
  const handleSelectAsset = (asset: KingdomAsset) => {
    setSelectedAsset(asset);
  };
  
  const handleClearConfirm = () => {
    kingdom.clearKingdom();
    setShowClearConfirm(false);
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <KingdomHeader
          level={kingdom.level}
          experience={kingdom.experience}
          maxExperience={kingdom.maxExperience}
          objectsPlaced={totalObjects}
          lastSaved={kingdom.lastSaved}
        />
        
        <KingdomToolbar
          onSave={kingdom.saveKingdom}
          onClear={() => setShowClearConfirm(true)}
          onChangeStyle={kingdom.changeStyle}
          currentStyle={kingdom.style}
          autosaveEnabled={kingdom.autosaveEnabled}
          setAutosaveEnabled={kingdom.setAutosaveEnabled}
          unsavedChanges={kingdom.unsavedChanges}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <AssetPalette onSelectAsset={handleSelectAsset} />
          </div>
          
          <div className="md:col-span-3">
            <KingdomCanvas
              buildings={kingdom.buildings}
              decorations={kingdom.decorations}
              roads={kingdom.roads}
              onAddBuilding={kingdom.addBuilding}
              onAddDecoration={kingdom.addDecoration}
              onAddRoad={kingdom.addRoad}
              selectedAsset={selectedAsset}
              style={kingdom.style}
            />
          </div>
        </div>
      </div>
      
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('clearCanvas')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmClear')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearConfirm}>{t('clearCanvas')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Kingdom;
