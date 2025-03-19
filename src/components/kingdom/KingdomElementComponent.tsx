
import { useState, useRef, useEffect } from "react";
import { KingdomElement } from "@/types/KingdomTypes";
import { getElementIcon } from "@/data/kingdomElementTemplates";
import { useLanguage } from "@/context/LanguageContext";
import { Trash2, RotateCw } from "lucide-react";

interface KingdomElementComponentProps {
  element: KingdomElement;
  updateElement: (element: KingdomElement) => void;
  isSelected: boolean;
  onClick: () => void;
  setIsDragging: (isDragging: boolean) => void;
  setIsResizing: (isResizing: boolean) => void;
}

const KingdomElementComponent = ({
  element,
  updateElement,
  isSelected,
  onClick,
  setIsDragging,
  setIsResizing
}: KingdomElementComponentProps) => {
  const { t } = useLanguage();
  const elementRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: element.x, y: element.y });
  const [size, setSize] = useState({ width: element.width, height: element.height });
  const [rotation, setRotation] = useState(element.rotation);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [elementIcon, setElementIcon] = useState("");
  
  // Get the SVG icon for the element
  useEffect(() => {
    const icon = getElementIcon(element.type);
    // Replace any color placeholders with the element's color
    const colorizedIcon = element.color 
      ? icon.replace(/currentColor/g, element.color) 
      : icon;
    setElementIcon(colorizedIcon);
  }, [element.type, element.color]);
  
  // Update element position when dragging stops
  useEffect(() => {
    if (position.x !== element.x || position.y !== element.y) {
      updateElement({
        ...element,
        x: position.x,
        y: position.y
      });
    }
  }, [position]);
  
  // Update element size when resizing stops
  useEffect(() => {
    if (size.width !== element.width || size.height !== element.height) {
      updateElement({
        ...element,
        width: size.width,
        height: size.height
      });
    }
  }, [size]);
  
  // Update element rotation
  useEffect(() => {
    if (rotation !== element.rotation) {
      updateElement({
        ...element,
        rotation
      });
    }
  }, [rotation]);
  
  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Ignore if clicking on the resize handle or rotate button
    if ((e.target as HTMLElement).classList.contains("resize-handle") ||
        (e.target as HTMLElement).classList.contains("rotate-button")) {
      return;
    }
    
    // Set selected and start dragging
    onClick();
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
    
    // Add event listeners for dragging
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    
    setPosition({
      x: position.x + dx,
      y: position.y + dy
    });
    
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  
  // Handle mouse up for dragging
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };
  
  // Handle resize
  const handleResize = (e: React.MouseEvent, corner: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    
    const handleResizeMove = (e: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      
      if (corner.includes("right")) {
        newWidth = Math.max(50, startWidth + (e.clientX - startX));
      }
      
      if (corner.includes("bottom")) {
        newHeight = Math.max(50, startHeight + (e.clientY - startY));
      }
      
      setSize({ width: newWidth, height: newHeight });
    };
    
    const handleResizeUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeUp);
    };
    
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeUp);
  };
  
  // Handle rotation
  const handleRotate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Increment rotation by 45 degrees
    const newRotation = (rotation + 45) % 360;
    setRotation(newRotation);
  };
  
  return (
    <div 
      ref={elementRef}
      className={`absolute cursor-move ${isSelected ? 'ring-2 ring-primary' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onClick={onClick}
    >
      {/* The element icon */}
      <div className="w-full h-full flex items-center justify-center">
        <div dangerouslySetInnerHTML={{ __html: elementIcon }} />
      </div>
      
      {/* Display the name if selected */}
      {isSelected && (
        <div 
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white dark:bg-black px-2 py-0.5 rounded text-xs whitespace-nowrap"
          style={{ rotate: `${-rotation}deg` }}
        >
          {element.name}
        </div>
      )}
      
      {/* Resize handles (only show when selected) */}
      {isSelected && (
        <>
          <div 
            className="resize-handle absolute bottom-0 right-0 w-5 h-5 bg-primary cursor-nwse-resize rounded-br-md"
            onMouseDown={(e) => handleResize(e, "bottom-right")}
          />
          
          <button
            className="rotate-button absolute -top-6 -right-6 w-6 h-6 bg-white dark:bg-black rounded-full flex items-center justify-center cursor-pointer"
            onClick={handleRotate}
            style={{ rotate: `${-rotation}deg` }}
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
};

export default KingdomElementComponent;
