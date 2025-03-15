
import { useEffect, useState } from "react";
import { useUserData } from "@/context/userData";
import { Dumbbell, Activity } from "lucide-react";
import { format, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { fr } from "date-fns/locale";

interface ActivityEntry {
  date: Date;
  gymVisits: number;
  runningKm: number;
}

export function SportHistory() {
  const { userData } = useUserData();
  const [weeklyData, setWeeklyData] = useState<ActivityEntry[]>([]);
  
  // Simulation de données d'historique basée sur les totaux
  // Dans une vraie application, ces données proviendraient d'une base de données
  useEffect(() => {
    if (!userData.sportModule) return;
    
    const today = new Date();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
    
    // Créer des entrées pour les 7 derniers jours
    const entries: ActivityEntry[] = [];
    
    // Si nous avons une date de dernière activité, utilisons-la pour la simulation
    if (userData.sportModule.lastActivityDate) {
      const lastActivity = parseISO(userData.sportModule.lastActivityDate);
      
      // Répartir les activités sur plusieurs jours pour simuler un historique
      // Diviser le total par un nombre aléatoire pour chaque jour
      const totalGymVisits = userData.sportModule.totalGymVisits;
      const totalRunningKm = userData.sportModule.totalRunningKm;
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Répartir aléatoirement les activités
        const gymWeight = Math.random() * 0.5;
        const runningWeight = Math.random() * 0.5;
        
        entries.push({
          date,
          gymVisits: i === 0 ? userData.sportModule.weeklyGymVisits : Math.floor(totalGymVisits * gymWeight / 7),
          runningKm: i === 0 ? userData.sportModule.weeklyRunningKm : +(totalRunningKm * runningWeight / 7).toFixed(1)
        });
      }
    } else {
      // Si pas d'activité, juste créer des entrées vides
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        entries.push({
          date,
          gymVisits: 0,
          runningKm: 0
        });
      }
    }
    
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
        weeklyData.map((entry, index) => (
          <div 
            key={index}
            className={`p-3 rounded-md ${entry.gymVisits > 0 || entry.runningKm > 0 
              ? 'bg-gray-50 border border-gray-100' 
              : 'bg-gray-50/50 border border-gray-50'}`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">
                {format(entry.date, 'EEEE d MMMM', { locale: fr })}
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
        ))
      )}
    </div>
  );
}
