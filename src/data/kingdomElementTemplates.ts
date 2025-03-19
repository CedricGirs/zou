
import { KingdomElementTemplate } from "@/types/KingdomTypes";

// Background images for the kingdom
export const kingdomBackgrounds = [
  "/kingdom-backgrounds/parchment.jpg",
  "/kingdom-backgrounds/terrain.jpg",
  "/kingdom-backgrounds/grass.jpg",
];

// Templates for kingdom elements
export const kingdomElementTemplates: KingdomElementTemplate[] = [
  // Buildings
  {
    type: "castle",
    name: "Castle",
    defaultWidth: 120,
    defaultHeight: 120,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7.5 3h9M20 21H4M4 10l2 1v10M18 10l-2 1v10M12 3l-2 2M12 3l2 2M6 21v-2M18 21v-2M4 10h4M16 10h4M14 14a2 2 0 0 0-4 0v2a2 2 0 0 0 4 0z"/></svg>`,
    category: "buildings",
    xp: 50,
    colors: ["#6366F1", "#8B5CF6", "#EC4899", "#F97316", "#22C55E"]
  },
  {
    type: "house",
    name: "House",
    defaultWidth: 80,
    defaultHeight: 80,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.4V21h18V10.4M3 14h18M10 21v-7h4v7M12 3L2 9.4h20L12 3z"/></svg>`,
    category: "buildings",
    xp: 25,
    colors: ["#6366F1", "#8B5CF6", "#EC4899", "#F97316", "#22C55E"]
  },
  {
    type: "tower",
    name: "Tower",
    defaultWidth: 70,
    defaultHeight: 100,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M2 21h20M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1"/></svg>`,
    category: "buildings",
    xp: 35,
    colors: ["#6366F1", "#8B5CF6", "#EC4899", "#F97316", "#22C55E"]
  },
  {
    type: "wall",
    name: "Wall",
    defaultWidth: 150,
    defaultHeight: 40,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h3v5H3V7zM6 7h3v5H6V7zM9 7h3v5H9V7zM12 7h3v5h-3V7zM15 7h3v5h-3V7zM18 7h3v5h-3V7zM3 12h3v5H3v-5zM6 12h3v5H6v-5zM9 12h3v5H9v-5zM12 12h3v5h-3v-5zM15 12h3v5h-3v-5zM18 12h3v5h-3v-5z"/></svg>`,
    category: "buildings",
    xp: 20,
    colors: ["#6366F1", "#8B5CF6", "#EC4899", "#F97316", "#22C55E"]
  },
  {
    type: "gate",
    name: "Gate",
    defaultWidth: 90,
    defaultHeight: 80,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v18M18 3v18M3 21h18M3 3h18M9 14h6M9 8h6M12 8v6"/></svg>`,
    category: "buildings",
    xp: 30,
    colors: ["#6366F1", "#8B5CF6", "#EC4899", "#F97316", "#22C55E"]
  },
  
  // Nature
  {
    type: "tree",
    name: "Tree",
    defaultWidth: 70,
    defaultHeight: 70,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-8M8 9l4-5l4 5M8 15l4-5l4 5M2 15h20"/></svg>`,
    category: "nature",
    xp: 15,
    colors: ["#22C55E", "#16A34A", "#15803D", "#166534", "#14532D"]
  },
  {
    type: "mountain",
    name: "Mountain",
    defaultWidth: 90,
    defaultHeight: 70,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20h18L17 7l-4 5.5L5 7l-2 13"/></svg>`,
    category: "nature",
    xp: 20,
    colors: ["#6B7280", "#4B5563", "#374151", "#1F2937", "#111827"]
  },
  {
    type: "water",
    name: "Water",
    defaultWidth: 100,
    defaultHeight: 80,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 15c-1.5 1.5-3 3-6 3s-4.5-1.5-6-3-3-3-6-3v6h18v-6c-3 0-4.5 1.5-6 3zM20 9c-1.5-1.5-3-3-6-3S9.5 7.5 8 9 5 12 2 12v3c3 0 4.5-1.5 6-3s3-3 6-3 4.5 1.5 6 3 3 3 6 3v-3c-3 0-4.5-1.5-6-3z"/></svg>`,
    category: "nature",
    xp: 25,
    colors: ["#3B82F6", "#2563EB", "#1D4ED8", "#1E40AF", "#1E3A8A"]
  },
  
  // Resources
  {
    type: "gold",
    name: "Gold",
    defaultWidth: 60,
    defaultHeight: 60,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="7"/><path d="M8 5v6M5.5 8h5"/><circle cx="16" cy="16" r="7"/><path d="M16 13v6M13.5 16h5"/></svg>`,
    category: "resources",
    xp: 30,
    colors: ["#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F"]
  },
  {
    type: "farm",
    name: "Farm",
    defaultWidth: 90,
    defaultHeight: 70,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18M3 15l4-4l4 4l4-4l4 4l2-2M12 13V8M12 8H7M12 8h5"/></svg>`,
    category: "resources",
    xp: 25,
    colors: ["#EAB308", "#CA8A04", "#A16207", "#854D0E", "#713F12"]
  },
  
  // Special
  {
    type: "flag",
    name: "Flag",
    defaultWidth: 60,
    defaultHeight: 80,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4M4 4h10c1 0 2 .5 2 2s-1 2-2 2h-8M4 16h13c1 0 2-.5 2-2s-1-2-2-2H4"/></svg>`,
    category: "special",
    xp: 20,
    colors: ["#EF4444", "#DC2626", "#B91C1C", "#991B1B", "#7F1D1D"]
  },
  {
    type: "chest",
    name: "Chest",
    defaultWidth: 70,
    defaultHeight: 60,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M10 20V8M14 20V8M1 10h22M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/></svg>`,
    category: "special",
    xp: 40,
    colors: ["#F59E0B", "#D97706", "#B45309", "#92400E", "#78350F"]
  },
  {
    type: "character",
    name: "Character",
    defaultWidth: 60,
    defaultHeight: 80,
    icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M12 11v8M9 15h6M8 22h8"/></svg>`,
    category: "special",
    xp: 35,
    colors: ["#6366F1", "#8B5CF6", "#EC4899", "#F97316", "#22C55E"]
  }
];

// Helper function to get the SVG icon for a specific element type
export const getElementIcon = (type: string): string => {
  const template = kingdomElementTemplates.find(t => t.type === type);
  return template?.icon || "";
};
