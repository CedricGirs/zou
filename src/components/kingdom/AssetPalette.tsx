
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KingdomAsset } from '@/types/KingdomTypes';
import { kingdomAssets } from '@/data/kingdomAssets';

interface AssetPaletteProps {
  onSelectAsset: (asset: KingdomAsset) => void;
}

const AssetPalette = ({ onSelectAsset }: AssetPaletteProps) => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<'building' | 'decoration' | 'road'>('building');
  
  const buildings = kingdomAssets.filter(asset => asset.category === 'building');
  const decorations = kingdomAssets.filter(asset => asset.category === 'decoration');
  const roads = kingdomAssets.filter(asset => asset.category === 'road');
  
  return (
    <div className="border rounded-lg p-4 bg-background">
      <h3 className="font-medium mb-4">Asset Library</h3>
      
      <Tabs defaultValue="building" onValueChange={(value) => setActiveCategory(value as any)}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="building">{t('addBuilding')}</TabsTrigger>
          <TabsTrigger value="decoration">{t('addDecoration')}</TabsTrigger>
          <TabsTrigger value="road">{t('addRoad')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="building" className="space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {buildings.map(asset => (
              <Button
                key={asset.id}
                variant="outline"
                className="h-auto flex-col py-2 px-2"
                onClick={() => onSelectAsset(asset)}
              >
                <div className="h-12 w-12 bg-muted mb-1 rounded-sm flex items-center justify-center">
                  <img 
                    src={asset.image} 
                    alt={asset.name} 
                    className="max-h-10 max-w-10 object-contain"
                  />
                </div>
                <span className="text-xs">{t(asset.type as any)}</span>
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="decoration" className="space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {decorations.map(asset => (
              <Button
                key={asset.id}
                variant="outline"
                className="h-auto flex-col py-2 px-2"
                onClick={() => onSelectAsset(asset)}
              >
                <div className="h-12 w-12 bg-muted mb-1 rounded-sm flex items-center justify-center">
                  <img 
                    src={asset.image} 
                    alt={asset.name} 
                    className="max-h-10 max-w-10 object-contain"
                  />
                </div>
                <span className="text-xs">{t(asset.type as any)}</span>
              </Button>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="road" className="space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {roads.map(asset => (
              <Button
                key={asset.id}
                variant="outline"
                className="h-auto flex-col py-2 px-2"
                onClick={() => onSelectAsset(asset)}
              >
                <div className="h-12 w-12 bg-muted mb-1 rounded-sm flex items-center justify-center">
                  <img 
                    src={asset.image} 
                    alt={asset.name} 
                    className="max-h-10 max-w-10 object-contain"
                  />
                </div>
                <span className="text-xs">{t(asset.type as any)}</span>
              </Button>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetPalette;
