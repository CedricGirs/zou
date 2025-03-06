
import { useUserData } from "../context/UserDataContext";

/**
 * Hook pour synchroniser les données utilisateur entre les différentes sections
 * lorsque des mises à jour sont effectuées dans le profil
 */
export const useSyncUserData = () => {
  const userData = useUserData();
  return userData;
};
