
import { useState } from "react";
import { format, subWeeks, startOfWeek, endOfWeek, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useUserData } from "@/context/userData";
import { Button } from "@/components/ui/button";
import { ChartBar, ArrowLeft, ArrowRight, History } from "lucide-react";
import { 
  Card,
  CardContent 
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PreviousWeeksStats = () => {
  const { userData } = useUserData();
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0); // 0 = current week, 1 = last week, etc.

  if (!userData.sportModule) return null;

  const goToPreviousWeek = () => {
    setSelectedWeekOffset(prev => prev + 1);
  };

  const goToNextWeek = () => {
    if (selectedWeekOffset > 0) {
      setSelectedWeekOffset(prev => prev - 1);
    }
  };

  // Calculate the start and end of the selected week
  const today = new Date();
  const startOfSelectedWeek = startOfWeek(subWeeks(today, selectedWeekOffset), { weekStartsOn: 1 });
  const endOfSelectedWeek = endOfWeek(startOfSelectedWeek, { weekStartsOn: 1 });

  // Format dates for display
  const weekRangeDisplay = `${format(startOfSelectedWeek, 'd MMM', { locale: fr })} - ${format(endOfSelectedWeek, 'd MMM yyyy', { locale: fr })}`;

  // Create artificial data for past weeks - in a real app, this would come from a database
  const generateWeekData = (weekOffset: number) => {
    // Use seed based on week offset for consistent "random" values
    const seed = weekOffset * 100;
    
    // Calculate a baseline that decreases as we go further back in time
    const baselineGym = Math.max(0, userData.sportModule.totalGymVisits - (weekOffset * 2));
    const baselineRunning = Math.max(0, userData.sportModule.totalRunningKm - (weekOffset * 5));
    
    // Scale factor decreases as we go back in time (simulating progress)
    const scaleFactor = Math.max(0.3, 1 - (weekOffset * 0.15));
    
    const weekData = [];
    
    // Generate data for each day of the week
    for (let i = 0; i < 7; i++) {
      const day = addDays(startOfSelectedWeek, i);
      const dayValue = ((seed + i) % 100) / 100; // Pseudo-random value between 0-1
      
      // Only add activity on some days (more likely for recent weeks)
      const hasGymActivity = dayValue > (0.5 + (weekOffset * 0.05));
      const hasRunningActivity = dayValue > (0.6 + (weekOffset * 0.05));
      
      weekData.push({
        date: day,
        gymVisits: hasGymActivity ? Math.floor(dayValue + 0.5) : 0, // 0 or 1 visit
        runningKm: hasRunningActivity ? +(dayValue * 5 * scaleFactor).toFixed(1) : 0,
      });
    }
    
    // Calculate totals
    const weekTotals = {
      totalGymVisits: weekData.reduce((sum, day) => sum + day.gymVisits, 0),
      totalRunningKm: +(weekData.reduce((sum, day) => sum + day.runningKm, 0)).toFixed(1),
      // For current week, use the real data
      ...(weekOffset === 0 ? {
        totalGymVisits: userData.sportModule.weeklyGymVisits,
        totalRunningKm: userData.sportModule.weeklyRunningKm,
      } : {})
    };
    
    return { days: weekData, totals: weekTotals };
  };

  const weekData = generateWeekData(selectedWeekOffset);

  // Calculate completion percentages
  const gymCompletionPercent = Math.min(100, (weekData.totals.totalGymVisits / userData.sportModule.weeklyGymTarget) * 100);
  const runningCompletionPercent = Math.min(100, (weekData.totals.totalRunningKm / userData.sportModule.weeklyRunningTarget) * 100);

  // Get color based on completion
  const getCompletionColor = (percent: number) => {
    if (percent >= 100) return "bg-green-500";
    if (percent >= 75) return "bg-lime-500";
    if (percent >= 50) return "bg-yellow-500";
    if (percent >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="mt-6 space-y-4">
      <Button 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={() => setSelectedWeekOffset(prev => prev === 0 ? 1 : 0)}
      >
        <History size={16} />
        {selectedWeekOffset === 0 ? "Voir les statistiques des semaines passées" : "Actuellement en mode historique"}
      </Button>

      {selectedWeekOffset > 0 && (
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToPreviousWeek}
                className="h-8 px-2"
              >
                <ArrowLeft size={16} />
              </Button>
              
              <h3 className="font-semibold text-center">
                {selectedWeekOffset === 0 
                  ? "Cette semaine" 
                  : selectedWeekOffset === 1 
                    ? "Semaine dernière" 
                    : `Il y a ${selectedWeekOffset} semaines`}
                <div className="text-sm font-normal text-muted-foreground">{weekRangeDisplay}</div>
              </h3>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToNextWeek}
                disabled={selectedWeekOffset === 0}
                className="h-8 px-2"
              >
                <ArrowRight size={16} />
              </Button>
            </div>

            {/* Week Stats Summary */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Musculation</div>
                <div className="text-2xl font-bold">{weekData.totals.totalGymVisits}</div>
                <div className="text-xs text-muted-foreground">sur {userData.sportModule.weeklyGymTarget} visites</div>
                
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getCompletionColor(gymCompletionPercent)}`}
                    style={{ width: `${gymCompletionPercent}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Course</div>
                <div className="text-2xl font-bold">{weekData.totals.totalRunningKm} km</div>
                <div className="text-xs text-muted-foreground">sur {userData.sportModule.weeklyRunningTarget} km</div>
                
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getCompletionColor(runningCompletionPercent)}`}
                    style={{ width: `${runningCompletionPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Gamified Graph */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-1">
                <ChartBar size={14} />
                Activités de la semaine
              </h4>
              
              <div className="flex items-end h-32 gap-1 mb-1">
                <TooltipProvider>
                  {weekData.days.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-1">
                      {/* Gym bar */}
                      {day.gymVisits > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="w-full bg-purple-500 rounded-t-sm"
                              style={{ height: `${day.gymVisits * 25}%` }}
                            ></div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{day.gymVisits} visite(s) musculation</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      
                      {/* Running bar */}
                      {day.runningKm > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className="w-full bg-blue-500 rounded-t-sm"
                              style={{ height: `${day.runningKm * 5}%` }}
                            ></div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{day.runningKm} km course</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  ))}
                </TooltipProvider>
              </div>
              
              {/* X-axis days */}
              <div className="flex text-xs text-muted-foreground">
                {weekData.days.map((day, index) => (
                  <div key={index} className="flex-1 text-center">
                    {format(day.date, 'EEE', { locale: fr })}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PreviousWeeksStats;
