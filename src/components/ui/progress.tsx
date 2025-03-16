
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    variant?: "default" | "success" | "warning" | "danger" | "purple" | "gradient" | "minimal" | "income" | "expense" | "savings" | "emerald" | "blue" | "red" | "green"
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
      case "emerald":
        return "bg-emerald-500"
      case "blue":
        return "bg-blue-500"
      case "red":
        return "bg-red-500"
      case "green":
        return "bg-green-500"
      case "gradient":
        return "bg-gradient-to-r from-violet-500 to-purple-500"
      case "minimal":
        return "bg-zinc-800 dark:bg-zinc-300"
      case "income":
        return "bg-gradient-to-r from-purple-500 to-violet-500"
      case "expense":
        return "bg-gradient-to-r from-orange-500 to-red-500"
      case "savings":
        return "bg-gradient-to-r from-emerald-500 to-green-500"
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
          getIndicatorClass()
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
