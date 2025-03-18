import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserData } from "@/context/UserDataContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Crown, Castle, Landmark, Building, Home, Trees, Palmtree, Flame, Droplets, Image as ImageIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { Kingdom } from "@/types/HeroTypes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const elements = [
  { id: "temple", name: "Temple", icon: <Landmark />, width: 100, height: 100 },
  { id: "villa", name: "Villa", icon: <Home />, width: 120, height: 100 },
  { id: "tower", name: "Tower", icon: <Castle />, width: 60, height: 120 },
  { id: "house", name: "House", icon: <Building />, width: 80, height: 80 },
  { id: "wall", name: "Wall", icon: <Building />, width: 120, height: 30 },
  { id: "garden", name: "Garden", icon: <Trees />, width: 80, height: 80 },
  { id: "statue", name: "Statue", icon: <Landmark />, width: 60, height: 60 },
  { id: "fountain", name: "Fountain", icon: <Droplets />, width: 70, height: 70 },
  { id: "market", name: "Market", icon: <Building />, width: 120, height: 90 },
  { id: "palmTree", name: "Palm Tree", icon: <Palmtree />, width: 40, height: 40 },
  { id: "fire", name: "Fire", icon: <Flame />, width: 40, height: 40 },
  { id: "column", name: "Column", icon: <Landmark />, width: 40, height: 80 },
];

const kingdomStyles = [
  { id: "roman", name: "Roman", colors: ["#f5d3a3", "#e0a370", "#c27d53"] },
  { id: "medieval", name: "Medieval", colors: ["#c8b88a", "#a49066", "#776b49"] },
  { id: "futuristic", name: "Futuristic", colors: ["#a3d9f5", "#70b4e0", "#537fc2"] },
];

