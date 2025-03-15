
import React from "react";
import { Clothing } from "../../types/clothing";

interface CharacterOutfitProps {
  items: Clothing[];
  day?: string;
}

const CharacterOutfit = ({ items, day }: CharacterOutfitProps) => {
  // Trouver les items par catégorie
  const getItemByCategory = (category: string) => {
    return items.find(item => item.category === category);
  };

  const top = getItemByCategory("tops");
  const bottom = getItemByCategory("bottoms");
  const jacket = getItemByCategory("jackets");
  const shoes = getItemByCategory("shoes");

  // Obtenir la couleur CSS
  const getColor = (colorName: string) => {
    const colorMap: Record<string, string> = {
      "white": "#ffffff",
      "black": "#333333",
      "gray": "#808080",
      "navy": "#0a1657",
      "blue": "#1a73e8",
      "red": "#e53935",
      "green": "#43a047",
      "beige": "#f5f5dc",
      "brown": "#795548",
      "gold": "#ffd700",
      "silver": "#c0c0c0",
      "striped": "repeating-linear-gradient(45deg, #f5f5f5, #f5f5f5 5px, #e0e0e0 5px, #e0e0e0 10px)"
    };

    return colorMap[colorName] || colorName;
  };

  return (
    <div className="glass-card p-4 flex flex-col items-center">
      {day && <h3 className="font-pixel text-sm mb-4">{day}</h3>}
      
      <div className="relative w-32 h-60">
        {/* Tête */}
        <div className="absolute w-16 h-16 rounded-full bg-[#ffdbac] top-0 left-1/2 transform -translate-x-1/2 border border-gray-300"></div>
        
        {/* Corps avec T-shirt/top */}
        <div 
          className="absolute w-24 h-24 top-14 left-1/2 transform -translate-x-1/2 rounded-t-lg"
          style={{ backgroundColor: top ? getColor(top.color) : "#e0e0e0" }}
        >
          {/* Veste si présente */}
          {jacket && (
            <div 
              className="absolute inset-0 rounded-t-lg opacity-80"
              style={{ backgroundColor: getColor(jacket.color) }}
            ></div>
          )}
        </div>
        
        {/* Jambes/pantalon */}
        <div className="absolute w-10 h-24 bottom-8 left-1/2 ml-2 transform -translate-x-1/2 rounded-b-lg"
          style={{ backgroundColor: bottom ? getColor(bottom.color) : "#6b7280" }}
        ></div>
        <div className="absolute w-10 h-24 bottom-8 left-1/2 ml-[-10px] transform -translate-x-1/2 rounded-b-lg"
          style={{ backgroundColor: bottom ? getColor(bottom.color) : "#6b7280" }}
        ></div>
        
        {/* Chaussures */}
        <div 
          className="absolute w-6 h-4 bottom-0 left-1/2 ml-[-12px] transform -translate-x-1/2 rounded-lg"
          style={{ backgroundColor: shoes ? getColor(shoes.color) : "#333333" }}
        ></div>
        <div 
          className="absolute w-6 h-4 bottom-0 left-1/2 ml-4 transform -translate-x-1/2 rounded-lg"
          style={{ backgroundColor: shoes ? getColor(shoes.color) : "#333333" }}
        ></div>
      </div>
      
      <div className="mt-4 text-xs text-center space-y-1">
        {items.map((item, index) => (
          <div key={index} className="text-muted-foreground">
            {item.name}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-muted-foreground">Aucun vêtement sélectionné</div>
        )}
      </div>
    </div>
  );
};

export default CharacterOutfit;
