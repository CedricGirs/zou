
import { createContext, useState, useContext, ReactNode } from 'react';

// Define language options
export type Language = 'en' | 'fr';

// Translation dictionary
const translations = {
  en: {
    // Dashboard/Home
    welcome: 'Welcome back!',
    lifeGauges: 'Life Gauges',
    dailyQuests: 'Daily Quests',
    recentBadges: 'Recent Badges',
    
    // Navigation
    home: 'Home',
    status: 'Status',
    look: 'Look',
    finances: 'Finances',
    skills: 'Skills',
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    inventory: 'Inventory',
    
    // Status page
    statusTitle: 'Status',
    statusSubtitle: 'Track your educational progress and skill development',
    courses: 'Courses',
    languages: 'Languages',
    skills: 'Skills',
    addCourse: 'ADD COURSE',
    addLanguage: 'ADD LANGUAGE',
    addSkill: 'ADD SKILL',
    title: 'Title',
    enterTitle: 'Enter title...',
    deadline: 'Deadline',
    level: 'Level',
    selectLevel: 'Select level',
    progress: 'Progress',
    save: 'SAVE',
    cancel: 'CANCEL',
    success: 'Success',
    error: 'Error',
    itemAdded: 'Item has been added',
    titleRequired: 'Title is required',
    added: 'has been added',
    
    // Skills page
    skillsTitle: 'Skills',
    skillsSubtitle: 'Develop your skills and earn badges through achievements',
    skillTree: 'Skill Tree',
    badgesAchievements: 'Badges & Achievements',
    weapons: 'Weapons = Productivity',
    defense: 'Defense = Health',
    magic: 'Magic = Knowledge',
    unlock: 'UNLOCK',
    
    // Look page
    lookTitle: 'Look',
    lookSubtitle: 'Manage your wardrobe and outfit choices',
    addClothingItem: 'Add Clothing Item',
    lookModuleComing: 'Look module coming soon...',
    clothingSelection: 'Clothing Selection',
    weeklyOutfits: 'Weekly Outfits',
    validate: 'Validate Selection',
    regenerate: 'Regenerate',
    edit: 'Edit',
    finishEditing: 'Finish',
    selectClothes: 'Select clothes and click "Validate Selection" to generate outfits.',
    
    // Common
    level: 'LVL',
    xp: 'XP',
    menu: 'MENU',
    progress: 'Progress',
    certificate: 'Certificate verified',
    upload: 'UPLOAD',
    cert: 'CERT',
    uploadCertificate: 'Upload Certificate',
  },
  fr: {
    // Dashboard/Home
    welcome: 'Bon retour !',
    lifeGauges: 'Jauges de Vie',
    dailyQuests: 'Quêtes Quotidiennes',
    recentBadges: 'Badges Récents',
    
    // Navigation
    home: 'Accueil',
    status: 'Statut',
    look: 'Style',
    finances: 'Finances',
    skills: 'Compétences',
    profile: 'Profil',
    settings: 'Paramètres',
    notifications: 'Notifications',
    inventory: 'Inventaire',
    
    // Status page
    statusTitle: 'Statut',
    statusSubtitle: 'Suivez votre progression éducative et le développement de vos compétences',
    courses: 'Cours',
    languages: 'Langues',
    skills: 'Compétences',
    addCourse: 'AJOUTER COURS',
    addLanguage: 'AJOUTER LANGUE',
    addSkill: 'AJOUTER COMPÉTENCE',
    title: 'Titre',
    enterTitle: 'Entrez un titre...',
    deadline: 'Échéance',
    level: 'Niveau',
    selectLevel: 'Sélectionner un niveau',
    progress: 'Progression',
    save: 'ENREGISTRER',
    cancel: 'ANNULER',
    success: 'Succès',
    error: 'Erreur',
    itemAdded: 'L\'élément a été ajouté',
    titleRequired: 'Le titre est requis',
    added: 'a été ajouté',
    
    // Skills page
    skillsTitle: 'Compétences',
    skillsSubtitle: 'Développez vos compétences et gagnez des badges grâce à vos réalisations',
    skillTree: 'Arbre de Compétences',
    badgesAchievements: 'Badges et Réalisations',
    weapons: 'Armes = Productivité',
    defense: 'Défense = Santé',
    magic: 'Magie = Connaissance',
    unlock: 'DÉBLOQUER',
    
    // Look page
    lookTitle: 'Style',
    lookSubtitle: 'Gérez votre garde-robe et vos tenues',
    addClothingItem: 'Ajouter un Vêtement',
    lookModuleComing: 'Module Style bientôt disponible...',
    clothingSelection: 'Sélection des vêtements',
    weeklyOutfits: 'Tenues hebdomadaires',
    validate: 'Valider ma sélection',
    regenerate: 'Régénérer',
    edit: 'Modifier',
    finishEditing: 'Terminer',
    selectClothes: 'Veuillez sélectionner des vêtements et cliquer sur "Valider ma sélection" pour générer des tenues.',
    
    // Common
    level: 'NIV',
    xp: 'XP',
    menu: 'MENU',
    progress: 'Progression',
    certificate: 'Certificat vérifié',
    upload: 'TÉLÉCHARGER',
    cert: 'CERT',
    uploadCertificate: 'Télécharger le Certificat',
  }
};

// Create the context
type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  // Translation function
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
