
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserData } from "@/context/UserDataContext";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Crown, Castle, Landmark, Building } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/hooks/use-toast";
import { Kingdom } from "@/types/HeroTypes";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Element types for the kingdom
const elements = [
  { id: "castle", name: "Castle", icon: <Castle />, width: 100, height: 100 },
  { id: "tower", name: "Tower", icon: <Landmark />, width: 60, height: 120 },
  { id: "house", name: "House", icon: <Building />, width: 80, height: 80 },
  { id: "wall", name: "Wall", icon: <Building />, width: 120, height: 30 },
];

// Kingdom styles
const kingdomStyles = [
  { id: "medieval", name: "Medieval" },
  { id: "roman", name: "Roman" },
  { id: "futuristic", name: "Futuristic" },
];

const KingdomPage = () => {
  const { userData, updateHeroProfile } = useUserData();
  const { t } = useLanguage();
  
  // Initialize kingdom state
  const [kingdom, setKingdom] = useState<Kingdom>({
    elements: [],
    name: "My Kingdom",
    xp: 0,
    level: 1,
    style: "medieval"
  });

  // Set up UI state
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"place" | "move" | "erase">("place");
  const [elementDetails, setElementDetails] = useState({ name: "", style: "" });
  const [kingdomName, setKingdomName] = useState("My Kingdom");
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);

  // Load kingdom data if exists
  useEffect(() => {
    if (userData?.heroProfile?.kingdom) {
      setKingdom(userData.heroProfile.kingdom);
      setKingdomName(userData.heroProfile.kingdom.name);
    }
  }, [userData?.heroProfile?.kingdom]);

  // Handle element selection
  const handleElementSelect = (elementId: string) => {
    setSelectedElement(elementId);
    setMode("place");
    setSelectedId(null);
  };

  // Handle placement of elements on canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("Canvas clicked, mode:", mode, "selectedElement:", selectedElement);
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
          style: kingdom.style
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
    }
  };

  // Handle element selection on the canvas
  const handleElementClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    console.log("Element clicked:", elementId, "mode:", mode);
    
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
      setElementDetails({ name: element.name, style: element.style || kingdom.style });
    }
  };

  // Save kingdom data
  const saveKingdom = async () => {
    try {
      const updatedKingdom = {
        ...kingdom,
        name: kingdomName
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

  // Update element details
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

  // Update kingdom style
  const handleStyleChange = (style: string) => {
    console.log("Changing kingdom style to:", style);
    // Update all existing elements to match the new style
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

  // Update kingdom name
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

  // Calculate kingdom level based on number of elements and XP
  const kingdomLevel = Math.max(1, Math.floor(kingdom.elements.length / 5) + Math.floor(kingdom.xp / 100));

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h1 className="text-2xl font-pixel mr-4">
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
          {/* Left sidebar - Building elements */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>{t("style")}</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("buildingElements")}</CardTitle>
                <CardDescription>{t("selectElementToPlace")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {elements.map(element => (
                  <Button 
                    key={element.id}
                    variant={selectedElement === element.id ? "default" : "outline"} 
                    className="w-full justify-start"
                    onClick={() => handleElementSelect(element.id)}
                  >
                    <span className="mr-2">{element.icon}</span>
                    {t(element.id)}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("tools")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant={mode === "place" ? "default" : "outline"} 
                  className="w-full justify-start"
                  onClick={() => setMode("place")}
                >
                  <Building className="mr-2" size={16} />
                  {t("place")}
                </Button>
                <Button 
                  variant={mode === "move" ? "default" : "outline"} 
                  className="w-full justify-start"
                  onClick={() => {
                    setMode("move");
                    setSelectedElement(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M5 9l4-4 4 4"/><path d="M7 6v14"/><path d="M15 9l4 4 4-4"/><path d="M19 6v14"/></svg>
                  {t("move")}
                </Button>
                <Button 
                  variant={mode === "erase" ? "default" : "outline"} 
                  className="w-full justify-start"
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

          {/* Main canvas area */}
          <div className="lg:col-span-3 relative">
            <div 
              className={`kingdom-canvas border-4 border-dashed rounded-lg overflow-hidden h-[600px] relative ${
                kingdom.style === "medieval" ? "bg-amber-50" : 
                kingdom.style === "roman" ? "bg-orange-50" : 
                "bg-blue-50"
              }`}
              onClick={handleCanvasClick}
            >
              {kingdom.elements.map(element => {
                const elementDef = elements.find(e => e.id === element.type);
                return (
                  <div
                    key={element.id}
                    className={`absolute cursor-pointer transition-all transform ${
                      selectedId === element.id ? "ring-2 ring-zou-purple" : ""
                    } ${
                      element.style === "medieval" ? "bg-amber-200 text-amber-800" : 
                      element.style === "roman" ? "bg-orange-200 text-orange-800" : 
                      "bg-blue-200 text-blue-800"
                    }`}
                    style={{
                      left: `${element.x - element.width/2}px`,
                      top: `${element.y - element.height/2}px`,
                      width: `${element.width}px`,
                      height: `${element.height}px`,
                      zIndex: selectedId === element.id ? 10 : 1
                    }}
                    onClick={(e) => handleElementClick(e, element.id)}
                  >
                    <div className="flex flex-col items-center justify-center h-full p-2">
                      {elementDef?.icon}
                      <span className="text-xs mt-1 font-medium text-center truncate w-full">
                        {element.name}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {kingdom.elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <Building size={48} className="mx-auto mb-2 opacity-30" />
                    <p>{t("emptyKingdom")}</p>
                    <p className="text-sm">{t("selectElementAndPlace")}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Rename Kingdom Dialog */}
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
