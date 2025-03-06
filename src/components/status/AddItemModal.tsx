
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "../../context/LanguageContext";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
  type: "course" | "language" | "skill";
}

const languageLevelDescriptions = {
  "A1": "Beginner (17%)",
  "A2": "Elementary (33%)",
  "B1": "Intermediate (50%)",
  "B2": "Upper Intermediate (67%)",
  "C1": "Advanced (83%)",
  "C2": "Proficient (100%)"
};

// Helper to convert language level to progress percentage
const levelToProgress = {
  "A1": 17,
  "A2": 33,
  "B1": 50,
  "B2": 67,
  "C1": 83,
  "C2": 100
};

const AddItemModal = ({ isOpen, onClose, onSave, type }: AddItemModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState("A1");
  const [deadline, setDeadline] = useState("");

  // Update progress when language level changes
  useEffect(() => {
    if (type === "language" && level) {
      setProgress(levelToProgress[level as keyof typeof levelToProgress]);
    }
  }, [level, type]);

  const handleLevelChange = (newLevel: string) => {
    setLevel(newLevel);
    if (type === "language") {
      setProgress(levelToProgress[newLevel as keyof typeof levelToProgress]);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: t("error"),
        description: t("titleRequired"),
        variant: "destructive",
      });
      return;
    }

    const newItem = {
      id: `${type}-${Date.now()}`,
      title,
      type,
      progress,
      completed: progress === 100,
    };

    // Ajouter des propriétés spécifiques au type
    if (type === "language") {
      Object.assign(newItem, { level });
    } else if (type === "course") {
      Object.assign(newItem, { deadline });
    }

    onSave(newItem);
    onClose();
    resetForm();
    
    toast({
      title: t("success"),
      description: t("itemAdded"),
    });
  };

  const resetForm = () => {
    setTitle("");
    setProgress(0);
    setLevel("A1");
    setDeadline("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glass-card">
        <DialogHeader>
          <DialogTitle className="font-pixel">
            {type === "course" && t("addCourse")}
            {type === "language" && t("addLanguage")}
            {type === "skill" && t("addSkill")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("enterTitle")}
            />
          </div>
          
          {type === "course" && (
            <div className="grid gap-2">
              <Label htmlFor="deadline">{t("deadline")}</Label>
              <Input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          )}
          
          {type === "language" && (
            <div className="grid gap-2">
              <Label htmlFor="level">{t("level")}</Label>
              <Select value={level} onValueChange={handleLevelChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectLevel")} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(languageLevelDescriptions).map(([lvl, description]) => (
                    <SelectItem key={lvl} value={lvl}>{lvl} - {description}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="progress">
              {t("progress")}: {progress}%
              {type === "language" && level && ` (${level})`}
            </Label>
            <Slider
              value={[progress]}
              max={100}
              step={5}
              onValueChange={(value) => setProgress(value[0])}
              disabled={type === "language"} // Disable manual slider adjustment for languages
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSave} className="pixel-button">
            {t("save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemModal;
