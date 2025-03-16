
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SportHeader from "@/components/sport/SportHeader";
import ActivityTracker from "@/components/sport/activity/ActivityTracker";
import WeeklyProgress from "@/components/sport/WeeklyProgress";
import SportBadges from "@/components/sport/SportBadges";
import { useUserData } from "@/context/userData";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dumbbell, Activity, Trophy, Calendar, History, ChartLine } from "lucide-react";
import { SportHistory } from "@/components/sport/SportHistory";
import PreviousWeeksStats from "@/components/sport/PreviousWeeksStats";

const Sport = () => {
  const { userData, loading } = useUserData();
  
  // Make sure sportModule exists in userData
  useEffect(() => {
    // This ensures we log any issues to help with debugging
    if (!loading && (!userData.sportModule || Object.keys(userData.sportModule).length === 0)) {
      console.error("Sport module is missing from userData:", userData);
    }
  }, [userData, loading]);

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <Skeleton className="h-12 w-2/3 mb-6" />
          <Skeleton className="h-64 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Check if sportModule exists
  if (!userData.sportModule) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Module Sport</h1>
          <p className="text-muted-foreground mb-4">
            Le module Sport n'est pas disponible pour le moment. Veuillez réessayer plus tard.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <SportHeader />
        
        <Tabs defaultValue="activity" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="hidden sm:inline">Aujourd'hui</span>
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <ChartLine size={16} />
              <span className="hidden sm:inline">Progression</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Trophy size={16} />
              <span className="hidden sm:inline">Succès</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <ActivityTracker />
            </div>
          </TabsContent>
          
          <TabsContent value="progress">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WeeklyProgress />
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <History size={20} />
                  Historique
                </h3>
                <SportHistory />
                <PreviousWeeksStats />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="achievements">
            <div className="mb-6">
              <SportBadges />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Sport;
