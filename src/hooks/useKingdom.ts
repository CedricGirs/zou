
import { useState, useEffect, useCallback } from 'react';
import { useUserData } from '@/context/userData';
import { v4 as uuidv4 } from 'uuid';
import { 
  KingdomBuilding, 
  KingdomDecoration, 
  KingdomRoad,
  KingdomBuildingPurpose,
  KingdomStyle
} from '@/types/KingdomTypes';
import { playSound } from '@/utils/audioUtils';
import { toast } from '@/hooks/use-toast';

export const useKingdom = () => {
  const { userData, updateKingdomModule } = useUserData();
  const { kingdomModule } = userData;
  
  const [buildings, setBuildings] = useState<KingdomBuilding[]>(kingdomModule.buildings);
  const [decorations, setDecorations] = useState<KingdomDecoration[]>(kingdomModule.decorations);
  const [roads, setRoads] = useState<KingdomRoad[]>(kingdomModule.roads);
  const [style, setStyle] = useState<KingdomStyle>(kingdomModule.style);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [autosaveEnabled, setAutosaveEnabled] = useState<boolean>(true);
  
  // Sync with userData when it changes
  useEffect(() => {
    setBuildings(kingdomModule.buildings);
    setDecorations(kingdomModule.decorations);
    setRoads(kingdomModule.roads);
    setStyle(kingdomModule.style);
  }, [kingdomModule]);
  
  // Autosave functionality
  useEffect(() => {
    if (!autosaveEnabled || !unsavedChanges) return;
    
    const autosaveTimer = setTimeout(() => {
      saveKingdom();
    }, 30000); // Autosave after 30 seconds of inactivity
    
    return () => clearTimeout(autosaveTimer);
  }, [unsavedChanges, autosaveEnabled]);
  
  // Calculate kingdom level and experience
  const calculateLevel = useCallback(() => {
    const totalObjects = buildings.length + decorations.length + roads.length;
    let level = 1;
    let experience = 0;
    let maxExperience = 100;
    
    if (totalObjects >= 5) {
      // Level formulas
      level = Math.floor(1 + Math.sqrt(totalObjects / 5));
      experience = totalObjects * 10;
      maxExperience = level * 100;
    }
    
    return { level, experience, maxExperience };
  }, [buildings, decorations, roads]);
  
  // Add new building
  const addBuilding = async (
    type: string, 
    x: number, 
    y: number, 
    width: number, 
    height: number,
    name: string = type,
    purpose: KingdomBuildingPurpose = 'other'
  ) => {
    const newBuilding: KingdomBuilding = {
      id: uuidv4(),
      type,
      name,
      purpose,
      x,
      y,
      width,
      height,
      rotation: 0,
      style,
      createdAt: new Date().toISOString()
    };
    
    const updatedBuildings = [...buildings, newBuilding];
    setBuildings(updatedBuildings);
    setUnsavedChanges(true);
    
    playSound('click');
    toast({
      title: "Item Added",
      description: `${name} has been added to your kingdom`,
    });
    
    return newBuilding;
  };
  
  // Update building
  const updateBuilding = (id: string, updates: Partial<KingdomBuilding>) => {
    const updatedBuildings = buildings.map(building => 
      building.id === id ? { ...building, ...updates } : building
    );
    
    setBuildings(updatedBuildings);
    setUnsavedChanges(true);
    return updatedBuildings.find(b => b.id === id);
  };
  
  // Delete building
  const deleteBuilding = (id: string) => {
    const updatedBuildings = buildings.filter(building => building.id !== id);
    setBuildings(updatedBuildings);
    setUnsavedChanges(true);
  };
  
  // Add new decoration
  const addDecoration = (type: string, x: number, y: number, width: number, height: number) => {
    const newDecoration: KingdomDecoration = {
      id: uuidv4(),
      type,
      x,
      y,
      width,
      height,
      rotation: 0,
      style,
      createdAt: new Date().toISOString()
    };
    
    const updatedDecorations = [...decorations, newDecoration];
    setDecorations(updatedDecorations);
    setUnsavedChanges(true);
    
    playSound('click');
    toast({
      title: "Item Added",
      description: `${type} has been added to your kingdom`,
    });
    
    return newDecoration;
  };
  
  // Update decoration
  const updateDecoration = (id: string, updates: Partial<KingdomDecoration>) => {
    const updatedDecorations = decorations.map(decoration => 
      decoration.id === id ? { ...decoration, ...updates } : decoration
    );
    
    setDecorations(updatedDecorations);
    setUnsavedChanges(true);
    return updatedDecorations.find(d => d.id === id);
  };
  
  // Delete decoration
  const deleteDecoration = (id: string) => {
    const updatedDecorations = decorations.filter(decoration => decoration.id !== id);
    setDecorations(updatedDecorations);
    setUnsavedChanges(true);
  };
  
  // Add new road
  const addRoad = (points: { x: number; y: number }[], width: number) => {
    const newRoad: KingdomRoad = {
      id: uuidv4(),
      points,
      width,
      style,
      createdAt: new Date().toISOString()
    };
    
    const updatedRoads = [...roads, newRoad];
    setRoads(updatedRoads);
    setUnsavedChanges(true);
    
    playSound('click');
    toast({
      title: "Road Added",
      description: "Road has been added to your kingdom",
    });
    
    return newRoad;
  };
  
  // Update road
  const updateRoad = (id: string, updates: Partial<KingdomRoad>) => {
    const updatedRoads = roads.map(road => 
      road.id === id ? { ...road, ...updates } : road
    );
    
    setRoads(updatedRoads);
    setUnsavedChanges(true);
    return updatedRoads.find(r => r.id === id);
  };
  
  // Delete road
  const deleteRoad = (id: string) => {
    const updatedRoads = roads.filter(road => road.id !== id);
    setRoads(updatedRoads);
    setUnsavedChanges(true);
  };
  
  // Change kingdom style
  const changeStyle = (newStyle: KingdomStyle) => {
    setStyle(newStyle);
    setUnsavedChanges(true);
  };
  
  // Clear the entire kingdom
  const clearKingdom = () => {
    setBuildings([]);
    setDecorations([]);
    setRoads([]);
    setUnsavedChanges(true);
    
    toast({
      title: "Kingdom Cleared",
      description: "All items have been removed from your kingdom",
    });
  };
  
  // Save kingdom to database
  const saveKingdom = async () => {
    const { level, experience, maxExperience } = calculateLevel();
    
    try {
      await updateKingdomModule({
        buildings,
        decorations,
        roads,
        style,
        level,
        experience,
        maxExperience,
        lastSaved: new Date().toISOString()
      });
      
      setUnsavedChanges(false);
      toast({
        title: "Kingdom Saved",
        description: "Your kingdom has been saved successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Error saving kingdom:", error);
      toast({
        title: "Error",
        description: "Failed to save your kingdom. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  };
  
  return {
    buildings,
    decorations,
    roads,
    style,
    level: kingdomModule.level,
    experience: kingdomModule.experience,
    maxExperience: kingdomModule.maxExperience,
    lastSaved: kingdomModule.lastSaved,
    unsavedChanges,
    autosaveEnabled,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    addDecoration,
    updateDecoration,
    deleteDecoration,
    addRoad,
    updateRoad,
    deleteRoad,
    changeStyle,
    clearKingdom,
    saveKingdom,
    setAutosaveEnabled
  };
};
