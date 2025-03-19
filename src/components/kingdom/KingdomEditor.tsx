
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { KingdomElement } from "@/types/KingdomTypes";
import KingdomElementComponent from "./KingdomElementComponent";
import ElementPropertiesPanel from "./ElementPropertiesPanel";
import { playSound } from "@/utils/audioUtils";
import { kingdomBackgrounds } from "@/data/kingdomElementTemplates";

interface KingdomEditorProps {
  elements: KingdomElement[];
  updateElement: (element: KingdomElement) => void;
  deleteElement: (id: string) => void;
  selectedElement: KingdomElement | null;
  setSelectedElement: (element: KingdomElement | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
}

const KingdomEditor = ({
  elements,
  updateElement,
  deleteElement,
  selectedElement,
  setSelectedElement,
  isDragging,
  setIsDragging,
  isResizing,
  setIsResizing
}: KingdomEditorProps) => {
  const { t } = useLanguage();
  const editorRef = useRef<HTMLDivElement>(null);
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [scale, setScale] = useState(1);
  
  // Handle click on the editor background
  const handleEditorClick = (e: React.MouseEvent) => {
    if (e.target === editorRef.current) {
      setSelectedElement(null);
    }
  };
  
  // Handle zooming
  const handleZoom = (direction: "in" | "out") => {
    const newScale = direction === "in" 
      ? Math.min(scale + 0.1, 2)
      : Math.max(scale - 0.1, 0.5);
    setScale(newScale);
    playSound("click");
  };
  
  // Change background
  const handleChangeBackground = () => {
    const newIndex = (backgroundIndex + 1) % kingdomBackgrounds.length;
    setBackgroundIndex(newIndex);
    playSound("click");
  };
  
  return (
    <div className="relative h-full flex flex-col">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button 
          className="bg-white/80 dark:bg-black/80 p-2 rounded-full shadow-md" 
          onClick={() => handleZoom("in")}
        >
          +
        </button>
        <button 
          className="bg-white/80 dark:bg-black/80 p-2 rounded-full shadow-md" 
          onClick={() => handleZoom("out")}
        >
          -
        </button>
        <button
          className="bg-white/80 dark:bg-black/80 p-2 rounded-full shadow-md"
          onClick={handleChangeBackground}
        >
          🖼️
        </button>
      </div>
      
      <div 
        ref={editorRef}
        className="relative flex-grow overflow-auto border-t"
        style={{ 
          backgroundImage: `url(${kingdomBackgrounds[backgroundIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={handleEditorClick}
      >
        <div 
          className="relative min-h-full min-w-full h-[2000px] w-[2000px] transition-transform duration-200"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          {elements.map((element) => (
            <KingdomElementComponent
              key={element.id}
              element={element}
              updateElement={updateElement}
              isSelected={selectedElement?.id === element.id}
              onClick={() => setSelectedElement(element)}
              setIsDragging={setIsDragging}
              setIsResizing={setIsResizing}
            />
          ))}
        </div>
      </div>
      
      {selectedElement && (
        <ElementPropertiesPanel
          element={selectedElement}
          updateElement={updateElement}
          deleteElement={deleteElement}
          isDragging={isDragging}
          isResizing={isResizing}
        />
      )}
    </div>
  );
};

export default KingdomEditor;
