
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: "default" | "success" | "warning" | "danger" | "purple" | "gradient" | "minimal" | "indeterminate"
  }
>(({ className, value, variant = "default", ...props }, ref) => {
  const getIndicatorClass = () => {
    switch (variant) {
      case "success":
        return "bg-green-500"
      case "warning":
        return "bg-amber-500"
      case "danger":
        return "bg-red-500"
      case "purple":
        return "bg-purple-500"
      case "gradient":
        return "bg-gradient-to-r from-violet-500 to-purple-500"
      case "minimal":
        return "bg-zinc-800 dark:bg-zinc-300"
      case "indeterminate":
        return "bg-primary animate-pulse"
      default:
        return "bg-primary"
    }
  }

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-3 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 transition-all",
          getIndicatorClass(),
          variant === "indeterminate" ? "animate-progress-indeterminate" : ""
        )}
        style={{ 
          transform: variant === "indeterminate" 
            ? "translateX(-100%)" 
            : `translateX(-${100 - (value || 0)}%)` 
        }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
