
import { useState, useEffect } from "react";
import { Clothing, Outfit } from "../../types/clothing";
import OutfitComponent from "./Outfit";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

interface OutfitGeneratorProps {
  selectedClothing: Clothing[];
}

const OutfitGenerator = ({ selectedClothing }: OutfitGeneratorProps) => {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { toast } = useToast();
  
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  useEffect(() => {
    if (selectedClothing.length > 0) {
      generateOutfits();
    }
  }, [selectedClothing]);

  const generateOutfits = () => {
    if (selectedClothing.length < 4) {
      toast({
        title: "Sélection insuffisante",
        description: "Veuillez sélectionner plus de vêtements pour générer des tenues.",
        variant: "destructive"
      });
      return;
    }

    const tops = selectedClothing.filter(item => item.category === "tops");
    const bottoms = selectedClothing.filter(item => item.category === "bottoms");
    const jackets = selectedClothing.filter(item => item.category === "jackets");
    const shoes = selectedClothing.filter(item => item.category === "shoes");

    const newOutfits = days.map((day, index) => {
      const outfit: Outfit = {
        day,
        items: [
          tops[index % tops.length], 
          bottoms[index % bottoms.length]
        ]
      };

      // Ajouter une veste si disponible, mais pas tous les jours
      if (jackets.length > 0 && (index % 2 === 0 || index === 6)) {
        outfit.items.push(jackets[index % jackets.length]);
      }

      // Ajouter des chaussures si disponibles
      if (shoes.length > 0) {
        outfit.items.push(shoes[index % shoes.length]);
      }

      return outfit;
    });

    setOutfits(newOutfits);
    toast({
      title: "Tenues générées",
      description: "7 tenues ont été créées pour votre semaine."
    });
  };

  const handleChangeItem = (day: string, category: string, currentId: string) => {
    // Obtenir tous les vêtements disponibles de cette catégorie
    const availableItems = selectedClothing.filter(item => item.category === category);
    if (availableItems.length <= 1) return;

    // Trouver l'index de l'item actuel
    const currentIndex = availableItems.findIndex(item => item.id === currentId);
    // Obtenir le prochain item dans la rotation
    const nextItem = availableItems[(currentIndex + 1) % availableItems.length];

    // Mettre à jour la tenue
    setOutfits(prev => prev.map(outfit => {
      if (outfit.day === day) {
        return {
          ...outfit,
          items: outfit.items.map(item => 
            item.id === currentId ? nextItem : item
          )
        };
      }
      return outfit;
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-pixel text-lg">Tenues hebdomadaires</h3>
        <div className="flex space-x-2">
          <button 
            className="flex items-center text-xs bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Terminer" : "Modifier"}
          </button>
          <button 
            className="flex items-center text-xs bg-zou-purple text-white px-3 py-1 rounded"
            onClick={generateOutfits}
          >
            <RefreshCw size={14} className="mr-1" />
            Régénérer
          </button>
        </div>
      </div>
      
      {outfits.length === 0 ? (
        <div className="text-center text-muted-foreground py-6">
          Veuillez sélectionner des vêtements et cliquer sur "Valider ma sélection" pour générer des tenues.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {outfits.map((outfit) => (
            <OutfitComponent
              key={outfit.day}
              day={outfit.day}
              items={outfit.items}
              editable={isEditing}
              onChangeItem={(category, currentId) => 
                handleChangeItem(outfit.day, category, currentId)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OutfitGenerator;
