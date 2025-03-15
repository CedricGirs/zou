
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Activity } from "lucide-react";
import { GymActivity } from "./GymActivity";
import { RunningActivity } from "./RunningActivity";
import { useUserData } from "@/context/userData";

const ActivityTracker = () => {
  const { userData } = useUserData();
  
  if (!userData.sportModule) {
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Enregistrer une activité</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gym">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="gym">
              <Dumbbell className="mr-2" size={16} />
              Musculation
            </TabsTrigger>
            <TabsTrigger value="running">
              <Activity className="mr-2" size={16} />
              Course
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gym" className="space-y-4">
            <GymActivity />
          </TabsContent>
          
          <TabsContent value="running" className="space-y-4">
            <RunningActivity />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityTracker;
