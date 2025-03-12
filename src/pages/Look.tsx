import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useLanguage } from "../context/LanguageContext";
import StyleLevel from "../components/look/StyleLevel";
import StyleAchievements from "../components/look/StyleAchievements";
import ClothingSelector from "../components/look/ClothingSelector";
import OutfitGenerator from "../components/look/OutfitGenerator";
import StyleAdviceDialog from "../components/look/StyleAdviceDialog";
import { Clothing } from "../types/clothing";
import { useUserData } from "@/context/UserDataContext";
import { 
  Shirt, ShoppingBag, Tally1, Tally2, Tally3, Tally4, 
  Glasses, Watch, Ring, Umbrella 
} from "lucide-react";

const Look = () => {
  const { t } = useLanguage();
  const { userData } = useUserData();
  const [selectedClothingIds, setSelectedClothingIds] = useState<string[]>([]);
  const [showOutfits, setShowOutfits] = useState<boolean>(false);
  
  useEffect(() => {
    const userWardrobe = userData.lookModule.wardrobe;
    if (userWardrobe.length > 0) {
      const matchingIds = clothingItems
        .filter(item => userWardrobe.some(w => 
          w.toLowerCase().includes(item.name.toLowerCase()) || 
          item.name.toLowerCase().includes(w.toLowerCase())
        ))
        .map(item => item.id);
      
      if (matchingIds.length > 0) {
        setSelectedClothingIds(matchingIds);
        if (matchingIds.length >= 4) {
          setShowOutfits(true);
        }
      }
    }
  }, [userData.lookModule.wardrobe]);
  
  const clothingItems: Clothing[] = [
    { id: "tshirt-white", name: "T-shirt blanc", category: "tops", color: "white", icon: <Shirt size={18} /> },
    { id: "tshirt-black", name: "T-shirt noir", category: "tops", color: "black", icon: <Shirt size={18} /> },
    { id: "tshirt-gray", name: "T-shirt gris", category: "tops", color: "gray", icon: <Shirt size={18} /> },
    { id: "tshirt-navy", name: "T-shirt bleu marine", category: "tops", color: "navy", icon: <Shirt size={18} /> },
    { id: "shirt-white", name: "Chemise blanche", category: "tops", color: "white", icon: <Shirt size={18} /> },
    { id: "shirt-blue", name: "Chemise bleue", category: "tops", color: "blue", icon: <Shirt size={18} /> },
    { id: "shirt-striped", name: "Chemise rayée", category: "tops", color: "striped", icon: <Shirt size={18} /> },
    { id: "polo-navy", name: "Polo bleu marine", category: "tops", color: "navy", icon: <Shirt size={18} /> },
    
    { id: "jeans-navy", name: "Jeans bleu marine", category: "bottoms", color: "navy", icon: <Tally1 size={18} /> },
    { id: "jeans-black", name: "Jeans noir", category: "bottoms", color: "black", icon: <Tally1 size={18} /> },
    { id: "chino-beige", name: "Chino beige", category: "bottoms", color: "beige", icon: <Tally1 size={18} /> },
    { id: "chino-navy", name: "Chino bleu marine", category: "bottoms", color: "navy", icon: <Tally1 size={18} /> },
    { id: "pants-gray", name: "Pantalon gris", category: "bottoms", color: "gray", icon: <Tally1 size={18} /> },
    { id: "shorts-white", name: "Bermudas blanc", category: "bottoms", color: "white", icon: <Tally2 size={18} /> },
    { id: "shorts-navy", name: "Bermudas bleu marine", category: "bottoms", color: "navy", icon: <Tally2 size={18} /> },
    { id: "shorts-beige", name: "Bermudas beige", category: "bottoms", color: "beige", icon: <Tally2 size={18} /> },
    
    { id: "bomber-brown", name: "Bomber brun", category: "jackets", color: "brown", icon: <ShoppingBag size={18} /> },
    { id: "blazer-navy", name: "Blazer bleu marine", category: "jackets", color: "navy", icon: <ShoppingBag size={18} /> },
    { id: "jacket-leather", name: "Veste en cuir", category: "jackets", color: "black", icon: <ShoppingBag size={18} /> },
    { id: "cardigan-gray", name: "Cardigan gris", category: "jackets", color: "gray", icon: <ShoppingBag size={18} /> },
    
    { id: "sneakers-white", name: "Sneakers blanches", category: "shoes", color: "white", icon: <Tally3 size={18} /> },
    { id: "boots-black", name: "Chelsea boots noires", category: "shoes", color: "black", icon: <Tally3 size={18} /> },
    { id: "loafers-brown", name: "Mocassins bruns", category: "shoes", color: "brown", icon: <Tally4 size={18} /> },
    { id: "sneakers-black", name: "Sneakers noires", category: "shoes", color: "black", icon: <Tally3 size={18} /> },
    
    { id: "sunglasses", name: "Lunettes de soleil", category: "accessories", color: "black", icon: <Glasses size={18} /> },
    { id: "watch-silver", name: "Montre argentée", category: "accessories", color: "silver", icon: <Watch size={18} /> },
    { id: "ring-gold", name: "Bague en or", category: "accessories", color: "gold", icon: <Ring size={18} /> },
    { id: "umbrella-black", name: "Parapluie noir", category: "accessories", color: "black", icon: <Umbrella size={18} /> },
  ];

  const handleSelectionChange = (selected: string[]) => {
    setSelectedClothingIds(selected);
    if (selected.length >= 4) {
      setShowOutfits(true);
    }
  };

  const selectedClothing = clothingItems.filter(item => 
    selectedClothingIds.includes(item.id)
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-pixel text-2xl mb-2">{t("lookTitle")}</h1>
          <p className="text-muted-foreground">{t("lookSubtitle")}</p>
        </div>

        <StyleLevel />
        
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-pixel text-lg">Sélection des vêtements</h2>
            <StyleAdviceDialog selectedClothing={selectedClothing} />
          </div>
          
          <ClothingSelector 
            clothing={clothingItems}
            onSelectionChange={handleSelectionChange}
            initialSelection={selectedClothingIds}
          />
        </div>
        
        {showOutfits && (
          <div className="glass-card p-6">
            <OutfitGenerator selectedClothing={selectedClothing} />
          </div>
        )}
        
        <StyleAchievements />
      </div>
    </MainLayout>
  );
};

export default Look;
