
import React from "react";
import { Clothing } from "../../types/clothing";
import { ArrowRight } from "lucide-react";

interface CharacterOutfitProps {
  items: Clothing[];
  day?: string;
  editable?: boolean;
  onChangeItem?: (category: string, currentId: string) => void;
}

const CharacterOutfit = ({ items, day, editable = false, onChangeItem }: CharacterOutfitProps) => {
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

  const handleChange = (category: string, id: string) => {
    if (editable && onChangeItem) {
      onChangeItem(category, id);
    }
  };

  return (
    <div className="glass-card p-4 flex flex-col items-center relative overflow-hidden">
      {day && <h3 className="font-pixel text-sm mb-4">{day}</h3>}
      
      {/* Modern character visualization */}
      <div className="relative w-36 h-64 mb-2">
        {/* Background lighting effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-100/30 dark:to-purple-900/20 rounded-full blur-md"></div>
        
        {/* Head with better face features */}
        <div className="absolute w-16 h-16 rounded-full bg-gradient-to-r from-[#ffdbac] to-[#f1c27d] top-0 left-1/2 transform -translate-x-1/2 border border-gray-300 shadow-lg">
          {/* Eyes */}
          <div className="absolute w-1.5 h-2 bg-gray-800 rounded-full left-4 top-6"></div>
          <div className="absolute w-1.5 h-2 bg-gray-800 rounded-full right-4 top-6"></div>
          {/* Mouth */}
          <div className="absolute w-4 h-1 bg-gray-700 rounded-full left-1/2 transform -translate-x-1/2 top-10"></div>
        </div>
        
        {/* Neck */}
        <div className="absolute w-5 h-3 bg-[#f1c27d] top-16 left-1/2 transform -translate-x-1/2"></div>
        
        {/* Body/Torso with better shape and lighting */}
        <div 
          className="absolute w-26 h-24 top-16 left-1/2 transform -translate-x-1/2 rounded-t-3xl"
          style={{ 
            backgroundColor: top ? getColor(top.color) : "#e0e0e0",
            boxShadow: "inset 0 4px 6px rgba(0, 0, 0, 0.1)"
          }}
        >
          {/* Jacket layer with better fit and texture */}
          {jacket && (
            <div 
              className="absolute inset-0 rounded-t-3xl opacity-90"
              style={{ 
                backgroundColor: getColor(jacket.color),
                backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)"
              }}
            ></div>
          )}
          
          {/* Arms */}
          <div className="absolute w-5 h-20 bg-inherit left-[-4px] top-2 rounded-l-full"></div>
          <div className="absolute w-5 h-20 bg-inherit right-[-4px] top-2 rounded-r-full"></div>
        </div>
        
        {/* Hands */}
        <div className="absolute w-4 h-4 rounded-full bg-[#ffdbac] bottom-24 left-[calc(50%-18px)]"></div>
        <div className="absolute w-4 h-4 rounded-full bg-[#ffdbac] bottom-24 right-[calc(50%-18px)]"></div>
        
        {/* Legs with better shaping and perspective */}
        <div className="absolute w-10 h-24 bottom-8 left-1/2 ml-2 transform -translate-x-1/2 rounded-t-lg rounded-b-md"
          style={{ 
            backgroundColor: bottom ? getColor(bottom.color) : "#6b7280",
            backgroundImage: "linear-gradient(0deg, rgba(0,0,0,0.05) 0%, rgba(255,255,255,0.1) 100%)"
          }}
        ></div>
        <div className="absolute w-10 h-24 bottom-8 left-1/2 ml-[-10px] transform -translate-x-1/2 rounded-t-lg rounded-b-md"
          style={{ 
            backgroundColor: bottom ? getColor(bottom.color) : "#6b7280",
            backgroundImage: "linear-gradient(0deg, rgba(0,0,0,0.05) 0%, rgba(255,255,255,0.1) 100%)"
          }}
        ></div>
        
        {/* Shoes with 3D effect */}
        <div 
          className="absolute w-8 h-4 bottom-0 left-1/2 ml-[-18px] transform -translate-x-1/2 rounded-t-none rounded-b-lg shadow-md"
          style={{ 
            backgroundColor: shoes ? getColor(shoes.color) : "#333333",
            transform: "perspective(200px) rotateX(20deg)"
          }}
        ></div>
        <div 
          className="absolute w-8 h-4 bottom-0 left-1/2 ml-4 transform -translate-x-1/2 rounded-t-none rounded-b-lg shadow-md"
          style={{ 
            backgroundColor: shoes ? getColor(shoes.color) : "#333333",
            transform: "perspective(200px) rotateX(20deg)"
          }}
        ></div>
        
        {/* Interactive elements - slight animation on hover */}
        {editable && (
          <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors duration-200 cursor-pointer rounded-lg z-10"></div>
        )}
      </div>
      
      {/* Clothing items list */}
      <div className="mt-4 text-xs space-y-1 w-full">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`
              flex items-center justify-between p-1.5 rounded
              ${editable ? "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" : ""}
            `}
            onClick={() => handleChange(item.category, item.id)}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getColor(item.color) }}
              ></div>
              <span>{item.name}</span>
            </div>
            {editable && (
              <ArrowRight size={12} className="text-muted-foreground" />
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-muted-foreground text-center">Aucun vêtement sélectionné</div>
        )}
      </div>
    </div>
  );
};

export default CharacterOutfit;
