
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, MessageCircle, Lightbulb, BookMarked, GraduationCap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatusItem } from "@/types/StatusTypes";
import { useUserData } from "@/context/userData";
import { StatusAdvice } from "@/types/StatusTypes";

interface StatusAdviceDialogProps {
  statusItems: StatusItem[];
}

const StatusAdviceDialog = ({ statusItems }: StatusAdviceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [generating, setGenerating] = useState(false);
  const [advice, setAdvice] = useState<StatusAdvice | null>(null);
  const { toast } = useToast();
  const { userData, updateStatusModule } = useUserData();

  const generateAdvice = async () => {
    if (!query.trim()) {
      toast({
        title: "Saisie requise",
        description: "Veuillez entrer votre question pour obtenir des conseils.",
        variant: "destructive",
      });
      return;
    }

    setGenerating(true);
    try {
      // Simulating AI response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get current items
      const languages = statusItems.filter(item => item.type === "language");
      const courses = statusItems.filter(item => item.type === "course");
      const skills = statusItems.filter(item => item.type === "skill");
      
      // Generate mock advice based on the query and current items
      let generatedAdvice: StatusAdvice = {
        title: "",
        advice: "",
        resources: [],
        nextSteps: []
      };
      
      if (query.toLowerCase().includes("langue") || query.toLowerCase().includes("language")) {
        generatedAdvice = {
          title: "Amélioration en langues",
          advice: `D'après votre profil, vous avez ${languages.length} langue(s) en cours d'apprentissage. Pour progresser plus rapidement, essayez de pratiquer quotidiennement pendant au moins 15 minutes et utilisez des applications comme Duolingo ou Babbel.`,
          resources: [
            "Duolingo - Application gratuite d'apprentissage des langues",
            "Babbel - Cours de langues en ligne avec professeurs",
            "Italki - Pratique avec des locuteurs natifs",
          ],
          nextSteps: [
            "Établir une routine quotidienne d'apprentissage",
            "Regarder des films/séries dans la langue cible",
            "Trouver un partenaire linguistique"
          ]
        };
      } else if (query.toLowerCase().includes("formation") || query.toLowerCase().includes("course")) {
        generatedAdvice = {
          title: "Optimisation de vos formations",
          advice: `Vous suivez actuellement ${courses.length} formation(s). Pour maximiser votre apprentissage, concentrez-vous sur un domaine à la fois et appliquez immédiatement ce que vous apprenez sur des projets concrets.`,
          resources: [
            "Coursera - Formations certifiantes en ligne",
            "Udemy - Cours pratiques pour développer des compétences",
            "edX - Cours universitaires en ligne",
          ],
          nextSteps: [
            "Créer un calendrier d'étude structuré",
            "Rejoindre des communautés liées à vos formations",
            "Mettre en pratique par des projets personnels"
          ]
        };
      } else if (query.toLowerCase().includes("compétence") || query.toLowerCase().includes("skill")) {
        generatedAdvice = {
          title: "Développement de compétences",
          advice: `Vous développez ${skills.length} compétence(s). Pour accélérer votre progression, essayez de consacrer du temps chaque semaine à la pratique délibérée et fixez-vous des objectifs mesurables.`,
          resources: [
            "Livres spécialisés dans votre domaine",
            "YouTube - Tutoriels gratuits",
            "Masterclass - Formations par des experts",
          ],
          nextSteps: [
            "Identifier les sous-compétences à développer",
            "Trouver un mentor dans votre domaine",
            "Participer à des défis ou concours"
          ]
        };
      } else {
        // Default advice
        generatedAdvice = {
          title: "Conseils personnalisés pour votre développement",
          advice: `Basé sur votre profil, vous pourriez optimiser votre progression en vous concentrant sur l'équilibre entre formations théoriques et applications pratiques. N'hésitez pas à diversifier vos méthodes d'apprentissage.`,
          resources: [
            "Medium.com - Articles sur le développement personnel",
            "Skillshare - Plateforme d'apprentissage diversifiée",
            "Podcasts éducatifs dans votre domaine d'intérêt",
          ],
          nextSteps: [
            "Définir des objectifs SMART pour chaque compétence",
            "Créer un portfolio de vos réalisations",
            "Rejoindre des groupes d'étude ou communautés"
          ]
        };
      }
      
      setAdvice(generatedAdvice);
      
      // Award XP for using the advice feature
      const newXP = (userData.statusModule.statusXP || 0) + 10;
      let newLevel = userData.statusModule.statusLevel || 1;
      let newMaxXP = userData.statusModule.maxXP || 100;
      
      if (newXP >= newMaxXP) {
        newLevel += 1;
        newMaxXP = Math.floor(newMaxXP * 1.5);
        
        toast({
          title: "Niveau supérieur!",
          description: `Vous avez atteint le niveau ${newLevel} en formation!`,
          variant: "default",
        });
      } else {
        toast({
          title: "XP gagnés!",
          description: "+10 XP pour avoir utilisé le conseiller!",
          variant: "default",
        });
      }
      
      await updateStatusModule({
        statusXP: newXP,
        statusLevel: newLevel,
        maxXP: newMaxXP
      });
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de générer des conseils pour le moment.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <MessageCircle size={16} />
          <span>Conseiller IA</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] glass-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-pixel">
            <Sparkles className="text-zou-purple" size={20} />
            Conseiller Formation IA
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          {!advice ? (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Posez une question sur vos formations, langues ou compétences pour obtenir des conseils personnalisés.
              </p>
              <Textarea
                placeholder="Ex: Comment améliorer mon apprentissage des langues? Quelles compétences développer?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[100px]"
              />
            </>
          ) : (
            <div className="bg-muted/30 rounded-lg p-4 space-y-4 animate-fade-in">
              <div className="flex items-start gap-3">
                <div className="bg-zou-purple rounded-full p-2 text-white">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{advice.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{advice.advice}</p>
                </div>
              </div>
              
              {advice.resources && advice.resources.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <BookMarked size={16} className="text-zou-purple" />
                    Ressources recommandées
                  </h4>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    {advice.resources.map((resource, index) => (
                      <li key={index}>{resource}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {advice.nextSteps && advice.nextSteps.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <GraduationCap size={16} className="text-zou-purple" />
                    Prochaines étapes
                  </h4>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    {advice.nextSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          {!advice ? (
            <Button 
              onClick={generateAdvice} 
              disabled={generating || !query.trim()} 
              className="w-full"
            >
              {generating ? "Génération en cours..." : "Obtenir des conseils"}
            </Button>
          ) : (
            <Button 
              onClick={() => {
                setAdvice(null);
                setQuery("");
              }}
              variant="outline"
              className="w-full"
            >
              Poser une autre question
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusAdviceDialog;
