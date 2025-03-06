
import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { ShoppingBag, Shirt, Scissors, Calendar } from "lucide-react";

const Look = () => {
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Mock data for wardrobe items
  const [wardrobe, setWardrobe] = useState({
    tops: [
      { id: "t1", name: "White T-Shirt", color: "bg-white", selected: true },
      { id: "t2", name: "Black T-Shirt", color: "bg-black", selected: true },
      { id: "t3", name: "Blue Shirt", color: "bg-blue-500", selected: true },
      { id: "t4", name: "Red Hoodie", color: "bg-red-500", selected: true }
    ],
    bottoms: [
      { id: "b1", name: "Blue Jeans", color: "bg-blue-800", selected: true },
      { id: "b2", name: "Black Pants", color: "bg-black", selected: true },
      { id: "b3", name: "Gray Shorts", color: "bg-gray-400", selected: true },
      { id: "b4", name: "Khaki Pants", color: "bg-yellow-700", selected: true }
    ],
    shoes: [
      { id: "s1", name: "White Sneakers", color: "bg-white", selected: true },
      { id: "s2", name: "Black Boots", color: "bg-black", selected: true },
      { id: "s3", name: "Brown Loafers", color: "bg-yellow-900", selected: true },
      { id: "s4", name: "Blue Sneakers", color: "bg-blue-500", selected: true }
    ]
  });
  
  // Mock weekly outfit plan
  const [weeklyOutfits, setWeeklyOutfits] = useState(
    daysOfWeek.map(day => ({
      day,
      top: wardrobe.tops[Math.floor(Math.random() * wardrobe.tops.length)],
      bottom: wardrobe.bottoms[Math.floor(Math.random() * wardrobe.bottoms.length)],
      shoe: wardrobe.shoes[Math.floor(Math.random() * wardrobe.shoes.length)]
    }))
  );
  
  const generateOutfits = () => {
    const selectedTops = wardrobe.tops.filter(item => item.selected);
    const selectedBottoms = wardrobe.bottoms.filter(item => item.selected);
    const selectedShoes = wardrobe.shoes.filter(item => item.selected);
    
    const newOutfits = daysOfWeek.map(day => ({
      day,
      top: selectedTops[Math.floor(Math.random() * selectedTops.length)],
      bottom: selectedBottoms[Math.floor(Math.random() * selectedBottoms.length)],
      shoe: selectedShoes[Math.floor(Math.random() * selectedShoes.length)]
    }));
    
    setWeeklyOutfits(newOutfits);
  };
  
  const toggleItemSelection = (category: 'tops' | 'bottoms' | 'shoes', id: string) => {
    setWardrobe({
      ...wardrobe,
      [category]: wardrobe[category].map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    });
  };
  
  const changeOutfitItem = (dayIndex: number, category: 'top' | 'bottom' | 'shoe') => {
    const selectedItems = 
      category === 'top' ? wardrobe.tops.filter(item => item.selected) :
      category === 'bottom' ? wardrobe.bottoms.filter(item => item.selected) :
      wardrobe.shoes.filter(item => item.selected);
    
    if (selectedItems.length === 0) return;
    
    const currentIndex = selectedItems.findIndex(
      item => item.id === weeklyOutfits[dayIndex][category].id
    );
    const nextIndex = (currentIndex + 1) % selectedItems.length;
    
    setWeeklyOutfits(weeklyOutfits.map((outfit, idx) => 
      idx === dayIndex ? 
        { ...outfit, [category]: selectedItems[nextIndex] } : 
        outfit
    ));
  };
  
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-pixel text-2xl mb-2">Look</h1>
        <p className="text-muted-foreground">Manage your wardrobe and weekly outfit plan</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Calendar size={18} className="text-zou-purple mr-2" />
                <h2 className="font-pixel text-base">Weekly Outfit Plan</h2>
              </div>
              <button 
                className="pixel-button text-xs flex items-center"
                onClick={generateOutfits}
              >
                <ShoppingBag size={14} className="mr-1" />
                GENERATE
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
              {weeklyOutfits.map((outfit, idx) => (
                <div key={outfit.day} className="pixel-card">
                  <h3 className="font-pixel text-sm mb-2">{outfit.day}</h3>
                  
                  <div className="space-y-3">
                    <div 
                      className="flex items-center p-2 bg-muted rounded cursor-pointer"
                      onClick={() => changeOutfitItem(idx, 'top')}
                    >
                      <div className={`w-5 h-5 rounded-full ${outfit.top.color} border border-black/20 mr-2`}></div>
                      <span className="text-xs truncate">{outfit.top.name}</span>
                    </div>
                    
                    <div 
                      className="flex items-center p-2 bg-muted rounded cursor-pointer"
                      onClick={() => changeOutfitItem(idx, 'bottom')}
                    >
                      <div className={`w-5 h-5 rounded-full ${outfit.bottom.color} border border-black/20 mr-2`}></div>
                      <span className="text-xs truncate">{outfit.bottom.name}</span>
                    </div>
                    
                    <div 
                      className="flex items-center p-2 bg-muted rounded cursor-pointer"
                      onClick={() => changeOutfitItem(idx, 'shoe')}
                    >
                      <div className={`w-5 h-5 rounded-full ${outfit.shoe.color} border border-black/20 mr-2`}></div>
                      <span className="text-xs truncate">{outfit.shoe.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="glass-card p-4">
            <div className="flex items-center mb-4">
              <Shirt size={18} className="text-zou-purple mr-2" />
              <h2 className="font-pixel text-base">My Wardrobe</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Tops</h3>
                <div className="grid grid-cols-2 gap-2">
                  {wardrobe.tops.map(item => (
                    <div 
                      key={item.id}
                      className={`
                        p-2 border rounded-md cursor-pointer
                        ${item.selected ? 'border-zou-purple bg-zou-purple/10' : 'border-border'}
                      `}
                      onClick={() => toggleItemSelection('tops', item.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${item.color} border border-black/20 mr-2`}></div>
                        <span className="text-xs truncate">{item.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Bottoms</h3>
                <div className="grid grid-cols-2 gap-2">
                  {wardrobe.bottoms.map(item => (
                    <div 
                      key={item.id}
                      className={`
                        p-2 border rounded-md cursor-pointer
                        ${item.selected ? 'border-zou-purple bg-zou-purple/10' : 'border-border'}
                      `}
                      onClick={() => toggleItemSelection('bottoms', item.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${item.color} border border-black/20 mr-2`}></div>
                        <span className="text-xs truncate">{item.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Shoes</h3>
                <div className="grid grid-cols-2 gap-2">
                  {wardrobe.shoes.map(item => (
                    <div 
                      key={item.id}
                      className={`
                        p-2 border rounded-md cursor-pointer
                        ${item.selected ? 'border-zou-purple bg-zou-purple/10' : 'border-border'}
                      `}
                      onClick={() => toggleItemSelection('shoes', item.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${item.color} border border-black/20 mr-2`}></div>
                        <span className="text-xs truncate">{item.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <button className="w-full pixel-button flex items-center justify-center">
                <Plus size={14} className="mr-1" />
                ADD ITEM
              </button>
              
              <div className="flex items-center justify-between p-3 border border-zou-orange rounded-md">
                <div className="flex items-center">
                  <Scissors size={16} className="text-zou-orange mr-2" />
                  <div>
                    <h4 className="text-sm font-medium">Haircut Reminder</h4>
                    <p className="text-xs text-muted-foreground">Next appointment: in 2 weeks</p>
                  </div>
                </div>
                <button className="text-xs underline text-zou-orange">
                  Set Date
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Look;
