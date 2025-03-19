
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { KingdomElement } from "@/types/KingdomTypes";
import { Trash2, RotateCw, Palette } from "lucide-react";
import { kingdomElementTemplates } from "@/data/kingdomElementTemplates";

interface ElementPropertiesPanelProps {
  element: KingdomElement;
  updateElement: (element: KingdomElement) => void;
  deleteElement: (id: string) => void;
  isDragging: boolean;
  isResizing: boolean;
}

const ElementPropertiesPanel = ({
  element,
  updateElement,
  deleteElement,
  isDragging,
  isResizing
}: ElementPropertiesPanelProps) => {
  const { t } = useLanguage();
  const [localElement, setLocalElement] = useState<KingdomElement>(element);
  
  // Get available colors for this element type
  const template = kingdomElementTemplates.find(t => t.type === element.type);
  const availableColors = template?.colors || ["#6366F1", "#8B5CF6", "#EC4899", "#F97316", "#22C55E"];
  
  // Update local state when selected element changes
  useEffect(() => {
    setLocalElement(element);
  }, [element]);
  
  // Update local state when dragging or resizing
  useEffect(() => {
    if (!isDragging && !isResizing) {
      setLocalElement(element);
    }
  }, [isDragging, isResizing, element]);
  
  // Update element properties
  const handleChange = (field: keyof KingdomElement, value: any) => {
    const updated = { ...localElement, [field]: value };
    setLocalElement(updated);
    updateElement(updated);
  };
  
  // Handle rotation change
  const handleRotate = () => {
    const newRotation = (localElement.rotation + 45) % 360;
    handleChange("rotation", newRotation);
  };
  
  return (
    <div className="border-t p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{t("element_properties")}</h3>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => deleteElement(element.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          {t("delete")}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t("name")}</Label>
          <Input 
            id="name"
            value={localElement.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="mb-2"
          />
          
          <Label htmlFor="description">{t("description")}</Label>
          <Input 
            id="description"
            value={localElement.description || ""}
            onChange={(e) => handleChange("description", e.target.value)}
            className="mb-2"
          />
          
          <div className="flex items-center gap-2 mb-2">
            <Label>{t("rotation")}</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRotate}
              className="gap-1"
            >
              <RotateCw className="h-3 w-3" />
              {t("rotate")}
            </Button>
            <span className="text-sm">{localElement.rotation}°</span>
          </div>
        </div>
        
        <div>
          <Label>{t("position")}</Label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <Label htmlFor="x" className="text-xs">X</Label>
              <Input 
                id="x"
                type="number"
                value={localElement.x}
                onChange={(e) => handleChange("x", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="y" className="text-xs">Y</Label>
              <Input 
                id="y"
                type="number"
                value={localElement.y}
                onChange={(e) => handleChange("y", Number(e.target.value))}
              />
            </div>
          </div>
          
          <Label>{t("size")}</Label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <Label htmlFor="width" className="text-xs">{t("width")}</Label>
              <Input 
                id="width"
                type="number"
                value={localElement.width}
                onChange={(e) => handleChange("width", Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs">{t("height")}</Label>
              <Input 
                id="height"
                type="number"
                value={localElement.height}
                onChange={(e) => handleChange("height", Number(e.target.value))}
              />
            </div>
          </div>
          
          {availableColors && (
            <div className="mt-2">
              <Label className="flex items-center gap-1">
                <Palette className="h-4 w-4" />
                {t("color")}
              </Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full ${
                      localElement.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleChange("color", color)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElementPropertiesPanel;
