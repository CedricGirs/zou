import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from '@/hooks/use-toast';
import { UserData } from '@/types/UserDataTypes';
import { playSound } from '@/utils/audioUtils';

// Save user data to local storage and Firebase
export const saveUserData = async (userData: UserData) => {
  // Local update
  localStorage.setItem('zouUserData', JSON.stringify(userData));
  
  try {
    // Update in Firebase
    const userDocRef = doc(db, 'users', userData.uid);
    
    // Convert UserData to a plain object without methods
    const dataToSave = {
      uid: userData.uid,
      heroProfile: userData.heroProfile,
      statusModule: userData.statusModule,
      lookModule: userData.lookModule,
      financeModule: userData.financeModule,
      statusItems: userData.statusItems,
      skills: userData.skills,
    };
    
    await updateDoc(userDocRef, dataToSave);
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

// Load user data from Firebase or local storage
export const loadUserData = async (): Promise<{ userData: UserData | null; error: boolean }> => {
  try {
    // For now, we're using a "guest" ID for the user
    const userDocRef = doc(db, 'users', 'guest');
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Existing user
      return { userData: userDoc.data() as UserData, error: false };
    } else {
      // New user, create document
      const savedData = localStorage.getItem('zouUserData');
      if (savedData) {
        // If we have local data, use it
        return { userData: JSON.parse(savedData), error: false };
      }
      return { userData: null, error: false };
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    toast({
      title: "Erreur",
      description: "Impossible de charger vos données. Utilisation des données locales.",
      variant: "destructive",
    });
    
    // Use default data or from localStorage in case of error
    const savedData = localStorage.getItem('zouUserData');
    if (savedData) {
      return { userData: JSON.parse(savedData), error: true };
    }
    return { userData: null, error: true };
  }
};

// Play sound when updating hero profile
export const playUpdateSound = () => {
  playSound('click');
};
