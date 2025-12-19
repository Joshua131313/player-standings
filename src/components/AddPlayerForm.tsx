import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddPlayerFormProps {
  onAddPlayer?: (player: {
    name: string;
    avatar: string;
  }) => void;
}

export const AddPlayerForm = ({ onAddPlayer }: AddPlayerFormProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [avatarSeed, setAvatarSeed] = useState("");
  const { toast } = useToast();

  const generatedAvatar = avatarSeed
    ? `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${avatarSeed.toLowerCase().replace(/\s+/g, "")}`
    : `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${name.toLowerCase().replace(/\s+/g, "")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Player name is required",
        variant: "destructive",
      });
      return;
    }

    onAddPlayer?.({
      name: name.trim(),
      avatar: generatedAvatar,
    });

    toast({
      title: "Player Added",
      description: `${name} has been added to the leaderboard!`,
    });

    setName("");
    setAvatarSeed("");
    setOpen(false);
  };

  const handleGenerateRandomSeed = () => {
    const randomSeeds = [
      "phoenix", "dragon", "storm", "blade", "shadow", "thunder",
      "frost", "flame", "venom", "steel", "ghost", "raven"
    ];
    const randomSeed = randomSeeds[Math.floor(Math.random() * randomSeeds.length)] + 
                       Math.floor(Math.random() * 1000);
    setAvatarSeed(randomSeed);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] transition-all duration-300">
          <UserPlus className="w-4 h-4" />
          Add Player
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border/50 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold">
            <span className="gradient-text">NEW</span> PLAYER
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add a new competitor to the arena
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative w-24 h-24 rounded-full border-2 border-primary/50 overflow-hidden bg-secondary/50">
                {name || avatarSeed ? (
                  <img
                    src={generatedAvatar}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Player Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">
              Player Name
            </Label>
            <Input
              id="name"
              placeholder="Enter player name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50"
              maxLength={20}
            />
          </div>

          {/* Avatar Seed */}
          <div className="space-y-2">
            <Label htmlFor="avatarSeed" className="text-foreground font-medium">
              Avatar Style
            </Label>
            <div className="flex gap-2">
              <Input
                id="avatarSeed"
                placeholder="Custom avatar seed (optional)"
                value={avatarSeed}
                onChange={(e) => setAvatarSeed(e.target.value)}
                className="bg-secondary/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 placeholder:text-muted-foreground/50"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGenerateRandomSeed}
                className="shrink-0 border-primary/30 hover:border-primary/50 hover:bg-primary/10"
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Leave empty to generate based on name
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-border/50 hover:bg-secondary/50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.5)] transition-all duration-300"
            >
              Add to Arena
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
