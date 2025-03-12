
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wand2, Sparkles, Brain } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Clothing } from "@/types/clothing";
import { StyleAdvice } from "@/types/LookTypes";
import { Textarea } from "@/components/ui/textarea";

interface StyleAdviceProps {
  selectedClothing: Clothing[];
}

const StyleAdviceDialog: React.FC<StyleAdviceProps> = ({ selectedClothing }) => {
  const [advice, setAdvice] = useState<StyleAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userContext, setUserContext] = useState("");
  const { toast } = useToast();

  // Generate advice whenever the dialog is opened or selection changes
  useEffect(() => {
    if (isOpen && selectedClothing.length > 0) {
      generateStyleAdvice();
    }
  }, [isOpen, selectedClothing]);

  const generateStyleAdvice = () => {
    if (selectedClothing.length < 2) {
      toast({
        title: "Sélection insuffisante",
        description: "Sélectionnez au moins 2 vêtements pour obtenir des conseils.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Categories count
    const hasTop = selectedClothing.some(item => item.category === "tops");
    const hasBottom = selectedClothing.some(item => item.category === "bottoms");
    const hasJacket = selectedClothing.some(item => item.category === "jackets");
    const hasShoes = selectedClothing.some(item => item.category === "shoes");

    // Colors analysis
    const colors = selectedClothing.map(item => item.color);
    const isMonochrome = new Set(colors).size <= 2;
    const hasBrightColors = colors.some(color => ["white", "red", "yellow"].includes(color));
    const hasDarkColors = colors.some(color => ["black", "navy", "gray"].includes(color));

    // Generate outfit description based on selected items
    const tops = selectedClothing.filter(item => item.category === "tops").map(item => item.name).join(", ");
    const bottoms = selectedClothing.filter(item => item.category === "bottoms").map(item => item.name).join(", ");
    const jackets = selectedClothing.filter(item => item.category === "jackets").map(item => item.name).join(", ");
    const shoes = selectedClothing.filter(item => item.category === "shoes").map(item => item.name).join(", ");

    let outfitDescription = "Votre tenue composée de ";
    if (tops) outfitDescription += tops + (bottoms || jackets || shoes ? ", " : "");
    if (bottoms) outfitDescription += bottoms + (jackets || shoes ? ", " : "");
    if (jackets) outfitDescription += jackets + (shoes ? ", " : "");
    if (shoes) outfitDescription += "et " + shoes;
    outfitDescription += " crée un look ";

    // Style analysis
    let styleDescription = "";
    if (isMonochrome) {
      if (hasDarkColors) {
        styleDescription = "élégant et sobre. Les couleurs foncées donnent une impression de sophistication.";
      } else if (hasBrightColors) {
        styleDescription = "frais et lumineux. Les teintes claires apportent une touche de légèreté.";
      } else {
        styleDescription = "harmonieux avec une palette de couleurs équilibrée.";
      }
    } else {
      styleDescription = "contrasté et dynamique avec un mélange de couleurs qui attire l'attention.";
    }

    // Occasion advice
    let occasionAdvice = "";
    if (hasTop && hasBottom && hasJacket && hasShoes) {
      occasionAdvice = "Cette tenue complète convient parfaitement pour une journée au bureau ou un dîner en ville.";
    } else if (hasTop && hasBottom && hasShoes) {
      occasionAdvice = "Cette tenue décontractée est idéale pour une sortie entre amis ou une journée de shopping.";
    } else if (hasTop && hasBottom) {
      occasionAdvice = "Cette base vestimentaire vous accompagnera bien pour des activités quotidiennes.";
    } else {
      occasionAdvice = "Complétez votre tenue avec les éléments manquants pour un look complet.";
    }

    // Weather tips
    let weatherTips = "";
    if (hasJacket) {
      if (colors.includes("leather") || colors.includes("brown")) {
        weatherTips = "Votre veste en cuir est parfaite pour les soirées fraîches ou les journées venteuses.";
      } else {
        weatherTips = "Votre veste vous protégera si les températures sont plus fraîches que prévu.";
      }
    } else if (hasTop && tops.includes("T-shirt")) {
      weatherTips = "Cette tenue légère est parfaite pour les journées chaudes, pensez à ajouter une veste si les températures baissent.";
    } else if (hasTop && (tops.includes("Chemise") || tops.includes("Polo"))) {
      weatherTips = "Cette tenue est adaptée aux températures modérées, idéale pour le printemps ou l'automne.";
    }

    // Personalized advice based on user context if provided
    let personalizedAdvice = "";
    if (userContext) {
      if (userContext.toLowerCase().includes("entretien") || userContext.toLowerCase().includes("travail") || userContext.toLowerCase().includes("bureau")) {
        personalizedAdvice = "Pour votre contexte professionnel, assurez-vous que votre tenue reste formelle. Préférez des couleurs sobres et des coupes classiques.";
      } else if (userContext.toLowerCase().includes("sortie") || userContext.toLowerCase().includes("soirée") || userContext.toLowerCase().includes("fête")) {
        personalizedAdvice = "Pour votre sortie, n'hésitez pas à ajouter un accessoire qui attirera l'attention, comme un bijou ou une montre élégante.";
      } else if (userContext.toLowerCase().includes("date") || userContext.toLowerCase().includes("rendez-vous")) {
        personalizedAdvice = "Pour votre rendez-vous, cette tenue montre votre personnalité tout en restant élégante. C'est le parfait équilibre.";
      } else {
        personalizedAdvice = `Pour votre contexte "${userContext}", cette tenue semble appropriée. Ajustez les accessoires selon l'ambiance de l'événement.`;
      }
    }

    // Generate complete advice
    const generatedAdvice: StyleAdvice = {
      outfit: outfitDescription + styleDescription,
      description: "Votre sélection montre votre sens du style! " + (isMonochrome ? "Vous privilégiez la cohérence dans vos couleurs." : "Vous n'avez pas peur de jouer avec les contrastes."),
      occasion: occasionAdvice,
      weatherTips: weatherTips || "Adaptez votre tenue en fonction de la météo du jour.",
      personalizedTips: personalizedAdvice || "Ajoutez votre contexte pour des conseils plus personnalisés."
    };

    // Reward XP for using the style advice feature
    if (selectedClothing.length >= 4) {
      toast({
        title: "XP gagnés!",
        description: "+15 XP pour avoir créé une tenue complète!",
        variant: "success",
      });
    }

    // Simulate delay for better UX
    setTimeout(() => {
      setAdvice(generatedAdvice);
      setIsLoading(false);
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Wand2 size={16} />
          Conseils du jour
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <Sparkles className="text-purple-500" size={20} />
            Conseils de Style
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isLoading && (
            <div className="text-center py-6 text-muted-foreground">
              <div className="flex justify-center mb-3">
                <Sparkles className="animate-pulse text-purple-500" size={24} />
              </div>
              Analyse de votre style en cours...
            </div>
          )}

          {!isLoading && advice && (
            <div className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-md">
                <h3 className="font-semibold text-sm mb-1">Votre tenue</h3>
                <p className="text-sm">{advice.outfit}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm mb-1">Analyse</h3>
                <p className="text-sm">{advice.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm mb-1">Occasions recommandées</h3>
                <p className="text-sm">{advice.occasion}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sm mb-1">Conseils météo</h3>
                <p className="text-sm">{advice.weatherTips}</p>
              </div>

              {advice.personalizedTips && (
                <div>
                  <h3 className="font-semibold text-sm mb-1">Conseils personnalisés</h3>
                  <p className="text-sm">{advice.personalizedTips}</p>
                </div>
              )}

              <div className="pt-3 border-t">
                <label htmlFor="context" className="block text-sm font-medium mb-2 flex items-center gap-1">
                  <Brain size={14} />
                  Contexte ou occasion spécifique
                </label>
                <Textarea
                  id="context"
                  placeholder="Ex: Entretien d'embauche, Rendez-vous, Soirée..."
                  value={userContext}
                  onChange={(e) => setUserContext(e.target.value)}
                  className="text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={generateStyleAdvice} 
                  className="mt-2 w-full"
                >
                  Mettre à jour les conseils
                </Button>
              </div>
            </div>
          )}

          {!isLoading && !advice && selectedClothing.length < 2 && (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Sélectionnez au moins 2 vêtements pour obtenir des conseils de style personnalisés.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StyleAdviceDialog;
