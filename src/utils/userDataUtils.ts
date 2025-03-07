
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from '@/hooks/use-toast';
import { UserData } from '@/types/UserDataTypes';
import { playSound } from '@/utils/audioUtils';

// Sauvegarder les données utilisateur dans le stockage local et Firebase
export const saveUserData = async (userData: UserData) => {
  // Mettre à jour localement d'abord
  localStorage.setItem('zouUserData', JSON.stringify(userData));
  
  try {
    // Mise à jour dans Firebase
    const userDocRef = doc(db, 'users', userData.uid);
    
    // Convertir UserData en objet sans méthodes
    const dataToSave = {
      uid: userData.uid,
      heroProfile: userData.heroProfile,
      statusModule: userData.statusModule,
      lookModule: userData.lookModule,
      financeModule: userData.financeModule,
      statusItems: userData.statusItems,
      skills: userData.skills,
      lastSyncTimestamp: new Date().toISOString(), // Ajouter un timestamp de synchro
    };
    
    await updateDoc(userDocRef, dataToSave).catch(async (error) => {
      // Si le document n'existe pas, le créer
      if (error.code === 'not-found') {
        await setDoc(userDocRef, dataToSave);
        return true;
      }
      throw error;
    });
    
    console.log("Données synchronisées avec Firebase:", new Date().toISOString());
    return true;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des données:", error);
    toast({
      title: "Erreur",
      description: "Impossible de synchroniser vos données avec le serveur. Réessayez plus tard.",
      variant: "destructive",
    });
    return false;
  }
};

// Charger les données utilisateur depuis Firebase ou le stockage local
export const loadUserData = async (uid: string = 'guest'): Promise<{ userData: UserData | null; error: boolean }> => {
  console.log("Chargement des données pour l'utilisateur:", uid);
  
  try {
    // Essayer d'abord de charger depuis Firebase
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Utilisateur existant
      console.log("Données chargées depuis Firebase");
      const firebaseData = userDoc.data() as UserData;
      
      // Mettre à jour le stockage local avec les données les plus récentes
      localStorage.setItem('zouUserData', JSON.stringify(firebaseData));
      
      return { userData: firebaseData, error: false };
    } else {
      // Nouvel utilisateur ou pas de connexion, vérifier les données locales
      const savedData = localStorage.getItem('zouUserData');
      if (savedData) {
        // Si nous avons des données locales, les utiliser et les synchroniser
        const localData = JSON.parse(savedData) as UserData;
        console.log("Données chargées depuis le stockage local");
        
        // Essayer de créer le document utilisateur dans Firebase
        try {
          await setDoc(userDocRef, {
            ...localData,
            uid: uid, // S'assurer que l'UID est correct
            lastSyncTimestamp: new Date().toISOString(),
          });
          console.log("Données locales synchronisées avec Firebase");
        } catch (syncError) {
          console.error("Erreur lors de la synchronisation initiale:", syncError);
        }
        
        return { userData: localData, error: false };
      }
      
      console.log("Aucune donnée trouvée, renvoie null");
      return { userData: null, error: false };
    }
  } catch (error) {
    console.error("Erreur lors du chargement des données:", error);
    toast({
      title: "Erreur",
      description: "Impossible de charger vos données. Utilisation des données locales.",
      variant: "destructive",
    });
    
    // Utiliser les données par défaut ou du localStorage en cas d'erreur
    const savedData = localStorage.getItem('zouUserData');
    if (savedData) {
      return { userData: JSON.parse(savedData), error: true };
    }
    return { userData: null, error: true };
  }
};

// Jouer un son lors de la mise à jour du profil héros
export const playUpdateSound = () => {
  playSound('click');
};

// Mettre en cache localement une valeur spécifique avec un timestamp d'expiration
export const cacheLocalData = (key: string, data: any, expirationMinutes: number = 60) => {
  const item = {
    value: data,
    expiry: new Date().getTime() + expirationMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

// Récupérer une valeur mise en cache, renvoie null si expirée
export const getLocalCachedData = (key: string) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  
  const item = JSON.parse(itemStr);
  const now = new Date().getTime();
  
  if (now > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  
  return item.value;
};
