
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Target, Dumbbell, Activity } from "lucide-react";
import { useUserData } from "@/context/userData";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Définir le schéma de validation
const targetsFormSchema = z.object({
  gymTarget: z.coerce.number().min(1, "L'objectif doit être d'au moins 1 visite").max(14, "L'objectif ne peut pas dépasser 14 visites par semaine"),
  runningTarget: z.coerce.number().min(1, "L'objectif doit être d'au moins 1 km").max(100, "L'objectif ne peut pas dépasser 100 km par semaine"),
});

type TargetsFormValues = z.infer<typeof targetsFormSchema>;

export function SetTargetsDialog() {
  const [open, setOpen] = useState(false);
  const { userData, updateSportModule } = useUserData();
  const { toast } = useToast();
  
  const form = useForm<TargetsFormValues>({
    resolver: zodResolver(targetsFormSchema),
    defaultValues: {
      gymTarget: userData.sportModule?.weeklyGymTarget || 4,
      runningTarget: userData.sportModule?.weeklyRunningTarget || 15,
    },
  });

  function onSubmit(data: TargetsFormValues) {
    updateSportModule({
      weeklyGymTarget: data.gymTarget,
      weeklyRunningTarget: data.runningTarget,
    });

    toast({
      title: "Objectifs mis à jour",
      description: "Vos objectifs hebdomadaires ont été mis à jour avec succès",
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Target size={16} />
          Définir mes objectifs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Objectifs hebdomadaires</DialogTitle>
          <DialogDescription>
            Définissez vos objectifs d'entraînement hebdomadaires pour la musculation et la course à pied.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="gymTarget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Dumbbell size={16} className="text-purple-500" />
                    Musculation (visites)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nombre de visites en salle par semaine
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="runningTarget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Activity size={16} className="text-blue-500" />
                    Course à pied (km)
                  </FormLabel>
                  <FormControl>
                    <Input type="number" step="0.5" {...field} />
                  </FormControl>
                  <FormDescription>
                    Distance en kilomètres par semaine
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Annuler</Button>
              </DialogClose>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
