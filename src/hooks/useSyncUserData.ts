
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserData } from '@/types';
import { toast } from '@/hooks/use-toast';
import { saveUserData, loadUserData, clearFirestoreCache } from '@/utils/userDataUtils';

/**
 * Hook personnalisé pour synchroniser les données utilisateur avec Firebase
 * et gérer la persistance locale
 */
export const useSyncUserData = (
  uid: string,
  userData: UserData,
  setUserData: (data: UserData) => void
) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Partial<UserData> | null>(null);
  
  // Surveiller l'état de la connexion
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connexion rétablie",
        description: "Synchronisation des données en cours...",
      });
      
      // Synchroniser les changements en attente
      if (pendingChanges) {
        synchronizeData();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connexion perdue",
        description: "Les modifications seront enregistrées localement et synchronisées lors de la reconnexion.",
        variant: "destructive",
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingChanges]);
  
  // Configurer un écouteur en temps réel pour les mises à jour de Firebase
  useEffect(() => {
    if (!uid) return;
    
    console.log("Setting up Firebase real-time listener for user:", uid);
    
    // S'abonner aux mises à jour en temps réel de Firebase
    const userDocRef = doc(db, 'users', uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const remoteData = docSnapshot.data() as UserData;
          
          // Vérifier si les données distantes sont plus récentes
          const localDataStr = localStorage.getItem('zouUserData');
          if (localDataStr) {
            const localData = JSON.parse(localDataStr);
            // Logique de fusion si nécessaire
            // Pour l'instant, on prend les données distantes si elles existent
            console.log("Données reçues de Firebase:", remoteData);
            setUserData(remoteData);
            localStorage.setItem('zouUserData', JSON.stringify(remoteData));
            setLastSyncTime(new Date());
          }
        }
      },
      (error) => {
        console.error("Erreur lors de l'écoute des modifications:", error);
        toast({
          title: "Erreur de synchronisation",
          description: "Impossible de recevoir les mises à jour en temps réel. Vérifiez votre connexion.",
          variant: "destructive",
        });
      }
    );
    
    // Nettoyage de l'écouteur
    return () => {
      console.log("Cleaning up Firebase listener");
      unsubscribe();
    };
  }, [uid, setUserData]);
  
  // Fonction pour synchroniser les données avec Firebase
  const synchronizeData = async () => {
    if (!isOnline || !userData || !userData.uid) {
      // Enregistrer localement si hors ligne
      localStorage.setItem('zouUserData', JSON.stringify(userData));
      setPendingChanges(userData);
      return false;
    }
    
    setIsSyncing(true);
    
    try {
      await saveUserData(userData);
      setLastSyncTime(new Date());
      setPendingChanges(null);
      setIsSyncing(false);
      return true;
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
      setIsSyncing(false);
      setPendingChanges(userData);
      return false;
    }
  };
  
  // Fonction pour forcer le rafraîchissement des données
  const refreshData = async () => {
    setIsSyncing(true);
    
    try {
      // Vider le cache Firestore
      await clearFirestoreCache();
      
      // Recharger les données utilisateur
      const { userData: freshData, error } = await loadUserData(uid);
      if (freshData && !error) {
        setUserData(freshData);
        setLastSyncTime(new Date());
        toast({
          title: "Données rafraîchies",
          description: "Les données ont été rechargées avec succès.",
        });
      }
      
      setIsSyncing(false);
      return !error;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des données:", error);
      setIsSyncing(false);
      toast({
        title: "Erreur de rafraîchissement",
        description: "Impossible de rafraîchir les données. Réessayez plus tard.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    isOnline,
    isSyncing,
    lastSyncTime,
    synchronizeData,
    refreshData,
    hasPendingChanges: !!pendingChanges
  };
};