const KingdomPage = () => {
  const { userData, updateHeroProfile } = useUserData();
  const { t } = useLanguage();
  
  const [kingdom, setKingdom] = useState<Kingdom>({
    elements: [],
    name: "My Kingdom",
    xp: 0,
    level: 1,
    style: "roman"
  });

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"place" | "move" | "erase" | "rotate">("place");
  const [elementDetails, setElementDetails] = useState({ name: "", style: "", color: "" });
  const [kingdomName, setKingdomName] = useState("My Kingdom");
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [useBackgroundImage, setUseBackgroundImage] = useState(false);
  const [elementCategory, setElementCategory] = useState<"buildings" | "decoration" | "nature">("buildings");
  
  const filteredElements = elements.filter(element => {
    if (elementCategory === "buildings") {
      return ["temple", "villa", "tower", "house", "wall", "market"].includes(element.id);
    } else if (elementCategory === "decoration") {
      return ["statue", "fountain", "column", "fire"].includes(element.id);
    } else {
      return ["garden", "palmTree"].includes(element.id);
    }
  });

  useEffect(() => {
    if (userData?.heroProfile?.kingdom) {
      setKingdom(userData.heroProfile.kingdom);
      setKingdomName(userData.heroProfile.kingdom.name);
      setUseBackgroundImage(!!userData.heroProfile.kingdom.backgroundImage);
    }
  }, [userData?.heroProfile?.kingdom]);

  const handleElementSelect = (elementId: string) => {
    setSelectedElement(elementId);
    setMode("place");
    setSelectedId(null);
  };

  const getElementStyle = (elementType: string, kingdomStyle: string) => {
    const styleColors = kingdomStyles.find(style => style.id === kingdomStyle)?.colors || ["#f5d3a3", "#e0a370", "#c27d53"];
    
    switch (elementType) {
      case "temple":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='10' y='50' width='80' height='50' fill='${styleColors[0]}'/%3E%3Cpolygon points='5,50 95,50 50,20' fill='${styleColors[1]}'/%3E%3Crect x='20' y='60' width='15' height='40' fill='${styleColors[2]}'/%3E%3Crect x='65' y='60' width='15' height='40' fill='${styleColors[2]}'/%3E%3C/svg%3E")`,
          backgroundColor: "transparent",
        };
      case "villa":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='10' y='40' width='80' height='60' fill='${styleColors[0]}'/%3E%3Cpolygon points='5,40 95,40 50,10' fill='${styleColors[1]}'/%3E%3Crect x='40' y='70' width='20' height='30' fill='${styleColors[2]}'/%3E%3Crect x='20' y='50' width='15' height='15' fill='${styleColors[2]}'/%3E%3Crect x='65' y='50' width='15' height='15' fill='${styleColors[2]}'/%3E%3C/svg%3E")`,
          backgroundColor: "transparent",
        };
      case "tower":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='25' y='20' width='50' height='80' fill='${styleColors[0]}'/%3E%3Cpolygon points='20,20 80,20 50,5' fill='${styleColors[1]}'/%3E%3Crect x='35' y='40' width='30' height='40' fill='${styleColors[2]}'/%3E%3Crect x='20' y='15' width='60' height='10' fill='${styleColors[1]}'/%3E%3C/svg%3E")`,
          backgroundColor: "transparent",
        };
      case "house":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='20' y='50' width='60' height='50' fill='${styleColors[0]}'/%3E%3Cpolygon points='10,50 90,50 50,20' fill='${styleColors[1]}'/%3E%3Crect x='40' y='70' width='20' height='30' fill='${styleColors[2]}'/%3E%3C/svg%3E")`,
          backgroundColor: "transparent",
        };
      case "wall":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='5' y='30' width='90' height='40' fill='${styleColors[0]}'/%3E%3Crect x='10' y='35' width='10' height='30' fill='${styleColors[1]}'/%3E%3Crect x='30' y='35' width='10' height='30' fill='${styleColors[1]}'/%3E%3Crect x='50' y='35' width='10' height='30' fill='${styleColors[1]}'/%3E%3Crect x='70' y='35' width='10' height='30' fill='${styleColors[1]}'/%3E%3C/svg%3E")`,
          backgroundColor: "transparent",
        };
      case "garden":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='40' fill='%234CAF50' opacity='0.3'/%3E%3Ccircle cx='30' cy='40' r='15' fill='%234CAF50'/%3E%3Ccircle cx='60' cy='30' r='10' fill='%234CAF50'/%3E%3Ccircle cx='70' cy='60' r='12' fill='%234CAF50'/%3E%3Ccircle cx='40' cy='70' r='14' fill='%234CAF50'/%3E%3C/svg%3E")`,
          backgroundColor: "transparent",
        };
      case "statue":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='35' y='70' width='30' height='20' fill='${styleColors[0]}'/%3E%3Crect x='40' y='60' width='20' height='10' fill='${styleColors[0]}'/%3E%3Ccircle cx='50' cy='45' r='10' fill='${styleColors[1]}'/%3E%3Crect x='45' y='20' width='10' height='20' fill='${styleColors[1]}'/%3E%3C/svg%3E")`,
          backgroundColor: "transparent",
        };
      case "fountain":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='30' fill='${styleColors[0]}'/%3E%3Ccircle cx='50' cy='50' r='20' fill='%23ADD8E6'/%3E%3Ccircle cx='50' cy='50' r='10' fill='%2387CEFA'/%3E%3Cline x1='50' y1='30' x2='50' y2='20' stroke='%2387CEFA' stroke-width='2'/%3E%3Cline x1='60' y1='35' x2='65' y2='25' stroke='%2387CEFA' stroke-width='2'/%3E%3Cline x1='40' y1='35' x2='35' y2='25' stroke='%2387CEFA' stroke-width='2'/%3E%3C/svg%3E")`,
          backgroundColor: "transparent",
        };
      case "market":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='10' y='60' width='80' height='40' fill='${styleColors[0]}'/%3E%3Cpolygon points='5,60 95,60 50,40' fill='${styleColors[1]}'/%3E%3Crect x='20' y='70' width='15' height='15' fill='${styleColors[2]}'/%3E%3Crect x='45' y='70' width='15' height='15' fill='${styleColors[2]}'/%3E%3Crect x='70' y='70' width='15' height='15' fill='${styleColors[2]}'/%3E%3C/svg%3E")`,
          backgroundColor: "transparent",
        };
      case "palmTree":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='45' y='50' width='10' height='40' fill='%23A0522D'/%3E%3Cpath d='M50,10 Q30,40 40,40 Q20,45 30,50 Q10,60 25,55 Q5,70 25,65 Q50,60 75,65 Q95,70 75,55 Q90,60 70,50 Q80,45 60,40 Q70,40 50,10' fill='%23228B22'/%3E%3C/svg%3E")`,
          backgroundColor: "transparent",
        };
      case "fire":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='70' r='20' fill='%23CD7F32'/%3E%3Cpath d='M40,50 Q50,20 60,50 Q70,30 65,55 Q80,45 70,60 Q85,60 65,70 Q75,80 50,75 Q25,80 35,70 Q15,60 30,60 Q20,45 35,55 Q30,30 40,50' fill='%23FF4500'/%3E%3Cpath d='M45,45 Q50,25 55,45 Q65,35 60,50 Q70,40 60,55 Q65,65 50,60 Q35,65 40,55 Q30,40 40,50 Q35,35 45,45' fill='%23FFD700'/%3E%3C/svg%3E")`,
          backgroundColor: "transparent",
        };
      case "column":
        return {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='35' y='10' width='30' height='10' fill='${styleColors[0]}'/%3E%3Crect x='40' y='20' width='20' height='60' fill='${styleColors[1]}'/%3E%3Crect x='35' y='80' width='30' height='10' fill='${styleColors[0]}'/%3E%3Cline x1='40' y1='25' x2='40' y2='75' stroke='${styleColors[2]}' stroke-width='1'/%3E%3Cline x1='45' y1='25' x2='45' y2='75' stroke='${styleColors[2]}' stroke-width='1'/%3E%3Cline x1='50' y1='25' x2='50' y2='75' stroke='${styleColors[2]}' stroke-width='1'/%3E%3Cline x1='55' y1='25' x2='55' y2='75' stroke='${styleColors[2]}' stroke-width='1'/%3E%3Cline x1='60' y1='25' x2='60' y2='75' stroke='${styleColors[2]}' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundColor: "transparent",
        };
      default:
        return {
          backgroundColor: styleColors[0],
        };
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (mode === "place" && selectedElement) {
      const elementType = elements.find(el => el.id === selectedElement);
      
      if (elementType) {
        console.log("Creating new element:", elementType);
        const newElement = {
          id: uuidv4(),
          type: selectedElement,
          x,
          y,
          width: elementType.width,
          height: elementType.height,
          name: `${elementType.name} ${kingdom.elements.length + 1}`,
          style: kingdom.style,
          rotation: 0
        };

        const newElements = [...kingdom.elements, newElement];
        const newKingdom = { 
          ...kingdom, 
          elements: newElements, 
          xp: kingdom.xp + 10,
          level: Math.max(1, Math.floor((kingdom.xp + 10) / 100) + Math.floor(newElements.length / 5))
        };
        
        setKingdom(newKingdom);
        toast({ 
          title: t("elementAdded"), 
          description: `${t("added")} ${elementType.name} ${t("toYourKingdom")}!` 
        });
      }
    } else if (mode === "move" && selectedId) {
      console.log("Moving element with ID:", selectedId);
      const newElements = kingdom.elements.map(el => 
        el.id === selectedId ? { ...el, x, y } : el
      );
      setKingdom({ ...kingdom, elements: newElements });
    } else if (mode === "erase" && selectedId) {
      console.log("Erasing element with ID:", selectedId);
      const newElements = kingdom.elements.filter(el => el.id !== selectedId);
      setKingdom({ ...kingdom, elements: newElements });
      setSelectedId(null);
      toast({ 
        title: t("elementRemoved"), 
        description: t("elementRemovedDesc") 
      });
    } else if (mode === "rotate" && selectedId) {
      const element = kingdom.elements.find(el => el.id === selectedId);
      if (element) {
        const newRotation = (element.rotation || 0) + 90;
        const newElements = kingdom.elements.map(el => 
          el.id === selectedId ? { ...el, rotation: newRotation } : el
        );
        setKingdom({ ...kingdom, elements: newElements });
      }
    }
  };

  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    
    if (mode === "erase") {
      const newElements = kingdom.elements.filter(el => el.id !== elementId);
      setKingdom({ ...kingdom, elements: newElements });
      setSelectedId(null);
      toast({ 
        title: t("elementRemoved"), 
        description: t("elementRemovedDesc") 
      });
      return;
    }
    
    setSelectedId(elementId);
    
    const element = kingdom.elements.find(el => el.id === elementId);
    if (element) {
      setElementDetails({ 
        name: element.name, 
        style: element.style || kingdom.style,
        color: element.color || ""
      });
    }
  };

  const saveKingdom = async () => {
    try {
      const updatedKingdom = {
        ...kingdom,
        name: kingdomName,
        backgroundImage: useBackgroundImage ? "/lovable-uploads/99cfb3a4-e977-41c2-b837-5e1aa5e0fc6a.png" : undefined
      };
      
      await updateHeroProfile({ kingdom: updatedKingdom });
      toast({ 
        title: t("kingdomSaved"), 
        description: t("kingdomSavedDesc") 
      });
    } catch (error) {
      console.error("Error saving kingdom:", error);
      toast({ 
        title: t("error"), 
        description: t("failedToSaveKingdom"), 
        variant: "destructive" 
      });
    }
  };

  const updateElementName = () => {
    if (selectedId && elementDetails.name) {
      console.log("Updating element name:", elementDetails.name);
      const newElements = kingdom.elements.map(el => 
        el.id === selectedId ? { ...el, name: elementDetails.name } : el
      );
      setKingdom({ ...kingdom, elements: newElements });
      toast({ 
        title: t("elementUpdated"), 
        description: t("nameUpdatedSuccessfully") 
      });
    }
  };

  const handleStyleChange = (style: string) => {
    console.log("Changing kingdom style to:", style);
    const newElements = kingdom.elements.map(el => ({
      ...el,
      style
    }));
    
    setKingdom({ 
      ...kingdom, 
      style,
      elements: newElements 
    });
  };

  const handleKingdomNameChange = () => {
    setKingdom({
      ...kingdom,
      name: kingdomName
    });
    setIsRenameDialogOpen(false);
    toast({ 
      title: t("kingdomRenamed"), 
      description: t("kingdomRenamedDesc") 
    });
  };

  const kingdomLevel = Math.max(1, Math.floor(kingdom.elements.length / 5) + Math.floor(kingdom.xp / 100));

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h1 className="text-2xl font-bold mr-4">
              {kingdomName}
            </h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsRenameDialogOpen(true)}
            >
              {t("rename")}
            </Button>
          </div>
          
          <div className="flex gap-2">
            <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-md">
              <Crown size={16} />
              <span className="font-medium">{t("kingdomLevel")}: {kingdomLevel}</span>
            </div>
            
            <Button onClick={saveKingdom}>
              {t("saveKingdom")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>{t("style")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select 
                    value={kingdom.style} 
                    onValueChange={handleStyleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectStyle")} />
                    </SelectTrigger>
                    <SelectContent>
                      {kingdomStyles.map(style => (
                        <SelectItem key={style.id} value={style.id}>
                          {t(style.id as any)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="useBackground"
                      checked={useBackgroundImage}
                      onCheckedChange={setUseBackgroundImage}
                    />
                    <Label htmlFor="useBackground" className="cursor-pointer">Utiliser l'image de référence</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("buildingElements")}</CardTitle>
                <CardDescription>{t("selectElementToPlace")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2 mb-4">
                  <Button 
                    variant={elementCategory === "buildings" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setElementCategory("buildings")}
                  >
                    Bâtiments
                  </Button>
                  <Button 
                    variant={elementCategory === "decoration" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setElementCategory("decoration")}
                  >
                    Décorations
                  </Button>
                  <Button 
                    variant={elementCategory === "nature" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setElementCategory("nature")}
                  >
                    Nature
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {filteredElements.map(element => (
                    <Button 
                      key={element.id}
                      variant={selectedElement === element.id ? "default" : "outline"} 
                      className="justify-start flex-col h-24 items-center"
                      onClick={() => handleElementSelect(element.id)}
                    >
                      <div className="mb-2">{element.icon}</div>
                      <span className="text-xs text-center">{element.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("tools")}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Button 
                  variant={mode === "place" ? "default" : "outline"} 
                  className="justify-start"
                  onClick={() => setMode("place")}
                >
                  <Building className="mr-2" size={16} />
                  {t("place")}
                </Button>
                <Button 
                  variant={mode === "move" ? "default" : "outline"} 
                  className="justify-start"
                  onClick={() => {
                    setMode("move");
                    setSelectedElement(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 9l4-4 4 4"/><path d="M7 6v14"/><path d="M15 9l4 4 4-4"/><path d="M19 6v14"/></svg>
                  {t("move")}
                </Button>
                <Button 
                  variant={mode === "rotate" ? "default" : "outline"} 
                  className="justify-start"
                  onClick={() => {
                    setMode("rotate");
                    setSelectedElement(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>
                  Rotation
                </Button>
                <Button 
                  variant={mode === "erase" ? "default" : "outline"} 
                  className="justify-start"
                  onClick={() => {
                    setMode("erase");
                    setSelectedElement(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"/><line x1="18" x2="12" y1="9" y2="15"/><line x1="12" x2="18" y1="9" y2="15"/></svg>
                  {t("erase")}
                </Button>
              </CardContent>
            </Card>

            {selectedId && (
              <Card>
                <CardHeader>
                  <CardTitle>{t("elementDetails")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("name")}</label>
                    <div className="flex gap-2">
                      <Input 
                        value={elementDetails.name} 
                        onChange={(e) => setElementDetails({...elementDetails, name: e.target.value})}
                      />
                      <Button onClick={updateElementName}>{t("rename")}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-3 relative">
            <div 
              className={`kingdom-canvas border-4 border-dashed rounded-lg overflow-hidden h-[600px] relative ${
                kingdom.style === "medieval" ? "bg-amber-50" : 
                kingdom.style === "roman" ? "bg-orange-50" : 
                "bg-blue-50"
              }`}
              style={useBackgroundImage ? {
                backgroundImage: `url("/lovable-uploads/99cfb3a4-e977-41c2-b837-5e1aa5e0fc6a.png")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : {}}
              onClick={handleCanvasClick}
            >
              {kingdom.elements.map(element => {
                const elementDef = elements.find(e => e.id === element.type);
                const elementStyle = getElementStyle(element.type, element.style || kingdom.style);
                
                return (
                  <div
                    key={element.id}
                    className={`absolute cursor-pointer transition-all transform ${
                      selectedId === element.id ? "ring-2 ring-blue-500" : ""
                    }`}
                    style={{
                      left: `${element.x - element.width/2}px`,
                      top: `${element.y - element.height/2}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`,
                      zIndex: selectedId === element.id ? 10 : 1,
                      transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
                      ...elementStyle
                    }}
                    onClick={(e) => handleElementClick(e, element.id)}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-2">
                      {selectedId === element.id && (
                        <span className="absolute -top-6 left-0 right-0 text-xs font-medium text-center bg-white/80 rounded px-1 py-0.5 truncate">
                          {element.name}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {kingdom.elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <ImageIcon size={48} className="mx-auto mb-2 opacity-30" />
                    <p>{t("emptyKingdom")}</p>
                    <p className="text-sm">{t("selectElementAndPlace")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("renameKingdom")}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={kingdomName}
              onChange={(e) => setKingdomName(e.target.value)}
              placeholder={t("enterKingdomName")}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleKingdomNameChange}>
              {t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default KingdomPage;
