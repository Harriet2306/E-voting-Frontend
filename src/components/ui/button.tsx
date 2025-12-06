import * as React from "react"
import { cn } from "../../lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-primary text-primary-foreground hover:bg-primary-dark shadow-lg shadow-primary/30 hover:shadow-primary/50 active:scale-95": variant === "default",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/30": variant === "destructive",
            "border-2 border-primary bg-transparent text-primary hover:bg-primary-light hover:border-primary-dark active:scale-95": variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary-dark shadow-lg shadow-secondary/30": variant === "secondary",
            "hover:bg-muted hover:text-foreground text-muted-foreground": variant === "ghost",
            "text-primary underline-offset-4 hover:underline": variant === "link",
          },
          {
            "h-12 px-6 rounded-md text-base": size === "default",
            "h-9 rounded-md px-4 text-sm": size === "sm",
            "h-14 rounded-md px-8 text-lg": size === "lg",
            "h-10 w-10 rounded-md": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
