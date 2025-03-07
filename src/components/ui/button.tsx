
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { playSound } from "@/utils/audioUtils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        template: "border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 hover:border-purple-300",
        sound: "bg-primary text-primary-foreground hover:bg-primary/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  sound?: keyof typeof soundEffects | false
}

// Obtenir les noms des sons depuis audioUtils sans importer tout le fichier
type soundEffects = {
  click: string
  badge: string
  levelUp: string
  success: string
  delete: string
  achievement: string
  transaction: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, sound = 'click', onClick, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Jouer le son si spécifié et non désactivé
      if (sound !== false) {
        playSound(sound);
      }
      
      // Appeler le gestionnaire onClick d'origine s'il existe
      if (onClick) {
        onClick(event);
      }
    };
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        onClick={handleClick}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
