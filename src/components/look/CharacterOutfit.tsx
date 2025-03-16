
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
      
      {/* Enhanced character visualization */}
      <div className="relative w-40 h-72 mb-4">
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-100/40 dark:to-purple-900/30 rounded-full blur-lg"></div>
        
        {/* Head with better styling */}
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-[#ffdbac] to-[#f1c27d] top-0 left-1/2 transform -translate-x-1/2 border border-gray-300 shadow-xl">
          {/* Eyes with animation */}
          <div className="absolute w-2 h-2.5 bg-gray-800 rounded-full left-5 top-7 animate-[blink_4s_ease-in-out_infinite]"></div>
          <div className="absolute w-2 h-2.5 bg-gray-800 rounded-full right-5 top-7 animate-[blink_4s_ease-in-out_infinite]"></div>
          {/* Eyebrows */}
          <div className="absolute w-3 h-0.5 bg-gray-700 rounded-full left-4.5 top-5 transform rotate-5"></div>
          <div className="absolute w-3 h-0.5 bg-gray-700 rounded-full right-4.5 top-5 transform -rotate-5"></div>
          {/* Mouth with subtle smile */}
          <div className="absolute w-6 h-1.5 bg-transparent border-b-2 border-gray-700 rounded-full left-1/2 transform -translate-x-1/2 top-12"></div>
        </div>
        
        {/* Neck with shadow */}
        <div className="absolute w-6 h-4 bg-[#f1c27d] top-20 left-1/2 transform -translate-x-1/2 shadow-inner"></div>
        
        {/* Body/Torso with improved design */}
        <div 
          className="absolute w-28 h-28 top-22 left-1/2 transform -translate-x-1/2 rounded-t-xl"
          style={{ 
            backgroundColor: top ? getColor(top.color) : "#e0e0e0",
            boxShadow: "inset 0 4px 6px rgba(0, 0, 0, 0.1)"
          }}
        >
          {/* 3D effect for top */}
          <div 
            className="absolute inset-0 rounded-t-xl opacity-30"
            style={{ 
              background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 100%)"
            }}
          ></div>
          
          {/* Arms with better shaping */}
          <div className="absolute w-6 h-24 left-[-5px] top-2 rounded-l-full"
            style={{ 
              backgroundColor: top ? getColor(top.color) : "#e0e0e0",
              boxShadow: "inset -2px 0 4px rgba(0,0,0,0.1)"
            }}
          ></div>
          <div className="absolute w-6 h-24 right-[-5px] top-2 rounded-r-full"
            style={{ 
              backgroundColor: top ? getColor(top.color) : "#e0e0e0",
              boxShadow: "inset 2px 0 4px rgba(0,0,0,0.1)"
            }}
          ></div>
          
          {/* Jacket layer (now properly layered over the top) */}
          {jacket && (
            <>
              {/* Jacket body */}
              <div 
                className="absolute inset-0 rounded-t-xl opacity-90 z-10"
                style={{ 
                  backgroundColor: getColor(jacket.color),
                  backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 100%)"
                }}
              ></div>
              
              {/* Jacket arms */}
              <div className="absolute w-7 h-25 bg-inherit left-[-6px] top-1 rounded-l-full z-10"
                style={{ 
                  backgroundColor: getColor(jacket.color),
                  backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)"
                }}
              ></div>
              <div className="absolute w-7 h-25 bg-inherit right-[-6px] top-1 rounded-r-full z-10"
                style={{ 
                  backgroundColor: getColor(jacket.color),
                  backgroundImage: "linear-gradient(270deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)"
                }}
              ></div>
              
              {/* Jacket opening */}
              <div className="absolute w-4 h-28 bg-gradient-to-b from-transparent to-black/5 left-1/2 transform -translate-x-1/2 top-0 z-20"></div>
            </>
          )}
        </div>
        
        {/* Hands with skin tone */}
        <div className="absolute w-5 h-5 rounded-full bg-[#ffdbac] bottom-26 left-[calc(50%-22px)] shadow-sm z-20"></div>
        <div className="absolute w-5 h-5 rounded-full bg-[#ffdbac] bottom-26 right-[calc(50%-22px)] shadow-sm z-20"></div>
        
        {/* Legs with better shaping and gap between them */}
        <div className="absolute w-12 h-28 bottom-6 left-1/2 transform -translate-x-1/2 z-0">
          <div className="absolute w-10 h-full right-0 rounded-t-lg rounded-b-md"
            style={{ 
              backgroundColor: bottom ? getColor(bottom.color) : "#6b7280",
              backgroundImage: "linear-gradient(0deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%)"
            }}
          ></div>
          <div className="absolute w-10 h-full left-0 rounded-t-lg rounded-b-md"
            style={{ 
              backgroundColor: bottom ? getColor(bottom.color) : "#6b7280",
              backgroundImage: "linear-gradient(0deg, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%)"
            }}
          ></div>
        </div>
        
        {/* Shoes with 3D effect */}
        <div 
          className="absolute w-11 h-6 bottom-0 left-[calc(50%-19px)] rounded-t-sm rounded-b-lg shadow-md z-10"
          style={{ 
            backgroundColor: shoes ? getColor(shoes.color) : "#333333",
            transform: "perspective(200px) rotateX(20deg)"
          }}
        ></div>
        <div 
          className="absolute w-11 h-6 bottom-0 left-[calc(50%+8px)] rounded-t-sm rounded-b-lg shadow-md z-10"
          style={{ 
            backgroundColor: shoes ? getColor(shoes.color) : "#333333",
            transform: "perspective(200px) rotateX(20deg)"
          }}
        ></div>
        
        {/* Highlight on shoes */}
        <div 
          className="absolute w-7 h-2 bottom-4 left-[calc(50%-17px)] rounded opacity-30 z-20"
          style={{ 
            background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)"
          }}
        ></div>
        <div 
          className="absolute w-7 h-2 bottom-4 left-[calc(50%+10px)] rounded opacity-30 z-20"
          style={{ 
            background: "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)"
          }}
        ></div>
        
        {/* Interactive elements - subtle hover effect */}
        {editable && (
          <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors duration-300 cursor-pointer rounded-lg z-30"></div>
        )}
      </div>
      
      {/* Clothing items list with improved styling */}
      <div className="mt-1 text-xs space-y-1 w-full">
        <div className="border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
          <span className="text-muted-foreground text-[0.7rem] uppercase tracking-wider">Vêtements</span>
        </div>
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`
              flex items-center justify-between p-1.5 rounded transition-all
              ${editable ? "hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer" : ""}
            `}
            onClick={() => handleChange(item.category, item.id)}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: getColor(item.color) }}
              ></div>
              <span className="truncate">{item.name}</span>
            </div>
            {editable && (
              <ArrowRight size={12} className="text-muted-foreground" />
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-muted-foreground text-center p-2">Aucun vêtement sélectionné</div>
        )}
      </div>
    </div>
  );
};

export default CharacterOutfit;
