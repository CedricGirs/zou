
import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SportHeader from "@/components/sport/SportHeader";
import { ActivityTracker } from "@/components/sport/activity";
import WeeklyProgress from "@/components/sport/WeeklyProgress";
import SportBadges from "@/components/sport/SportBadges";
import { useUserData } from "@/context/userData";
import { Skeleton } from "@/components/ui/skeleton";

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
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ActivityTracker />
          <WeeklyProgress />
        </div>
        
        <div className="mb-6">
          <SportBadges />
        </div>
      </div>
    </MainLayout>
  );
};

export default Sport;
