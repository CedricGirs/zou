
import { useState, useRef, useEffect } from 'react';
import { KingdomAsset, KingdomBuilding, KingdomDecoration, KingdomRoad } from '@/types/KingdomTypes';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import NameBuildingDialog from './NameBuildingDialog';

interface KingdomCanvasProps {
  buildings: KingdomBuilding[];
  decorations: KingdomDecoration[];
  roads: KingdomRoad[];
  onAddBuilding: (type: string, x: number, y: number, width: number, height: number, name: string, purpose: any) => void;
  onAddDecoration: (type: string, x: number, y: number, width: number, height: number) => void;
  onAddRoad: (points: { x: number; y: number }[], width: number) => void;
  selectedAsset: KingdomAsset | null;
  style: string;
}

const KingdomCanvas = ({
  buildings,
  decorations,
  roads,
  onAddBuilding,
  onAddDecoration,
  onAddRoad,
  selectedAsset,
  style
}: KingdomCanvasProps) => {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [tempBuilding, setTempBuilding] = useState<{ type: string, x: number, y: number, width: number, height: number } | null>(null);
  
  useEffect(() => {
    // Simulate loading background image
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle cursor movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    setCursorPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };
  
  // Handle canvas click
  const handleCanvasClick = () => {
    if (!selectedAsset || !canvasRef.current) return;
    
    const { x, y } = cursorPosition;
    
    if (selectedAsset.category === 'building') {
      // For buildings, we need to get a name and purpose
      setTempBuilding({
        type: selectedAsset.type,
        x,
        y,
        width: selectedAsset.width,
        height: selectedAsset.height
      });
      setShowNameDialog(true);
    } else if (selectedAsset.category === 'decoration') {
      onAddDecoration(
        selectedAsset.type,
        x,
        y,
        selectedAsset.width,
        selectedAsset.height
      );
    } else if (selectedAsset.category === 'road') {
      // For simplicity, just add a simple road
      onAddRoad(
        [{ x, y }, { x: x + 100, y }],
        selectedAsset.width
      );
    }
  };
  
  // Complete building addition with name and purpose
  const completeBuildingAddition = (name: string, purpose: any) => {
    if (!tempBuilding) return;
    
    onAddBuilding(
      tempBuilding.type,
      tempBuilding.x,
      tempBuilding.y,
      tempBuilding.width,
      tempBuilding.height,
      name,
      purpose
    );
    
    setTempBuilding(null);
    setShowNameDialog(false);
  };
  
  return (
    <div className="relative border rounded-lg overflow-hidden bg-slate-100" style={{ height: '500px' }}>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading kingdom...</span>
        </div>
      ) : (
        <div 
          ref={canvasRef}
          className="relative h-full w-full overflow-auto cursor-pointer"
          onMouseMove={handleMouseMove}
          onClick={handleCanvasClick}
          style={{ backgroundImage: 'url(/lovable-uploads/f28e0730-400f-4207-8c07-3b13f1b52d29.png)', backgroundSize: 'cover' }}
        >
          {/* Kingdom elements */}
          {buildings.map(building => (
            <div
              key={building.id}
              className="absolute border-2 border-transparent hover:border-blue-500 bg-opacity-80 rounded-sm"
              style={{
                left: `${building.x}px`,
                top: `${building.y}px`,
                width: `${building.width}px`,
                height: `${building.height}px`,
                transform: `rotate(${building.rotation}deg)`,
                backgroundImage: `url(/lovable-uploads/f28e0730-400f-4207-8c07-3b13f1b52d29.png)`,
                backgroundSize: 'cover',
                zIndex: 10
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1 truncate">
                {building.name}
              </div>
            </div>
          ))}
          
          {decorations.map(decoration => (
            <div
              key={decoration.id}
              className="absolute border-2 border-transparent hover:border-green-500"
              style={{
                left: `${decoration.x}px`,
                top: `${decoration.y}px`,
                width: `${decoration.width}px`,
                height: `${decoration.height}px`,
                transform: `rotate(${decoration.rotation}deg)`,
                backgroundImage: `url(/lovable-uploads/f28e0730-400f-4207-8c07-3b13f1b52d29.png)`,
                backgroundSize: 'cover',
                zIndex: 5
              }}
            />
          ))}
          
          {roads.map(road => (
            <div
              key={road.id}
              className="absolute border-2 border-transparent hover:border-yellow-500 bg-amber-800"
              style={{
                left: `${road.points[0].x}px`,
                top: `${road.points[0].y}px`,
                width: `${road.points.length > 1 ? Math.abs(road.points[1].x - road.points[0].x) : road.width}px`,
                height: `${road.points.length > 1 ? (road.points[1].y === road.points[0].y ? road.width : Math.abs(road.points[1].y - road.points[0].y)) : road.width}px`,
                zIndex: 1
              }}
            />
          ))}
          
          {/* Show asset preview at cursor position */}
          {selectedAsset && (
            <div
              className="absolute border-2 border-blue-500 bg-blue-200 bg-opacity-50 pointer-events-none"
              style={{
                left: `${cursorPosition.x - selectedAsset.width / 2}px`,
                top: `${cursorPosition.y - selectedAsset.height / 2}px`,
                width: `${selectedAsset.width}px`,
                height: `${selectedAsset.height}px`,
                zIndex: 100
              }}
            />
          )}
        </div>
      )}
      
      {showNameDialog && (
        <NameBuildingDialog
          open={showNameDialog}
          onClose={() => setShowNameDialog(false)}
          onConfirm={completeBuildingAddition}
          defaultName={tempBuilding?.type || ''}
        />
      )}
    </div>
  );
};

export default KingdomCanvas;
