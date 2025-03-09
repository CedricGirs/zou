
import { Tabs, TabsList as ShadcnTabsList, TabsTrigger } from "@/components/ui/tabs";

const TabsList = () => {
  return (
    <ShadcnTabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
      <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
      <TabsTrigger value="budget">Budget</TabsTrigger>
      <TabsTrigger value="transactions">Transactions</TabsTrigger>
      <TabsTrigger value="savings">Épargne</TabsTrigger>
      <TabsTrigger value="reports">Rapports</TabsTrigger>
      <TabsTrigger value="quests">Quêtes</TabsTrigger>
    </ShadcnTabsList>
  );
};

export default TabsList;
