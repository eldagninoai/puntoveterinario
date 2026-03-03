import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] hover:-translate-y-[0.15rem] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
                destructive: "bg-red-500 text-white hover:bg-red-600",
                outline: "border-[0.1rem] border-[var(--color-primary-dark)] bg-transparent hover:bg-[var(--color-primary-dark)] hover:text-white hover:-translate-y-[0.15rem]",
                secondary: "bg-[var(--color-bg-soft)] text-[var(--color-primary-dark)] hover:bg-[var(--color-border)]",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "",
                sm: "",
                lg: "",
                icon: "",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, style, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        const dynamicStyle: React.CSSProperties = {
            padding: 'max(0.7rem, 1.2vw) max(1.5rem, 2.5vw)',
            fontSize: 'max(0.9rem, 1.3vw)',
            borderRadius: 'var(--radius)',
            ...style
        }

        if (size === "sm") {
            dynamicStyle.padding = 'max(0.5rem, 0.8vw) max(1rem, 1.5vw)'
            dynamicStyle.fontSize = 'max(0.8rem, 1.1vw)'
        } else if (size === "lg") {
            dynamicStyle.padding = 'max(1rem, 1.5vw) max(2rem, 3vw)'
            dynamicStyle.fontSize = 'max(1.1rem, 1.6vw)'
        }

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                style={dynamicStyle}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
