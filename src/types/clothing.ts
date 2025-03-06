
import { ReactNode } from "react";

export interface Clothing {
  id: string;
  name: string;
  category: "tops" | "bottoms" | "jackets" | "shoes";
  color: string;
  icon: ReactNode;
  selected?: boolean;
}

export interface Outfit {
  day: string;
  items: Clothing[];
}
