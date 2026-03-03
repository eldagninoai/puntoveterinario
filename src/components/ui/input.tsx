import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, style, ...props }, ref) => {
        const dynamicStyle: React.CSSProperties = {
            padding: 'max(0.6rem, 1vw)',
            fontSize: 'max(0.9rem, 1.2vw)',
            borderRadius: 'var(--radius-sm)',
            ...style
        }

        return (
            <input
                type={type}
                className={cn(
                    "flex w-full border-[0.15rem] border-[var(--color-border)] bg-[var(--color-bg-soft)] text-[var(--color-primary-dark)] file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--color-text-soft)] placeholder:opacity-70 focus-visible:outline-none focus-visible:border-[var(--color-primary)] focus-visible:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
                    className
                )}
                ref={ref}
                style={dynamicStyle}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
