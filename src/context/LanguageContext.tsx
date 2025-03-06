
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
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this item?',
    itemDeleted: 'Item has been deleted',
    
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
    certificate: 'Certificate verified',
    upload: 'UPLOAD',
    cert: 'CERT',
    uploadCertificate: 'Upload Certificate',
    
    // Onboarding
    step: 'STEP',
    back: 'BACK',
    next: 'NEXT',
    finish: 'FINISH',
    
    // Hero Profile
    createHeroProfile: 'Create Your Hero Profile',
    createHeroProfileDesc: 'Customize your digital hero to begin your journey',
    username: 'Hero Username',
    enterUsername: 'Enter your hero name...',
    heroAvatar: 'Your Hero Avatar',
    generateRandomAvatar: 'Generate random avatar',
    avatarUpdated: 'Avatar Updated',
    newAvatarGenerated: 'A new hero appearance has been generated!',
    usernameRequired: 'Please enter a username for your hero',
    priority: 'Focus Priority',
    statusPriority: 'Education & Skills',
    lookPriority: 'Style & Fitness',
    financesPriority: 'Savings & Budget',
    balanced: 'Balanced',
    balancedPriority: 'All areas equally',
    ambitionLevel: 'Ambition Level',
    casual: 'Casual',
    casualDesc: 'Relaxed pace, fewer reminders',
    pro: 'Pro',
    proDesc: 'Balanced challenges and goals',
    hardcore: 'Hardcore',
    hardcoreDesc: 'Intense challenges, strict tracking',
    heroClass: 'Hero Class',
    warrior: 'Warrior',
    warriorDesc: 'Focus on productivity and action',
    mage: 'Mage',
    mageDesc: 'Focus on knowledge and learning',
    healer: 'Healer',
    healerDesc: 'Focus on wellness and balance',
    heroGrade: 'Current Grade',
    newborn: 'Newborn',
    gradeDescription: 'Complete quests and gain XP to evolve your hero grade',
    
    // Module steps
    statusModule: 'Status Module Setup',
    statusModuleDesc: 'Configure your educational and skill development tracking',
    lookModule: 'Look Module Setup',
    lookModuleDesc: 'Set up your wardrobe and style preferences',
    financeModule: 'Finance Module Setup',
    financeModuleDesc: 'Configure your budget and financial goals',
    tutorial: 'Interactive Tutorial',
    tutorialDesc: 'Learn how to use Zou for maximum benefits',
    comingSoon: 'This step will be available in the next update!',
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
    delete: 'Supprimer',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
    itemDeleted: 'L\'élément a été supprimé',
    
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
    certificate: 'Certificat vérifié',
    upload: 'TÉLÉCHARGER',
    cert: 'CERT',
    uploadCertificate: 'Télécharger le Certificat',
    
    // Onboarding
    step: 'ÉTAPE',
    back: 'RETOUR',
    next: 'SUIVANT',
    finish: 'TERMINER',
    
    // Hero Profile
    createHeroProfile: 'Créez Votre Profil de Héros',
    createHeroProfileDesc: 'Personnalisez votre héros numérique pour commencer votre voyage',
    username: 'Pseudo du Héros',
    enterUsername: 'Entrez votre nom de héros...',
    heroAvatar: 'Votre Avatar de Héros',
    generateRandomAvatar: 'Générer un avatar aléatoire',
    avatarUpdated: 'Avatar Mis à Jour',
    newAvatarGenerated: 'Une nouvelle apparence de héros a été générée !',
    usernameRequired: 'Veuillez entrer un pseudo pour votre héros',
    priority: 'Priorité de Focus',
    statusPriority: 'Éducation & Compétences',
    lookPriority: 'Style & Fitness',
    financesPriority: 'Épargne & Budget',
    balanced: 'Équilibré',
    balancedPriority: 'Tous les domaines également',
    ambitionLevel: 'Niveau d\'Ambition',
    casual: 'Détendu',
    casualDesc: 'Rythme relaxé, moins de rappels',
    pro: 'Pro',
    proDesc: 'Défis et objectifs équilibrés',
    hardcore: 'Hardcore',
    hardcoreDesc: 'Défis intenses, suivi strict',
    heroClass: 'Classe de Héros',
    warrior: 'Guerrier',
    warriorDesc: 'Focus sur la productivité et l\'action',
    mage: 'Mage',
    mageDesc: 'Focus sur le savoir et l\'apprentissage',
    healer: 'Soigneur',
    healerDesc: 'Focus sur le bien-être et l\'équilibre',
    heroGrade: 'Grade Actuel',
    newborn: 'Nouveau-Né',
    gradeDescription: 'Complétez des quêtes et gagnez de l\'XP pour faire évoluer votre grade de héros',
    
    // Module steps
    statusModule: 'Configuration du Module Statut',
    statusModuleDesc: 'Configurez le suivi de votre développement éducatif et de compétences',
    lookModule: 'Configuration du Module Style',
    lookModuleDesc: 'Configurez votre garde-robe et vos préférences de style',
    financeModule: 'Configuration du Module Finances',
    financeModuleDesc: 'Configurez votre budget et vos objectifs financiers',
    tutorial: 'Tutoriel Interactif',
    tutorialDesc: 'Apprenez à utiliser Zou pour en tirer le maximum d\'avantages',
    comingSoon: 'Cette étape sera disponible dans la prochaine mise à jour !',
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
