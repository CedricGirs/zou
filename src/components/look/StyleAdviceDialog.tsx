
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from 'lucide-react';

interface StyleAdviceProps {
  selectedClothing: any[];
}

const StyleAdviceDialog: React.FC<StyleAdviceProps> = ({ selectedClothing }) => {
  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getStyleAdvice = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "Tu es un conseiller en style expert. Donne des conseils de style personnalisés basés sur les vêtements sélectionnés.",
            },
            {
              role: "user",
              content: `Voici mes vêtements sélectionnés : ${selectedClothing
                .map((item) => item.name)
                .join(", ")}. Peux-tu me donner des conseils de style pour aujourd'hui?`,
            },
          ],
        }),
      });

      const data = await response.json();
      setAdvice(data.choices[0].message.content);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'obtenir des conseils de style pour le moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
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
          {!advice && !isLoading && (
            <Button onClick={getStyleAdvice} className="w-full">
              Obtenir des conseils
            </Button>
          )}
          {isLoading && (
            <div className="text-center text-muted-foreground">
              Génération des conseils...
            </div>
          )}
          {advice && <div className="prose prose-sm">{advice}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StyleAdviceDialog;
