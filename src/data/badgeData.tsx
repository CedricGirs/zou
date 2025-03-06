
import React from 'react';
import { Badge } from '../types/badge';
import { 
  BookOpen, Globe, GraduationCap, MessageSquare, Brain, 
  Shirt, Dumbbell, Sparkles, Scissors, Timer,
  DollarSign, Calculator, PiggyBank, Wallet, TrendingDown,
  Zap, Award, Star, Users, Battery,
  Calendar, Sunrise, Droplet, Heart, Book,
  Trophy, Gamepad, Palette, Gift, Share2,
  Coffee, Repeat, AlertTriangle, Timer1, Package,
  UserPlus, MessageCircle, UserCheck, ThumbsUp, UsersRound,
  Code, FileSpreadsheet, Wrench, Utensils, HeartPulse,
  Ghost, Snowflake, Sparkle, Sun, CheckCircle2
} from 'lucide-react';

export const badgeData: Badge[] = [
  // 📚 Statut (Études/Compétences)
  { 
    id: "polyglot", 
    icon: <Globe size={16} />, 
    name: "Polyglot", 
    description: "Reach C1 level in 3 languages", 
    rarity: "legendary", 
    unlocked: false,
    category: "status"
  },
  { 
    id: "graduate", 
    icon: <GraduationCap size={16} />, 
    name: "Graduate", 
    description: "Complete 5 certified courses", 
    rarity: "rare", 
    unlocked: true,
    unlockedDate: "2023-06-15T14:30:00Z",
    category: "status"
  },
  { 
    id: "speaker", 
    icon: <MessageSquare size={16} />, 
    name: "Speaker", 
    description: "Successfully deliver 10 presentations", 
    rarity: "epic", 
    unlocked: false,
    category: "status"
  },
  { 
    id: "negotiator", 
    icon: <Users size={16} />, 
    name: "Negotiator", 
    description: "Reach level 10 in Negotiation skill", 
    rarity: "rare", 
    unlocked: false,
    category: "status"
  },
  { 
    id: "elephant-memory", 
    icon: <Brain size={16} />, 
    name: "Elephant Memory", 
    description: "Memorize 100 flashcards in 1 week", 
    rarity: "epic", 
    unlocked: false,
    category: "status"
  },
  
  // 👗 Look (Style/Sport)
  { 
    id: "minimalist", 
    icon: <Shirt size={16} />, 
    name: "Minimalist", 
    description: "Validate a 16-piece capsule wardrobe", 
    rarity: "uncommon", 
    unlocked: true,
    unlockedDate: "2023-05-10T09:15:00Z",
    category: "look"
  },
  { 
    id: "fashionista", 
    icon: <Sparkles size={16} />, 
    name: "Fashionista", 
    description: "Create 50 unique outfit combinations", 
    rarity: "rare", 
    unlocked: false,
    category: "look"
  },
  { 
    id: "marathon-runner", 
    icon: <Timer size={16} />, 
    name: "Marathon Runner", 
    description: "Run 100km in 1 month", 
    rarity: "epic", 
    unlocked: false,
    category: "look"
  },
  { 
    id: "hercules", 
    icon: <Dumbbell size={16} />, 
    name: "Hercules", 
    description: "Complete 100 workout sessions", 
    rarity: "epic", 
    unlocked: false,
    category: "look"
  },
  { 
    id: "hairstyle-pro", 
    icon: <Scissors size={16} />, 
    name: "Hairstyle Pro", 
    description: "6 months of haircut reminders respected", 
    rarity: "uncommon", 
    unlocked: false,
    category: "look"
  },
  
  // 💰 Finances
  { 
    id: "saver", 
    icon: <PiggyBank size={16} />, 
    name: "Saver", 
    description: "Reach €10,000 in savings", 
    rarity: "epic", 
    unlocked: false,
    category: "finances"
  },
  { 
    id: "financial-minimalist", 
    icon: <Wallet size={16} />, 
    name: "Financial Minimalist", 
    description: "3 months without impulse purchases", 
    rarity: "rare", 
    unlocked: false,
    category: "finances"
  },
  { 
    id: "investor", 
    icon: <DollarSign size={16} />, 
    name: "Investor", 
    description: "Diversify in 3 different assets", 
    rarity: "rare", 
    unlocked: true,
    unlockedDate: "2023-04-10T16:45:00Z",
    category: "finances"
  },
  { 
    id: "budget-master", 
    icon: <Calculator size={16} />, 
    name: "Budget Master", 
    description: "6 months without exceeding your budget", 
    rarity: "epic", 
    unlocked: false,
    category: "finances"
  },
  { 
    id: "anti-waste", 
    icon: <TrendingDown size={16} />, 
    name: "Anti-Waste", 
    description: "Reduce superfluous expenses by 30%", 
    rarity: "rare", 
    unlocked: false,
    category: "finances"
  },
  
  // 🎮 Gamification
  { 
    id: "pomodoro-master", 
    icon: <Timer size={16} />, 
    name: "Pomodoro Master", 
    description: "Complete 100 Pomodoro sessions", 
    rarity: "uncommon", 
    unlocked: true,
    unlockedDate: "2023-03-22T11:20:00Z",
    category: "gamification"
  },
  { 
    id: "resilient", 
    icon: <Award size={16} />, 
    name: "Resilient", 
    description: "Complete the quest '1 month without social media'", 
    rarity: "epic", 
    unlocked: false,
    category: "gamification"
  },
  { 
    id: "collector", 
    icon: <Star size={16} />, 
    name: "Collector", 
    description: "Unlock 75% of skills in the skill tree", 
    rarity: "legendary", 
    unlocked: false,
    category: "gamification"
  },
  { 
    id: "social-boss", 
    icon: <Users size={16} />, 
    name: "Social Boss", 
    description: "Maintain Social gauge at 100% for 7 days", 
    rarity: "rare", 
    unlocked: false,
    category: "gamification"
  },
  { 
    id: "infinite-energy", 
    icon: <Battery size={16} />, 
    name: "Infinite Energy", 
    description: "Reach 90% energy for 30 days", 
    rarity: "epic", 
    unlocked: false,
    category: "gamification"
  },
  
  // ⏳ Défis Quotidiens
  { 
    id: "gold-streak", 
    icon: <Calendar size={16} />, 
    name: "Gold Streak", 
    description: "100 consecutive days of connection", 
    rarity: "legendary", 
    unlocked: false,
    category: "daily"
  },
  { 
    id: "early-bird", 
    icon: <Sunrise size={16} />, 
    name: "Early Bird", 
    description: "Wake up before 7am for 21 days", 
    rarity: "rare", 
    unlocked: false,
    category: "daily"
  },
  { 
    id: "perfect-hygiene", 
    icon: <Droplet size={16} />, 
    name: "Perfect Hygiene", 
    description: "30 days without forgetting daily shower", 
    rarity: "uncommon", 
    unlocked: true,
    unlockedDate: "2023-07-05T08:30:00Z",
    category: "daily"
  },
  { 
    id: "zen", 
    icon: <Heart size={16} />, 
    name: "Zen", 
    description: "Meditate 10 min/day for 1 month", 
    rarity: "rare", 
    unlocked: false,
    category: "daily"
  },
  { 
    id: "bookworm", 
    icon: <Book size={16} />, 
    name: "Bookworm", 
    description: "Read 50 pages/day for 2 weeks", 
    rarity: "rare", 
    unlocked: true,
    unlockedDate: "2023-02-18T19:45:00Z",
    category: "daily"
  },
  
  // 🏆 Récompenses Spéciales
  { 
    id: "legend", 
    icon: <Trophy size={16} />, 
    name: "Legend", 
    description: "Reach level 99", 
    rarity: "legendary", 
    unlocked: false,
    category: "special"
  },
  { 
    id: "ultimate-gamer", 
    icon: <Gamepad size={16} />, 
    name: "Ultimate Gamer", 
    description: "Complete all quests in the game", 
    rarity: "legendary", 
    unlocked: false,
    category: "special"
  },
  { 
    id: "pixel-perfect", 
    icon: <Palette size={16} />, 
    name: "Pixel Perfect", 
    description: "Fully customize your pixel art avatar", 
    rarity: "epic", 
    unlocked: false,
    category: "special"
  },
  { 
    id: "patron", 
    icon: <Gift size={16} />, 
    name: "Patron", 
    description: "Support the app via an in-app purchase", 
    rarity: "uncommon", 
    unlocked: false,
    category: "special"
  },
  { 
    id: "ambassador", 
    icon: <Share2 size={16} />, 
    name: "Ambassador", 
    description: "Refer 5 friends who reach level 10", 
    rarity: "rare", 
    unlocked: false,
    category: "special"
  },
  
  // 🎲 Humour/Références Gaming
  { 
    id: "caffeine-addict", 
    icon: <Coffee size={16} />, 
    name: "Caffeine Addict", 
    description: "Drink 100 coffees (Energy gauge boosted)", 
    rarity: "uncommon", 
    unlocked: true,
    unlockedDate: "2023-01-30T10:15:00Z",
    category: "humor"
  },
  { 
    id: "npc-life", 
    icon: <Repeat size={16} />, 
    name: "NPC Life", 
    description: "Repeat the same routine for 7 days straight 😅", 
    rarity: "uncommon", 
    unlocked: false,
    category: "humor"
  },
  { 
    id: "glitch", 
    icon: <AlertTriangle size={16} />, 
    name: "Glitch", 
    description: "Forget to fill a gauge for 48h", 
    rarity: "common", 
    unlocked: true,
    unlockedDate: "2023-08-12T22:30:00Z",
    category: "humor"
  },
  { 
    id: "speedrun", 
    icon: <Timer1 size={16} />, 
    name: "Speedrun", 
    description: "Reach level 20 in 30 days", 
    rarity: "epic", 
    unlocked: false,
    category: "humor"
  },
  { 
    id: "loot-queen", 
    icon: <Package size={16} />, 
    name: "Loot Queen", 
    description: "Win 10 random rewards in 1 day", 
    rarity: "rare", 
    unlocked: false,
    category: "humor"
  },
  
  // 🌍 Social/Communauté
  { 
    id: "team-player", 
    icon: <UserPlus size={16} />, 
    name: "Team Player", 
    description: "Participate in 10 community challenges", 
    rarity: "uncommon", 
    unlocked: false,
    category: "social"
  },
  { 
    id: "streamer", 
    icon: <MessageCircle size={16} />, 
    name: "Streamer", 
    description: "Share 50 progress updates on social networks", 
    rarity: "rare", 
    unlocked: false,
    category: "social"
  },
  { 
    id: "mentor", 
    icon: <UserCheck size={16} />, 
    name: "Mentor", 
    description: "Help 3 new players reach level 5", 
    rarity: "epic", 
    unlocked: false,
    category: "social"
  },
  { 
    id: "influencer", 
    icon: <ThumbsUp size={16} />, 
    name: "Influencer", 
    description: "Get 100 likes on your generated outfits", 
    rarity: "rare", 
    unlocked: false,
    category: "social"
  },
  { 
    id: "guild-leader", 
    icon: <UsersRound size={16} />, 
    name: "Guild Leader", 
    description: "Create an active group of 10 players", 
    rarity: "legendary", 
    unlocked: false,
    category: "social"
  },
  
  // 🛠 Compétences Techniques
  { 
    id: "coder", 
    icon: <Code size={16} />, 
    name: "Coder", 
    description: "Learn the basics of a programming language", 
    rarity: "rare", 
    unlocked: true,
    unlockedDate: "2023-09-20T16:45:00Z",
    category: "technical"
  },
  { 
    id: "excel-ninja", 
    icon: <FileSpreadsheet size={16} />, 
    name: "Excel Ninja", 
    description: "Master 10 complex formulas", 
    rarity: "rare", 
    unlocked: false,
    category: "technical"
  },
  { 
    id: "diy-pro", 
    icon: <Wrench size={16} />, 
    name: "DIY Pro", 
    description: "Complete 5 guided DIY projects", 
    rarity: "uncommon", 
    unlocked: false,
    category: "technical"
  },
  { 
    id: "chef", 
    icon: <Utensils size={16} />, 
    name: "Cordon-Bleu", 
    description: "Cook 20 healthy recipes from the Zou guide", 
    rarity: "uncommon", 
    unlocked: true,
    unlockedDate: "2023-06-07T19:30:00Z",
    category: "technical"
  },
  { 
    id: "first-aid", 
    icon: <HeartPulse size={16} />, 
    name: "First Aid", 
    description: "Pass a first aid certification", 
    rarity: "epic", 
    unlocked: false,
    category: "technical"
  },
  
  // 🌟 Événements Speciaux
  { 
    id: "halloween-master", 
    icon: <Ghost size={16} />, 
    name: "Halloween Master", 
    description: "Complete the October challenges", 
    rarity: "rare", 
    unlocked: false,
    category: "events"
  },
  { 
    id: "christmas-magic", 
    icon: <Snowflake size={16} />, 
    name: "Christmas Magic", 
    description: "Give 5 virtual gifts to other players", 
    rarity: "rare", 
    unlocked: false,
    category: "events"
  },
  { 
    id: "new-year", 
    icon: <Sparkle size={16} />, 
    name: "New Year New Me", 
    description: "Keep your January resolutions", 
    rarity: "epic", 
    unlocked: false,
    category: "events"
  },
  { 
    id: "summer-body", 
    icon: <Sun size={16} />, 
    name: "Summer Body", 
    description: "Reach your fitness goals before summer", 
    rarity: "rare", 
    unlocked: false,
    category: "events"
  },
  { 
    id: "zou-og", 
    icon: <CheckCircle2 size={16} />, 
    name: "Zou OG", 
    description: "Be among the first 1,000 users", 
    rarity: "legendary", 
    unlocked: true,
    unlockedDate: "2023-01-05T08:10:00Z",
    category: "events"
  },
];
