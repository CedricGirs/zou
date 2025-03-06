
import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useLanguage } from "../context/LanguageContext";
import { 
  Shirt, Pants, ShoppingBag, Shoe, Tally1, Tally2, Tally3, Tally4 
} from "lucide-react";
import ClothingSelector from "../components/look/ClothingSelector";
import OutfitGenerator from "../components/look/OutfitGenerator";
import { Clothing } from "../types/clothing";

const Look = () => {
  const { t } = useLanguage();
  const [selectedClothingIds, setSelectedClothingIds] = useState<string[]>([]);
  const [showOutfits, setShowOutfits] = useState<boolean>(false);
  
  // Données des vêtements
  const clothingItems: Clothing[] = [
    // Hauts
    { id: "tshirt-white", name: "T-shirt blanc", category: "tops", color: "white", icon: <Shirt size={18} /> },
    { id: "tshirt-black", name: "T-shirt noir", category: "tops", color: "black", icon: <Shirt size={18} /> },
    { id: "tshirt-gray", name: "T-shirt gris", category: "tops", color: "gray", icon: <Shirt size={18} /> },
    { id: "tshirt-navy", name: "T-shirt bleu marine", category: "tops", color: "navy", icon: <Shirt size={18} /> },
    { id: "shirt-white", name: "Chemise blanche", category: "tops", color: "white", icon: <Shirt size={18} /> },
    
    // Bas
    { id: "jeans-navy", name: "Jeans bleu marine", category: "bottoms", color: "navy", icon: <Pants size={18} /> },
    { id: "chino-beige", name: "Chino beige", category: "bottoms", color: "beige", icon: <Pants size={18} /> },
    { id: "pants-navy", name: "Pantalon classique bleu marine", category: "bottoms", color: "navy", icon: <Pants size={18} /> },
    { id: "shorts-white", name: "Bermudas blanc", category: "bottoms", color: "white", icon: <Pants size={18} /> },
    { id: "shorts-navy", name: "Bermudas bleu marine", category: "bottoms", color: "navy", icon: <Pants size={18} /> },
    { id: "shorts-beige", name: "Bermudas beige", category: "bottoms", color: "beige", icon: <Pants size={18} /> },
    
    // Vestes
    { id: "bomber-brown", name: "Bomber brun", category: "jackets", color: "brown", icon: <ShoppingBag size={18} /> },
    { id: "blazer-navy", name: "Blazer bleu marine", category: "jackets", color: "navy", icon: <ShoppingBag size={18} /> },
    
    // Chaussures
    { id: "sneakers-white", name: "Sneakers blanches", category: "shoes", color: "white", icon: <Shoe size={18} /> },
    { id: "boots-black", name: "Chelsea boots noires", category: "shoes", color: "black", icon: <Shoe size={18} /> },
    { id: "loafers-brown", name: "Mocassins bruns", category: "shoes", color: "brown", icon: <Shoe size={18} /> },
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
      <div className="mb-6">
        <h1 className="font-pixel text-2xl mb-2">{t("lookTitle")}</h1>
        <p className="text-muted-foreground">{t("lookSubtitle")}</p>
      </div>
      
      <div className="glass-card p-4 mb-6">
        <h2 className="font-pixel text-lg mb-4">Sélection des vêtements</h2>
        <ClothingSelector 
          clothing={clothingItems}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      
      {showOutfits && (
        <div className="glass-card p-4">
          <OutfitGenerator selectedClothing={selectedClothing} />
        </div>
      )}
    </MainLayout>
  );
};

export default Look;
