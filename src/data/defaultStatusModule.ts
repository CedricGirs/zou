
import { StatusModule } from '../types/StatusTypes';

// Default values for status module
export const defaultStatusModule: StatusModule = {
  status: 'student',
  languages: [],
  softSkills: [],
  statusXP: 0,
  statusLevel: 1,
  maxXP: 100,
  achievements: [
    { id: "first_course", name: "Première Formation", description: "Ajouter votre première formation", completed: false, xpReward: 25 },
    { id: "first_language", name: "Polyglotte", description: "Ajouter votre première langue", completed: false, xpReward: 20 },
    { id: "first_skill", name: "Compétent", description: "Ajouter votre première compétence", completed: false, xpReward: 15 },
    { id: "language_master", name: "Maître Linguiste", description: "Atteindre le niveau C2 dans une langue", completed: false, xpReward: 50 },
    { id: "course_complete", name: "Diplômé", description: "Terminer une formation à 100%", completed: false, xpReward: 30 },
    { id: "certificate_collector", name: "Collectionneur", description: "Obtenir 3 certificats", completed: false, xpReward: 40 },
    { id: "skill_expert", name: "Expert", description: "Atteindre 100% dans 3 compétences", completed: false, xpReward: 35 },
    { id: "jack_of_all_trades", name: "Touche-à-tout", description: "Avoir au moins une entrée dans chaque catégorie", completed: false, xpReward: 45 }
  ]
};
