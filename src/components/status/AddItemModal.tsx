
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "../../context/LanguageContext";
import { StatusItem, CourseItem, LanguageItem, SkillItem } from "../../types/course";

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: StatusItem) => void;
  type: "course" | "language" | "skill";
}

const AddItemModal = ({ isOpen, onClose, onSave, type }: AddItemModalProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [level, setLevel] = useState("A1");
  const [deadline, setDeadline] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: t("error"),
        description: t("titleRequired"),
        variant: "destructive",
      });
      return;
    }

    const baseItem = {
      id: `${type}-${Date.now()}`,
      title,
      progress,
      completed: progress === 100
    };

    let newItem: StatusItem;

    if (type === "language") {
      newItem = {
        ...baseItem,
        type,
        level
      } as LanguageItem;
    } else if (type === "course") {
      newItem = {
        ...baseItem,
        type,
        deadline
      } as CourseItem;
    } else {
      // type === "skill"
      newItem = {
        ...baseItem,
        type
      } as SkillItem;
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
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectLevel")} />
                </SelectTrigger>
                <SelectContent>
                  {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="progress">{t("progress")}: {progress}%</Label>
            <Slider
              value={[progress]}
              max={100}
              step={5}
              onValueChange={(value) => setProgress(value[0])}
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
