
import { Skill } from "@/types/StatusTypes";

export const defaultSkills: Skill[] = [
  // Weapons branch (Productivity)
  {
    id: "w1",
    name: "Frappe Basique",
    description: "Augmente votre vitesse de frappe de 10%",
    branch: "weapons",
    position: { x: 20, y: 30 },
    icon: "sword",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["w2", "w3"],
    xpReward: 20
  },
  {
    id: "w2",
    name: "Concentration",
    description: "Augmente votre durée de concentration de 15%",
    branch: "weapons",
    position: { x: 35, y: 20 },
    icon: "target",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["w4"],
    xpReward: 25,
    requirements: [{ skillId: "w1" }]
  },
  {
    id: "w3",
    name: "Organisation",
    description: "Améliore votre capacité à organiser des tâches",
    branch: "weapons",
    position: { x: 35, y: 40 },
    icon: "list",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["w5"],
    xpReward: 25,
    requirements: [{ skillId: "w1" }]
  },
  {
    id: "w4",
    name: "Productivité Profonde",
    description: "Augmente la qualité de votre travail quand vous êtes concentré",
    branch: "weapons",
    position: { x: 50, y: 15 },
    icon: "zap",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["w6"],
    xpReward: 30,
    requirements: [{ skillId: "w2", level: 2 }]
  },
  {
    id: "w5",
    name: "Multitâche",
    description: "Vous permet de gérer efficacement plusieurs projets",
    branch: "weapons",
    position: { x: 50, y: 45 },
    icon: "layers",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["w6"],
    xpReward: 30,
    requirements: [{ skillId: "w3", level: 2 }]
  },
  {
    id: "w6",
    name: "Maîtrise de la Productivité",
    description: "Vous devenez un maître de la productivité personnelle",
    branch: "weapons",
    position: { x: 65, y: 30 },
    icon: "crown",
    unlocked: false,
    level: 0,
    maxLevel: 5,
    connections: [],
    xpReward: 50,
    requirements: [
      { skillId: "w4", level: 2 },
      { skillId: "w5", level: 2 }
    ]
  },

  // Defense branch (Health)
  {
    id: "d1",
    name: "Exercice Basique",
    description: "Établit une routine d'exercice simple",
    branch: "defense",
    position: { x: 20, y: 50 },
    icon: "activity",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["d2", "d3"],
    xpReward: 20
  },
  {
    id: "d2",
    name: "Nutrition",
    description: "Améliore vos habitudes alimentaires",
    branch: "defense",
    position: { x: 35, y: 60 },
    icon: "apple",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["d4"],
    xpReward: 25,
    requirements: [{ skillId: "d1" }]
  },
  {
    id: "d3",
    name: "Sommeil",
    description: "Optimise votre cycle de sommeil",
    branch: "defense",
    position: { x: 35, y: 80 },
    icon: "moon",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["d5"],
    xpReward: 25,
    requirements: [{ skillId: "d1" }]
  },
  {
    id: "d4",
    name: "Force Physique",
    description: "Développe votre force et endurance",
    branch: "defense",
    position: { x: 50, y: 65 },
    icon: "dumbbell",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["d6"],
    xpReward: 30,
    requirements: [{ skillId: "d2", level: 2 }]
  },
  {
    id: "d5",
    name: "Récupération",
    description: "Améliore votre capacité à récupérer après l'effort",
    branch: "defense",
    position: { x: 50, y: 85 },
    icon: "heart",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["d6"],
    xpReward: 30,
    requirements: [{ skillId: "d3", level: 2 }]
  },
  {
    id: "d6",
    name: "Santé Optimale",
    description: "Atteint un état de santé et forme physique exemplaire",
    branch: "defense",
    position: { x: 65, y: 75 },
    icon: "shield",
    unlocked: false,
    level: 0,
    maxLevel: 5,
    connections: [],
    xpReward: 50,
    requirements: [
      { skillId: "d4", level: 2 },
      { skillId: "d5", level: 2 }
    ]
  },

  // Magic branch (Knowledge)
  {
    id: "m1",
    name: "Lecture Basique",
    description: "Développe l'habitude de lire régulièrement",
    branch: "magic",
    position: { x: 80, y: 30 },
    icon: "book",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["m2", "m3"],
    xpReward: 20
  },
  {
    id: "m2",
    name: "Apprentissage",
    description: "Améliore votre capacité à apprendre de nouvelles compétences",
    branch: "magic",
    position: { x: 65, y: 20 },
    icon: "brain",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["m4"],
    xpReward: 25,
    requirements: [{ skillId: "m1" }]
  },
  {
    id: "m3",
    name: "Mémorisation",
    description: "Renforce votre mémoire et capacité de rétention",
    branch: "magic",
    position: { x: 65, y: 40 },
    icon: "database",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["m5"],
    xpReward: 25,
    requirements: [{ skillId: "m1" }]
  },
  {
    id: "m4",
    name: "Analyse Critique",
    description: "Développe votre capacité à analyser l'information",
    branch: "magic",
    position: { x: 50, y: 25 },
    icon: "search",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["m6"],
    xpReward: 30,
    requirements: [{ skillId: "m2", level: 2 }]
  },
  {
    id: "m5",
    name: "Créativité",
    description: "Stimule votre pensée créative et innovation",
    branch: "magic",
    position: { x: 50, y: 35 },
    icon: "brush",
    unlocked: false,
    level: 0,
    maxLevel: 3,
    connections: ["m6"],
    xpReward: 30,
    requirements: [{ skillId: "m3", level: 2 }]
  },
  {
    id: "m6",
    name: "Sagesse",
    description: "Atteint un niveau élevé de connaissance et compréhension",
    branch: "magic",
    position: { x: 35, y: 30 },
    icon: "wand",
    unlocked: false,
    level: 0,
    maxLevel: 5,
    connections: [],
    xpReward: 50,
    requirements: [
      { skillId: "m4", level: 2 },
      { skillId: "m5", level: 2 }
    ]
  }
];
