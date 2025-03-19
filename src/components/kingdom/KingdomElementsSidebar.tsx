
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { KingdomElement, KingdomElementTemplate, KingdomElementCategory } from "@/types/KingdomTypes";
import { v4 as uuidv4 } from "uuid";
import { kingdomElementTemplates } from "@/data/kingdomElementTemplates";

interface KingdomElementsSidebarProps {
  addElement: (element: KingdomElement) => void;
  selectedElement: KingdomElement | null;
  setSelectedElement: (element: KingdomElement | null) => void;
}

const KingdomElementsSidebar = ({ 
  addElement, 
  selectedElement, 
  setSelectedElement 
}: KingdomElementsSidebarProps) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<KingdomElementCategory>("buildings");
  
  // Filter elements by search query and category
  const filteredElements = kingdomElementTemplates.filter(template => 
    template.category === selectedCategory && 
    (searchQuery === "" || t(`element_${template.type}`).toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Create a new element from a template
  const handleAddElement = (template: KingdomElementTemplate) => {
    const newElement: KingdomElement = {
      id: uuidv4(),
      type: template.type,
      name: t(`element_${template.type}`),
      x: 100,
      y: 100,
      width: template.defaultWidth,
      height: template.defaultHeight,
      rotation: 0,
      category: template.category,
      xp: template.xp,
      color: template.colors?.[0] || "#6366F1",
      created: new Date().toISOString(),
    };
    
    addElement(newElement);
  };
  
  return (
    <>
      <CardHeader className="pb-3">
        <CardTitle>{t("kingdom_elements")}</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search_elements")}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent className="px-2">
        <Tabs defaultValue="buildings" onValueChange={(value) => setSelectedCategory(value as KingdomElementCategory)}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="buildings">{t("buildings")}</TabsTrigger>
            <TabsTrigger value="nature">{t("nature")}</TabsTrigger>
            <TabsTrigger value="resources">{t("resources")}</TabsTrigger>
            <TabsTrigger value="special">{t("special")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedCategory} className="mt-4 space-y-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {filteredElements.map((template) => (
                <div 
                  key={template.type}
                  className="border rounded-md p-2 hover:bg-accent cursor-pointer flex flex-col items-center text-center gap-1"
                  onClick={() => handleAddElement(template)}
                >
                  <div className="w-12 h-12 flex items-center justify-center">
                    <div dangerouslySetInnerHTML={{ __html: template.icon }} />
                  </div>
                  <div className="text-sm font-medium truncate w-full">
                    {t(`element_${template.type}`)}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full h-7 gap-1 mt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddElement(template);
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    {t("add")}
                  </Button>
                </div>
              ))}
            </div>
            
            {filteredElements.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                {t("no_elements_found")}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </>
  );
};

export default KingdomElementsSidebar;
