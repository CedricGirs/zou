
import { useState, useEffect, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useUserData } from "@/context/UserDataContext";
import { useLanguage } from "@/context/LanguageContext";
import { KingdomElement } from "@/types/KingdomTypes";
import KingdomEditor from "@/components/kingdom/KingdomEditor";
import KingdomElementsSidebar from "@/components/kingdom/KingdomElementsSidebar";
import KingdomHeader from "@/components/kingdom/KingdomHeader";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { playSound } from "@/utils/audioUtils";

const Kingdom = () => {
  const { userData, updateHeroProfile } = useUserData();
  const { t } = useLanguage();
  const [elements, setElements] = useState<KingdomElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<KingdomElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  
  // Load kingdom elements from userData
  useEffect(() => {
    if (userData?.heroProfile?.kingdom) {
      setElements(userData.heroProfile.kingdom);
    }
  }, [userData?.heroProfile?.kingdom]);

  // Save kingdom elements to userData
  const saveKingdom = () => {
    updateHeroProfile({ kingdom: elements });
    toast({
      title: t("kingdom_saved"),
      description: t("kingdom_saved_description"),
    });
    playSound("click");
  };

  // Auto-save when elements change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (elements.length > 0) {
        saveKingdom();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [elements]);

  // Add a new element to the kingdom
  const addElement = (newElement: KingdomElement) => {
    setElements([...elements, newElement]);
    setSelectedElement(newElement);
    playSound("click");
  };

  // Update an existing element
  const updateElement = (updatedElement: KingdomElement) => {
    setElements(elements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    ));
  };

  // Delete an element
  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    setSelectedElement(null);
    playSound("delete");
    toast({
      title: t("element_deleted"),
      description: t("element_deleted_description"),
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <KingdomHeader 
          saveKingdom={saveKingdom} 
          elementCount={elements.length} 
        />
        
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-200px)]">
          <ResizablePanel defaultSize={25} minSize={20}>
            <Card className="h-full overflow-auto">
              <KingdomElementsSidebar 
                addElement={addElement} 
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
              />
            </Card>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={75}>
            <Card className="h-full">
              <KingdomEditor 
                elements={elements} 
                updateElement={updateElement}
                deleteElement={deleteElement}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                isResizing={isResizing}
                setIsResizing={setIsResizing}
              />
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </MainLayout>
  );
};

export default Kingdom;
