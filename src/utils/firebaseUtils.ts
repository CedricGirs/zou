import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserData } from '../types/userData';
import { toast } from '../hooks/use-toast';

export const loadUserDataFromFirestore = async (userId: string = 'guest', defaultData: UserData): Promise<UserData> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Existing user
      return userDoc.data() as UserData;
    } else {
      // New user, create document
      await setDoc(userDocRef, defaultData);
      return defaultData;
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    toast({
      title: "Error",
      description: "Unable to load your data. Using local data.",
      variant: "destructive",
    });
    
    // Try to use localStorage in case of error
    const savedData = localStorage.getItem('zouUserData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    
    return defaultData;
  }
};

export const saveUserDataToFirestore = async (userData: UserData): Promise<boolean> => {
  try {
    // Save to Firebase
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
    console.error("Error saving data:", error);
    toast({
      title: "Error",
      description: "Unable to sync your data with the server. Try again later.",
      variant: "destructive",
    });
    return false;
  }
};
