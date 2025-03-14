
import { 
  Sword, Shield, Wand, Star, Target, Flame, Zap, Book, Award, Diamond, Circle,
  Brain, Dumbbell, Coffee, Clock, Rocket, BarChart, PenTool, Feather, FileText,
  Lightbulb, Heart, Leaf, RotateCcw, Droplet, Sun, Moon, Compass
} from "lucide-react";

export const iconMap: Record<string, JSX.Element> = {
  // Original icons
  sword: <Sword size={14} />,
  shield: <Shield size={14} />,
  wand: <Wand size={14} />,
  star: <Star size={14} />,
  target: <Target size={14} />,
  flame: <Flame size={14} />,
  zap: <Zap size={14} />,
  book: <Book size={14} />,
  award: <Award size={14} />,
  diamond: <Diamond size={14} />,
  circle: <Circle size={14} />,
  
  // Additional icons for a more complete skill tree
  brain: <Brain size={14} />,
  dumbbell: <Dumbbell size={14} />,
  coffee: <Coffee size={14} />,
  clock: <Clock size={14} />,
  rocket: <Rocket size={14} />,
  chart: <BarChart size={14} />,
  pen: <PenTool size={14} />,
  feather: <Feather size={14} />,
  file: <FileText size={14} />,
  lightbulb: <Lightbulb size={14} />,
  heart: <Heart size={14} />,
  leaf: <Leaf size={14} />,
  rotate: <RotateCcw size={14} />,
  droplet: <Droplet size={14} />,
  sun: <Sun size={14} />,
  moon: <Moon size={14} />,
  compass: <Compass size={14} />
};
