
import { useEffect, useState } from "react";
import { useUserData } from "@/context/userData";
import { Dumbbell, Activity } from "lucide-react";
import { format, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

interface ActivityEntry {
  date: Date;
  gymVisits: number;
  runningKm: number;
}

export function SportHistory() {
  const { userData } = useUserData();
  const [weeklyData, setWeeklyData] = useState<ActivityEntry[]>([]);
  
  // Use actual daily activities data if available or generate sample data
  useEffect(() => {
    if (!userData.sportModule) return;
    
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });
    
    // Create entries for each day of current week
    const daysInWeek = eachDayOfInterval({
      start: startOfCurrentWeek,
      end: endOfCurrentWeek
    });
    
    const entries: ActivityEntry[] = daysInWeek.map(day => {
      // Check if we have actual data for this day in dailyActivities
      if (userData.sportModule.dailyActivities) {
        const dateKey = format(day, 'yyyy-MM-dd');
        const dayActivity = userData.sportModule.dailyActivities[dateKey];
        
        if (dayActivity) {
          return {
            date: day,
            gymVisits: dayActivity.gymVisits || 0,
            runningKm: dayActivity.runningKm || 0
          };
        }
      }
      
      // If we're showing today and have no daily data, show the weekly totals
      if (isSameDay(day, today)) {
        return {
          date: day,
          gymVisits: userData.sportModule.weeklyGymVisits || 0,
          runningKm: userData.sportModule.weeklyRunningKm || 0
        };
      }
      
      // For days without data, create empty entries
      return {
        date: day,
        gymVisits: 0,
        runningKm: 0
      };
    });
    
    setWeeklyData(entries);
  }, [userData.sportModule]);
  
  if (!userData.sportModule) {
    return <div>Aucune donnée disponible</div>;
  }
  
  return (
    <div className="space-y-2">
      {weeklyData.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Pas d'activités enregistrées récemment
        </div>
      ) : (
        weeklyData.map((entry, index) => {
          const isToday = isSameDay(entry.date, new Date());
          
          return (
            <div 
              key={index}
              className={`p-3 rounded-md ${
                isToday 
                  ? 'bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800' 
                  : entry.gymVisits > 0 || entry.runningKm > 0 
                    ? 'bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700' 
                    : 'bg-gray-50/50 dark:bg-gray-800/30 border border-gray-50 dark:border-gray-800'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                  {format(entry.date, 'EEEE d MMMM', { locale: fr })}
                  {isToday && ' (Aujourd\'hui)'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(entry.date, 'dd/MM/yyyy')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {entry.gymVisits > 0 && (
                  <div className="flex items-center text-sm">
                    <Dumbbell size={14} className="mr-1 text-purple-500" />
                    <span>{entry.gymVisits} visite(s)</span>
                  </div>
                )}
                {entry.runningKm > 0 && (
                  <div className="flex items-center text-sm">
                    <Activity size={14} className="mr-1 text-blue-500" />
                    <span>{entry.runningKm} km</span>
                  </div>
                )}
                {entry.gymVisits === 0 && entry.runningKm === 0 && (
                  <div className="text-sm text-muted-foreground col-span-2">
                    Pas d'activité ce jour
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
