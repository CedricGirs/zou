
import { useState, useEffect } from "react";
import { Clothing } from "../../types/clothing";
import { useToast } from "@/hooks/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Tally1, ShoppingBag, Shirt, Footprints } from "lucide-react";

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

  // Group clothing items by category
  const getItemsByCategory = (category: string) => {
    return clothing.filter(item => item.category === category);
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "tops": return <Shirt size={18} />;
      case "bottoms": return <Tally1 size={18} />;
      case "jackets": return <ShoppingBag size={18} />;
      case "shoes": return <Footprints size={18} />;
      default: return <Shirt size={18} />;
    }
  };

  // Generate color name for display
  const getColorName = (color: string) => {
    const colorMap: Record<string, string> = {
      "white": "Blanc",
      "black": "Noir",
      "gray": "Gris",
      "navy": "Bleu marine",
      "blue": "Bleu",
      "red": "Rouge",
      "green": "Vert",
      "beige": "Beige",
      "brown": "Marron",
      "gold": "Or",
      "silver": "Argent",
      "striped": "Rayé"
    };

    return colorMap[color] || color;
  };

  // Get selected count per category
  const getSelectedCountByCategory = (category: string) => {
    const categoryItems = getItemsByCategory(category);
    const selectedCategoryItems = categoryItems.filter(item => selectedItems.includes(item.id));
    return selectedCategoryItems.length;
  };

  const categories = ["tops", "bottoms", "jackets", "shoes"];
  const categoryNames: Record<string, string> = {
    "tops": "Hauts",
    "bottoms": "Bas",
    "jackets": "Vestes",
    "shoes": "Chaussures & Accessoires"
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map(category => (
          <div key={category} className="glass-card p-4 hover:shadow-md transition-all">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-zou-purple/20 flex items-center justify-center">
                    {getCategoryIcon(category)}
                  </div>
                  <div className="font-pixel text-sm">{categoryNames[category]}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span>{getSelectedCountByCategory(category)} sélectionnés</span>
                    <ChevronDown size={14} className="ml-1" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 w-60 max-h-80 overflow-y-auto" align="center">
                <div className="text-sm font-semibold px-2 py-1">
                  {categoryNames[category]} - Sélectionnez par couleur
                </div>
                <div className="border-t my-1"></div>
                {getItemsByCategory(category).map(item => (
                  <DropdownMenuItem key={item.id} onSelect={(e) => {
                    e.preventDefault();
                    toggleItem(item.id);
                  }}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2`} style={{
                          backgroundColor: item.color === "white" ? "#f8f8f8" : 
                                          item.color === "black" ? "#333" : 
                                          item.color === "navy" ? "#0a1657" : 
                                          item.color === "beige" ? "#f5f5dc" : 
                                          item.color === "gray" ? "#808080" : item.color
                        }}></div>
                        <span>{item.name}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        selectedItems.includes(item.id) ? "bg-zou-purple text-white" : "bg-gray-200"
                      }`}>
                        {selectedItems.includes(item.id) && "✓"}
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
        <button 
          className="pixel-button flex items-center space-x-2"
          onClick={handleValidate}
        >
          <span>Valider ma sélection</span>
          <span className="bg-white text-zou-purple rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
            {selectedItems.length}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ClothingSelector;
