
import { ReactNode } from "react";
import { Clothing } from "../../types/clothing";

interface OutfitProps {
  day: string;
  items: Clothing[];
  editable?: boolean;
  onChangeItem?: (category: string, currentId: string) => void;
}

const Outfit = ({ day, items, editable = false, onChangeItem }: OutfitProps) => {
  const getCategoryIcon = (category: string, icon: ReactNode) => {
    return (
      <div className="flex flex-col items-center mb-2">
        <div className="text-xs text-muted-foreground capitalize mb-1">{category}</div>
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-sidebar-accent">
          {icon}
        </div>
      </div>
    );
  };

  const handleEdit = (category: string, id: string) => {
    if (editable && onChangeItem) {
      onChangeItem(category, id);
    }
  };

  return (
    <div className="glass-card p-4">
      <h3 className="font-pixel text-sm mb-3 text-center">{day}</h3>
      
      <div className="flex flex-col items-center space-y-3">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`
              flex items-center w-full p-2 rounded-md 
              ${editable ? "hover:bg-muted cursor-pointer" : ""}
            `}
            onClick={() => handleEdit(item.category, item.id)}
          >
            <div className="w-8 h-8 mr-3 flex items-center justify-center">
              {item.icon}
            </div>
            <div>
              <div className="text-sm">{item.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{item.category}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Outfit;
