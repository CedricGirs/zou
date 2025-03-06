
import { useState, useEffect } from "react";
import { Clothing } from "../../types/clothing";
import ClothingItem from "./ClothingItem";
import { useToast } from "@/hooks/use-toast";

interface ClothingSelectorProps {
  clothing: Clothing[];
  onSelectionChange: (selectedIds: string[]) => void;
  initialSelection?: string[];
}

const ClothingSelector = ({ clothing, onSelectionChange, initialSelection = [] }: ClothingSelectorProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(initialSelection);
  const { toast } = useToast();

  // Initialize selection with initialSelection prop
  useEffect(() => {
    if (initialSelection && initialSelection.length > 0) {
      setSelectedItems(initialSelection);
    }
  }, [initialSelection]);

  const toggleItem = (id: string) => {
    setSelectedItems(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id];
      
      onSelectionChange(newSelection);
      return newSelection;
    });
  };

  const handleValidate = () => {
    if (selectedItems.length < 4) {
      toast({
        title: "Sélection insuffisante",
        description: "Veuillez sélectionner au moins 4 pièces de vêtements.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Sélection validée",
      description: `${selectedItems.length} pièces sélectionnées.`
    });
    
    onSelectionChange(selectedItems);
  };

  const categories = ["tops", "bottoms", "jackets", "shoes"];

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <div key={category} className="space-y-2">
          <h3 className="font-pixel text-sm capitalize">{category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {clothing
              .filter(item => item.category === category)
              .map(item => (
                <ClothingItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  category={item.category}
                  color={item.color}
                  icon={item.icon}
                  selected={selectedItems.includes(item.id)}
                  onToggle={toggleItem}
                />
              ))}
          </div>
        </div>
      ))}
      
      <div className="flex justify-center mt-6">
        <button 
          className="pixel-button"
          onClick={handleValidate}
        >
          Valider ma sélection
        </button>
      </div>
    </div>
  );
};

export default ClothingSelector;
