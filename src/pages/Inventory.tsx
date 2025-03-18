
import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { Package, Shirt, Shield, Sword, Wand2, Gem, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from "../hooks/useTranslation";
import { TranslationKey } from "../translations";

type InventoryItem = {
  id: string;
  name: string;
  description: string;
  type: "weapon" | "armor" | "accessory" | "consumable" | "special";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  quantity: number;
  equipped?: boolean;
  icon: React.ReactNode;
};

const Inventory = () => {
  const { t } = useTranslation();
  
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: "1",
      name: t("productivityPen"),
      description: t("productivityPenDesc"),
      type: "weapon",
      rarity: "uncommon",
      quantity: 1,
      equipped: true,
      icon: <Sword size={20} />
    },
    {
      id: "2",
      name: t("knowledgeTome"),
      description: t("knowledgeTomeDesc"),
      type: "weapon",
      rarity: "rare",
      quantity: 1,
      icon: <Wand2 size={20} />
    },
    {
      id: "3",
      name: t("focusHelmet"),
      description: t("focusHelmetDesc"),
      type: "armor",
      rarity: "uncommon",
      quantity: 1,
      equipped: true,
      icon: <Shield size={20} />
    },
    {
      id: "4",
      name: t("comfortableShirt"),
      description: t("comfortableShirtDesc"),
      type: "armor",
      rarity: "common",
      quantity: 3,
      icon: <Shirt size={20} />
    },
    {
      id: "5",
      name: t("motivationGem"),
      description: t("motivationGemDesc"),
      type: "accessory",
      rarity: "epic",
      quantity: 1,
      icon: <Gem size={20} />
    },
    {
      id: "6",
      name: t("experienceBoost"),
      description: t("experienceBoostDesc"),
      type: "consumable",
      rarity: "uncommon",
      quantity: 5,
      icon: <Package size={20} />
    }
  ]);
  
  const [currentTab, setCurrentTab] = useState<string>("all");
  const [filterRarity, setFilterRarity] = useState<string | null>(null);
  
  const rarityColors = {
    common: "bg-gray-200 text-gray-800",
    uncommon: "bg-green-200 text-green-800",
    rare: "bg-blue-200 text-blue-800",
    epic: "bg-purple-200 text-purple-800",
    legendary: "bg-amber-200 text-amber-800"
  };
  
  const equipItem = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return {...item, equipped: true};
      }
      // Unequip other items of the same type
      if (item.type === items.find(i => i.id === id)?.type && item.equipped) {
        return {...item, equipped: false};
      }
      return item;
    }));
  };
  
  const unequipItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? {...item, equipped: false} : item
    ));
  };
  
  const useConsumable = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity - 1;
        if (newQuantity <= 0) {
          return null;
        }
        return {...item, quantity: newQuantity};
      }
      return item;
    }).filter(Boolean) as InventoryItem[]);
  };
  
  const filteredItems = items.filter(item => {
    // Filter by tab
    if (currentTab !== "all" && item.type !== currentTab) return false;
    
    // Filter by rarity
    if (filterRarity && item.rarity !== filterRarity) return false;
    
    return true;
  });

  // Helper function to safely translate rarity as a known translation key
  const translateRarity = (rarity: string): string => {
    // Only translate if it's a known key
    if (rarity === "common" || rarity === "uncommon" || rarity === "rare" || 
        rarity === "epic" || rarity === "legendary") {
      return t(rarity as TranslationKey);
    }
    return rarity;
  };
  
  return (
    <MainLayout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t("inventory")}</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter size={16} className="mr-2" />
                {filterRarity ? translateRarity(filterRarity) : t("filterByRarity")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterRarity(null)}>
                {t("all")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRarity("common")}>
                {t("common")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRarity("uncommon")}>
                {t("uncommon")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRarity("rare")}>
                {t("rare")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRarity("epic")}>
                {t("epic")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRarity("legendary")}>
                {t("legendary")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <Tabs defaultValue="all" onValueChange={setCurrentTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">
              <Package size={16} className="mr-2" />
              {t("all")}
            </TabsTrigger>
            <TabsTrigger value="weapon">
              <Sword size={16} className="mr-2" />
              {t("weapons")}
            </TabsTrigger>
            <TabsTrigger value="armor">
              <Shield size={16} className="mr-2" />
              {t("armor")}
            </TabsTrigger>
            <TabsTrigger value="accessory">
              <Gem size={16} className="mr-2" />
              {t("accessories")}
            </TabsTrigger>
            <TabsTrigger value="consumable">
              <Package size={16} className="mr-2" />
              {t("consumables")}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={currentTab} className="mt-0">
            {filteredItems.length === 0 ? (
              <Card className="text-center p-8">
                <div className="flex flex-col items-center gap-4">
                  <Package size={48} className="text-muted-foreground" />
                  <h3 className="text-xl font-semibold">{t("noItemsFound")}</h3>
                  <p className="text-muted-foreground">{t("tryDifferentFilter")}</p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                  <Card key={item.id} className={`transition-all ${item.equipped ? 'border-zou-purple' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-muted rounded-md">
                            {item.icon}
                          </div>
                          <CardTitle className="text-base">
                            {item.name}
                          </CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={rarityColors[item.rarity]}>
                            {translateRarity(item.rarity)}
                          </Badge>
                          {item.equipped && (
                            <Badge variant="default">
                              {t("equipped")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{t("quantity")}:</span>
                          <span className="text-sm">{item.quantity}</span>
                        </div>
                        <div className="flex gap-2">
                          {item.type === "consumable" ? (
                            <Button size="sm" onClick={() => useConsumable(item.id)}>
                              {t("use")}
                            </Button>
                          ) : item.equipped ? (
                            <Button size="sm" variant="outline" onClick={() => unequipItem(item.id)}>
                              {t("unequip")}
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => equipItem(item.id)}>
                              {t("equip")}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Inventory;
