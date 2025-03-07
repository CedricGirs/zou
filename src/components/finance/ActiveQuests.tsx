
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FinanceQuest } from "@/context/UserDataContext";

interface ActiveQuestsProps {
  quests: FinanceQuest[];
  completeQuestStep: (questId: string, progress: number) => Promise<void>;
}

const ActiveQuests = ({ quests, completeQuestStep }: ActiveQuestsProps) => {
  return (
    <Card variant="minimal">
      <CardHeader>
        <CardTitle>Quêtes Actives</CardTitle>
        <CardDescription>Complétez ces missions pour gagner de l'XP</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quests && quests.map(quest => (
            <div key={quest.id} className="border rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{quest.name}</h4>
                <span className="text-xs text-purple-500">+{quest.xpReward} XP</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{quest.description}</p>
              <Progress value={quest.progress} className="h-2 mb-1" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {quest.progress}% complété
                </span>
                {!quest.completed && quest.progress < 100 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => completeQuestStep(quest.id, Math.min(quest.progress + 20, 100))}
                  >
                    Progresser
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveQuests;
