
import en from "./en";
import fr from "./fr";

interface Translations {
  [key: string]: Record<string, string>;
}

const translations: Translations = {
  en,
  fr,
};

export default translations;
export type TranslationKey =
  | "welcome"
  | "lifeGauges"
  | "dailyQuests"
  | "recentBadges"
  | "home"
  | "status"
  | "look"
  | "finances"
  | "skills"
  | "profile"
  | "settings"
  | "notifications"
  | "inventory"
  | "general"
  | "hero"
  | "name"
  | "age"
  | "level"
  | "experience"
  | "nextLevel"
  | "health"
  | "mana"
  | "stamina"
  | "strength"
  | "agility"
  | "intelligence"
  | "charisma"
  | "wisdom"
  | "luck"
  | "editProfile"
  | "save"
  | "cancel"
  | "moduleSettings"
  | "statusModule"
  | "lookModule"
  | "financeModule"
  | "sportModule"
  | "difficulty"
  | "easy"
  | "normal"
  | "hard"
  | "hardcore"
  | "appearance"
  | "body"
  | "hair"
  | "facialHair"
  | "eyes"
  | "skin"
  | "clothing"
  | "equip"
  | "unequip"
  | "money"
  | "bankBalance"
  | "income"
  | "expenses"
  | "netWorth"
  | "latestTransactions"
  | "transactionHistory"
  | "addTransaction"
  | "description"
  | "amount"
  | "type"
  | "incomeType"
  | "expenseType"
  | "food"
  | "rent"
  | "entertainment"
  | "salary"
  | "investments"
  | "other"
  | "exercise"
  | "sport"
  | "team"
  | "solo"
  | "training"
  | "competition"
  | "achievements"
  | "records"
  | "personalBests"
  | "sportDiscipline"
  | "distance"
  | "time"
  | "caloriesBurned"
  | "stepsTaken"
  | "hydrationLevel"
  | "sleepDuration"
  | "dailyGoals"
  | "weeklyGoals"
  | "monthlyGoals"
  | "challenges"
  | "badgesEarned"
  | "badgesProgress"
  | "viewAll"
  | "questName"
  | "questDescription"
  | "questReward"
  | "questStatus"
  | "questStart"
  | "questComplete"
  | "questAbandon"
  | "questProgress"
  | "badgeName"
  | "badgeDescription"
  | "badgeRarity"
  | "badgeDate"
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "settingsTitle"
  | "language"
  | "theme"
  | "account"
  | "privacy"
  | "notificationsSettings"
  | "termsOfService"
  | "privacyPolicy"
  | "logout"
  | "light"
  | "dark"
  | "system"
  | "enableNotifications"
  | "emailNotifications"
  | "pushNotifications"
  | "smsNotifications"
  | "notificationPreferences"
  | "notificationSound"
  | "vibration"
  | "notificationCategory"
  | "newFeatures"
  | "accountUpdates"
  | "marketing"
  | "securityAlerts"
  | "email"
  | "password"
  | "changePassword"
  | "updateEmail"
  | "deleteAccount"
  | "currentPassword"
  | "newPassword"
  | "confirmPassword"
  | "update"
  | "delete"
  | "confirmDeleteAccount"
  | "deleteAccountWarning"
  | "character"
  | "skillsTitle"
  | "skillName"
  | "skillDescription"
  | "skillLevel"
  | "skillProgress"
  | "skillTree"
  | "generalSkills"
  | "combatSkills"
  | "magicSkills"
  | "craftingSkills"
  | "socialSkills"
  | "skillPointsAvailable"
  | "investSkillPoints"
  | "skillRequirements"
  | "skillEffects"
  | "levelUp"
  | "skillMastery"
  | "skillPerks"
  | "skillUp"
  | "skillDown"
  | "skillReset"
  | "confirmSkillReset"
  | "skillResetWarning"
  | "kingdomTitle"
  | "kingdomSubtitle"
  | "kingdomLevel"
  | "objectsPlaced"
  | "lastSaved"
  | "autosave"
  | "saveKingdom"
  | "clearCanvas"
  | "confirmClear"
  | "cancel"
  | "building"
  | "decoration"
  | "road"
  | "medieval"
  | "roman"
  | "fantasy"
  | "selectAsset"
  | "confirm"
  | "savingGoal"
  | "achievement"
  | "milestone"
  | "contact"
  | "other"
  | "nameRequired"
  | "levelRequired"
  | "experienceRequired"
  | "kingdomStyle"
  | "kingdomTutorialText"
  | "addBuilding"
  | "addDecoration"
  | "addRoad"
  | "autosaveEnabled"
  | "changeStyle"
  | "buildingNameRequired"
  | "nameBuilding"
  | "title"
  | "enterBuildingName"
  | "buildingPurpose"
  | "productivityPen"
  | "productivityPenDesc"
  | "knowledgeTome"
  | "knowledgeTomeDesc"
  | "focusHelmet"
  | "focusHelmetDesc"
  | "comfortableShirt"
  | "comfortableShirtDesc"
  | "motivationGem"
  | "motivationGemDesc"
  | "experienceBoost"
  | "experienceBoostDesc"
  | "filterByRarity"
  | "all"
  | "weapons"
  | "armor"
  | "accessories"
  | "consumables"
  | "noItemsFound"
  | "tryDifferentFilter"
  | "equipped"
  | "quantity"
  | "use"
  | "questCompleted"
  | "dailyExerciseCompleted"
  | "newBadge"
  | "fashionistaUnlocked"
  | "systemUpdate"
  | "newFeaturesAdded"
  | "justNow"
  | "hoursAgo"
  | "yesterday"
  | "markAllAsRead"
  | "noNotifications"
  | "allCaughtUp"
  | "unread"
  | "earlier"
  | "appearanceDesc"
  | "darkMode"
  | "languageDesc"
  | "sound"
  | "soundDesc"
  | "gameSounds"
  | "privacyDesc"
  | "shareProgress"
  | "publicProfile"
  | "allowFriendRequests"
  | "badges"
  | "noBadges"
  | "heroName"
  | "notificationsModule"
  | "inventoryModule"
  | "settingsModule"
  | "height"
  | "monthlyIncome"
  | "fixedExpenses"
  | "availableForSavings" 
  | "monthsToReachGoal"
  | "expensesExceedIncome"
  | "monthlySummary"
  | "skillPoints"
  | "available"
  | "add"
  | "financeLevelUp"
  | "days"
  | "quest"
  | "reward"
  | "complete"
  | "completed"
  | "noQuestsToday"
  | "water" 
  | "energy"
  | "sleep"
  | "gym"
  | "sparring"
  | "study"
  | "equipment"
  | "mouth"
  | "train"
  | "work"
  | "invest"
  | "assets"
  | "debts"
  ;

export type Language = "en" | "fr";

