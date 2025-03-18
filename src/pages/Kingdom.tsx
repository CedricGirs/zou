
import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Ancient, Building, Castle, Sword, Save, Plus, Eraser, Move, Palette } from "lucide-react";
import { playSound } from "@/utils/audioUtils";

// Types pour les éléments du royaume
interface KingdomElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  style?: string;
}

// Type pour le royaume
interface Kingdom {
  elements: KingdomElement[];
  name: string;
  xp: number;
  level: number;
  style: string;
}

// Fonction pour générer un ID unique
const generateId = () => Math.random().toString(36).substring(2, 9);

const Kingdom = () => {
  const { userData, updateHeroProfile } = useUserData();
  const { t } = useLanguage();
  const [kingdom, setKingdom] = useState<Kingdom>(() => {
    // Initialiser avec les données existantes ou des valeurs par défaut
    return userData.heroProfile.kingdom || {
      elements: [],
      name: "Mon Royaume",
      xp: 0,
      level: 1,
      style: "medieval"
    };
  });

  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<KingdomElement | null>(null);
  const [isMoving, setIsMoving] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Éléments prédéfinis pour la construction
  const buildingElements = [
    { type: "castle", name: "Château", icon: <Castle /> },
    { type: "house", name: "Maison", icon: <Building /> },
    { type: "temple", name: "Temple", icon: <Ancient /> },
    { type: "barracks", name: "Caserne", icon: <Sword /> },
  ];

  // Sauvegarder le royaume dans les données utilisateur
  const saveKingdom = async () => {
    try {
      await updateHeroProfile({ kingdom });
      toast({
        title: "Royaume sauvegardé",
        description: "Votre royaume a été sauvegardé avec succès !",
      });
      playSound("success");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du royaume:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder votre royaume",
        variant: "destructive",
      });
    }
  };

  // Sauvegarde automatique
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (kingdom.elements.length > 0) {
        saveKingdom();
      }
    }, 60000); // Auto-sauvegarde toutes les minutes

    return () => clearInterval(autoSaveInterval);
  }, [kingdom]);

  // Gestion du click sur le canvas
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !selectedTool) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    if (selectedTool !== "move" && selectedTool !== "eraser") {
      const newElement: KingdomElement = {
        id: generateId(),
        type: selectedTool,
        x,
        y,
        width: 100,
        height: 100,
        name: `${selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)}`,
        style: kingdom.style
      };
      
      setKingdom(prev => {
        const newKingdom = {
          ...prev,
          elements: [...prev.elements, newElement],
          xp: prev.xp + 10
        };
        
        // Vérifier si le royaume doit monter de niveau
        const newLevel = Math.floor(newKingdom.xp / 100) + 1;
        if (newLevel > prev.level) {
          playSound("levelUp");
          toast({
            title: "Niveau supérieur !",
            description: `Votre royaume est maintenant niveau ${newLevel} !`,
          });
          newKingdom.level = newLevel;
        }
        
        return newKingdom;
      });
      
      playSound("click");
      setSelectedTool(null);
    }
  };

  // Gestion du click sur un élément
  const handleElementClick = (event: React.MouseEvent, element: KingdomElement) => {
    event.stopPropagation();
    
    if (selectedTool === "eraser") {
      // Supprimer l'élément
      setKingdom(prev => ({
        ...prev,
        elements: prev.elements.filter(el => el.id !== element.id)
      }));
      playSound("delete");
      return;
    }
    
    if (selectedTool === "move") {
      setSelectedElement(element);
      setIsMoving(true);
      setStartPosition({ x: event.clientX, y: event.clientY });
      setIsDragging(true);
      return;
    }
    
    // Sinon, simplement sélectionner l'élément
    setSelectedElement(element);
  };

  // Gérer le mouvement de la souris pour déplacer les éléments
  const handleMouseMove = (event: React.MouseEvent) => {
    if (isMoving && selectedElement && isDragging) {
      const deltaX = event.clientX - startPosition.x;
      const deltaY = event.clientY - startPosition.y;
      
      setStartPosition({ x: event.clientX, y: event.clientY });
      
      setKingdom(prev => ({
        ...prev,
        elements: prev.elements.map(el => 
          el.id === selectedElement.id 
            ? { ...el, x: el.x + deltaX, y: el.y + deltaY } 
            : el
        )
      }));
    }
  };

  // Gérer la fin du déplacement
  const handleMouseUp = () => {
    if (isMoving) {
      setIsMoving(false);
      setIsDragging(false);
      setSelectedElement(null);
    }
  };
  
  // Renommer un élément
  const handleRenameElement = (id: string, newName: string) => {
    setKingdom(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, name: newName } : el
      )
    }));
  };

  // Changer le style du royaume
  const changeStyle = (style: string) => {
    setKingdom(prev => ({
      ...prev,
      style,
      elements: prev.elements.map(el => ({ ...el, style }))
    }));
    toast({
      title: "Style mis à jour",
      description: `Le style du royaume est maintenant ${style}`,
    });
  };

  return (
    <MainLayout>
      <div className="p-4 max-w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Castle className="text-zou-purple" />
            <h1 className="text-2xl font-bold">{kingdom.name}</h1>
            <span className="ml-4 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-semibold">
              Niveau {kingdom.level} - {kingdom.xp % 100}/100 XP
            </span>
          </div>
          
          <Button 
            onClick={saveKingdom} 
            className="flex items-center gap-2"
            variant="sound"
            sound="success"
          >
            <Save size={16} />
            Sauvegarder
          </Button>
        </div>
        
        {/* Barre d'outils */}
        <div className="mb-4 p-3 bg-white rounded-lg shadow-md flex flex-wrap gap-2">
          <div className="flex-1 flex flex-wrap gap-2">
            {buildingElements.map((tool) => (
              <Button
                key={tool.type}
                onClick={() => setSelectedTool(tool.type)}
                variant={selectedTool === tool.type ? "secondary" : "outline"}
                className="flex items-center gap-2"
              >
                {tool.icon}
                {tool.name}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setSelectedTool("move")}
              variant={selectedTool === "move" ? "secondary" : "outline"}
              className="flex items-center gap-2"
            >
              <Move size={16} />
              Déplacer
            </Button>
            
            <Button
              onClick={() => setSelectedTool("eraser")}
              variant={selectedTool === "eraser" ? "destructive" : "outline"}
              className="flex items-center gap-2"
            >
              <Eraser size={16} />
              Effacer
            </Button>
            
            <Button
              onClick={() => {
                const stylePalette = document.getElementById('stylePalette');
                if (stylePalette) {
                  stylePalette.classList.toggle('hidden');
                }
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Palette size={16} />
              Style
            </Button>
          </div>
        </div>

        {/* Palette de styles (initialement cachée) */}
        <div id="stylePalette" className="hidden mb-4 p-3 bg-white rounded-lg shadow-md flex gap-2">
          <Button onClick={() => changeStyle('medieval')} variant="outline">Médiéval</Button>
          <Button onClick={() => changeStyle('roman')} variant="outline">Romain</Button>
          <Button onClick={() => changeStyle('futuristic')} variant="outline">Futuriste</Button>
        </div>
        
        {/* Zone de dessin du royaume */}
        <div 
          ref={containerRef}
          className="border-4 border-zinc-200 rounded-lg overflow-hidden bg-amber-50 relative"
          style={{ height: '600px' }}
        >
          <div 
            ref={canvasRef}
            className="h-full w-full relative cursor-pointer"
            onClick={handleCanvasClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Grille d'arrière-plan */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10 pointer-events-none">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border border-gray-400" />
              ))}
            </div>
            
            {/* Éléments du royaume */}
            {kingdom.elements.map((element) => (
              <div
                key={element.id}
                className={`absolute border-2 border-gray-400 rounded-md bg-white shadow-md flex items-center justify-center transform transition-transform hover:scale-105 ${
                  selectedElement?.id === element.id ? 'ring-2 ring-blue-500' : ''
                }`}
                style={{
                  left: `${element.x}px`,
                  top: `${element.y}px`,
                  width: `${element.width}px`,
                  height: `${element.height}px`,
                  backgroundColor: element.style === 'roman' ? '#FEF7CD' : 
                                   element.style === 'futuristic' ? '#E6F7FF' : '#F9FAFB'
                }}
                onClick={(e) => handleElementClick(e, element)}
              >
                <div className="flex flex-col items-center">
                  {element.type === 'castle' && <Castle className="text-purple-600" size={40} />}
                  {element.type === 'house' && <Building className="text-amber-600" size={40} />}
                  {element.type === 'temple' && <Ancient className="text-blue-600" size={40} />}
                  {element.type === 'barracks' && <Sword className="text-red-600" size={40} />}
                  <p className="text-xs mt-1 font-medium">{element.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Panneau de détails si un élément est sélectionné */}
        {selectedElement && (
          <Card className="mt-4 p-4">
            <h3 className="font-bold mb-2">Détails de l'élément</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium mb-1">Nom:</label>
                <input
                  type="text"
                  value={selectedElement.name}
                  onChange={(e) => handleRenameElement(selectedElement.id, e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setSelectedElement(null)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {/* Message d'aide si le royaume est vide */}
        {kingdom.elements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Card className="p-6 text-center bg-white/80 max-w-md">
              <h3 className="text-xl font-bold mb-2">Construisez votre royaume !</h3>
              <p className="mb-4">Sélectionnez un élément dans la barre d'outils puis cliquez sur la carte pour le placer.</p>
              <div className="flex justify-center">
                <Plus className="animate-pulse text-zou-purple" size={24} />
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Kingdom;
