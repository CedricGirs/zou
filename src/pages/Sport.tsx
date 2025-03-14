
import MainLayout from "@/components/layout/MainLayout";
import SportHeader from "@/components/sport/SportHeader";
import { ActivityTracker } from "@/components/sport/activity";
import WeeklyProgress from "@/components/sport/WeeklyProgress";
import SportBadges from "@/components/sport/SportBadges";

const Sport = () => {
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
