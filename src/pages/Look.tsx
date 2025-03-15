
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
import { useToast } from "@/hooks/use-toast";
import { 
  Shirt, ShoppingBag, Tally1, Footprints, 
  Glasses, Watch, Bookmark, Umbrella, Star, Palette, Scissors,
  Award, UserCheck
} from "lucide-react";

const Look = () => {
  const { t } = useLanguage();
  const { userData, updateLookModule } = useUserData();
  const { toast } = useToast();
  const [selectedClothingIds, setSelectedClothingIds] = useState<string[]>([]);
  const [showOutfits, setShowOutfits] = useState<boolean>(false);
  const [lastRewardTime, setLastRewardTime] = useState<number>(0);
  
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
    // Tops
    { id: "tshirt-white", name: "T-shirt blanc", category: "tops", color: "white", icon: <Shirt size={18} /> },
    { id: "tshirt-black", name: "T-shirt noir", category: "tops", color: "black", icon: <Shirt size={18} /> },
    { id: "tshirt-gray", name: "T-shirt gris", category: "tops", color: "gray", icon: <Shirt size={18} /> },
    { id: "tshirt-navy", name: "T-shirt bleu marine", category: "tops", color: "navy", icon: <Shirt size={18} /> },
    { id: "tshirt-red", name: "T-shirt rouge", category: "tops", color: "red", icon: <Shirt size={18} /> },
    { id: "shirt-white", name: "Chemise blanche", category: "tops", color: "white", icon: <Shirt size={18} /> },
    { id: "shirt-blue", name: "Chemise bleue", category: "tops", color: "blue", icon: <Shirt size={18} /> },
    { id: "shirt-striped", name: "Chemise rayée", category: "tops", color: "striped", icon: <Shirt size={18} /> },
    { id: "polo-navy", name: "Polo bleu marine", category: "tops", color: "navy", icon: <Shirt size={18} /> },
    { id: "polo-green", name: "Polo vert", category: "tops", color: "green", icon: <Shirt size={18} /> },
    { id: "sweatshirt-gray", name: "Sweatshirt gris", category: "tops", color: "gray", icon: <Shirt size={18} /> },
    
    // Bottoms
    { id: "jeans-navy", name: "Jeans bleu marine", category: "bottoms", color: "navy", icon: <Tally1 size={18} /> },
    { id: "jeans-black", name: "Jeans noir", category: "bottoms", color: "black", icon: <Tally1 size={18} /> },
    { id: "jeans-light", name: "Jeans délavé", category: "bottoms", color: "blue", icon: <Tally1 size={18} /> },
    { id: "chino-beige", name: "Chino beige", category: "bottoms", color: "beige", icon: <Tally1 size={18} /> },
    { id: "chino-navy", name: "Chino bleu marine", category: "bottoms", color: "navy", icon: <Tally1 size={18} /> },
    { id: "chino-olive", name: "Chino olive", category: "bottoms", color: "green", icon: <Tally1 size={18} /> },
    { id: "pants-gray", name: "Pantalon gris", category: "bottoms", color: "gray", icon: <Tally1 size={18} /> },
    { id: "shorts-white", name: "Bermudas blanc", category: "bottoms", color: "white", icon: <Tally1 size={18} /> },
    { id: "shorts-navy", name: "Bermudas bleu marine", category: "bottoms", color: "navy", icon: <Tally1 size={18} /> },
    { id: "shorts-beige", name: "Bermudas beige", category: "bottoms", color: "beige", icon: <Tally1 size={18} /> },
    
    // Jackets
    { id: "bomber-brown", name: "Bomber brun", category: "jackets", color: "brown", icon: <ShoppingBag size={18} /> },
    { id: "blazer-navy", name: "Blazer bleu marine", category: "jackets", color: "navy", icon: <ShoppingBag size={18} /> },
    { id: "blazer-black", name: "Blazer noir", category: "jackets", color: "black", icon: <ShoppingBag size={18} /> },
    { id: "jacket-leather", name: "Veste en cuir", category: "jackets", color: "black", icon: <ShoppingBag size={18} /> },
    { id: "denim-jacket", name: "Veste en jean", category: "jackets", color: "blue", icon: <ShoppingBag size={18} /> },
    { id: "cardigan-gray", name: "Cardigan gris", category: "jackets", color: "gray", icon: <ShoppingBag size={18} /> },
    { id: "hoodie-black", name: "Hoodie noir", category: "jackets", color: "black", icon: <ShoppingBag size={18} /> },
    
    // Shoes & Accessories
    { id: "sneakers-white", name: "Sneakers blanches", category: "shoes", color: "white", icon: <Footprints size={18} /> },
    { id: "sneakers-black", name: "Sneakers noires", category: "shoes", color: "black", icon: <Footprints size={18} /> },
    { id: "sneakers-blue", name: "Sneakers bleues", category: "shoes", color: "blue", icon: <Footprints size={18} /> },
    { id: "boots-black", name: "Chelsea boots noires", category: "shoes", color: "black", icon: <Footprints size={18} /> },
    { id: "boots-brown", name: "Boots marron", category: "shoes", color: "brown", icon: <Footprints size={18} /> },
    { id: "loafers-brown", name: "Mocassins bruns", category: "shoes", color: "brown", icon: <Footprints size={18} /> },
    { id: "sunglasses", name: "Lunettes de soleil", category: "shoes", color: "black", icon: <Glasses size={18} /> },
    { id: "watch-silver", name: "Montre argentée", category: "shoes", color: "silver", icon: <Watch size={18} /> },
    { id: "watch-gold", name: "Montre dorée", category: "shoes", color: "gold", icon: <Watch size={18} /> },
    { id: "ring-gold", name: "Bague en or", category: "shoes", color: "gold", icon: <Bookmark size={18} /> },
    { id: "umbrella-black", name: "Parapluie noir", category: "shoes", color: "black", icon: <Umbrella size={18} /> },
  ];

  const handleSelectionChange = (selected: string[]) => {
    setSelectedClothingIds(selected);
    
    // Award XP for creating outfits
    const now = Date.now();
    if (selected.length >= 4 && now - lastRewardTime > 10000) { // Limit rewards to once every 10 seconds
      setLastRewardTime(now);
      
      // Check if the outfit is complete (has at least top, bottom, and shoes)
      const hasTop = selected.some(id => clothingItems.find(item => item.id === id)?.category === "tops");
      const hasBottom = selected.some(id => clothingItems.find(item => item.id === id)?.category === "bottoms");
      const hasShoes = selected.some(id => clothingItems.find(item => item.id === id)?.category === "shoes");
      
      let xpGain = 5; // Base XP
      let message = "Tenue créée! +5 XP";
      
      if (hasTop && hasBottom && hasShoes) {
        xpGain = 15; // More XP for complete outfit
        message = "Tenue complète créée! +15 XP";
      }
      
      // Check for new combinations (could be enhanced)
      if (selected.length > 5) {
        xpGain += 5;
        message = "Tenue créative! +20 XP";
      }
      
      // Update XP in user data
      const currentXP = userData.lookModule.styleXP || 0;
      const maxXP = userData.lookModule.maxXP || 100;
      const currentLevel = userData.lookModule.styleLevel || 1;
      
      let newXP = currentXP + xpGain;
      let newLevel = currentLevel;
      let newMaxXP = maxXP;
      
      // Level up if XP threshold is reached
      if (newXP >= maxXP) {
        newLevel += 1;
        newXP = newXP - maxXP;
        newMaxXP = Math.floor(maxXP * 1.5); // Increase XP needed for next level
        
        toast({
          title: "Niveau supérieur!",
          description: `Vous avez atteint le niveau ${newLevel} en style! Continuez votre progression.`,
          variant: "default",
        });
      } else {
        toast({
          title: "XP gagnés!",
          description: message,
          variant: "default",
        });
      }
      
      updateLookModule({
        styleXP: newXP,
        styleLevel: newLevel,
        maxXP: newMaxXP
      });
    }
    
    if (selected.length >= 4) {
      setShowOutfits(true);
    } else {
      setShowOutfits(false);
    }
  };

  const selectedClothing = clothingItems.filter(item => 
    selectedClothingIds.includes(item.id)
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="font-pixel text-2xl mb-2">{t("lookTitle")}</h1>
            <p className="text-muted-foreground">{t("lookSubtitle")}</p>
          </div>
          <StyleLevel />
        </div>

        <div className="glass-card p-6 bg-gradient-to-br from-soft-purple/20 to-background">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-pixel text-lg flex items-center">
              <Palette size={20} className="mr-2 text-zou-purple" />
              Ma garde-robe
            </h2>
            <div className="flex gap-2">
              <StyleAdviceDialog selectedClothing={selectedClothing} />
            </div>
          </div>
          
          <ClothingSelector 
            clothing={clothingItems}
            onSelectionChange={handleSelectionChange}
            initialSelection={selectedClothingIds}
          />
        </div>
        
        {showOutfits && (
          <div className="glass-card p-6 bg-gradient-to-br from-soft-blue/20 to-background">
            <OutfitGenerator selectedClothing={selectedClothing} />
          </div>
        )}
        
        <StyleAchievements />
      </div>
    </MainLayout>
  );
};

export default Look;
