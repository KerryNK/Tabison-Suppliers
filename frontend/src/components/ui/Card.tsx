import React from 'react'
import { cn } from '../../utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  interactive?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'md',
    hover = false,
    interactive = false,
    children, 
    ...props 
  }, ref) => {
    const baseStyles = `
      bg-white rounded-xl transition-all duration-200 ease-in-out
      border border-gray-100/50
    `

    const variants = {
      default: `
        shadow-sm hover:shadow-md
      `,
      elevated: `
        shadow-lg hover:shadow-xl
        border-0
      `,
      outlined: `
        shadow-none border-2 border-gray-200
        hover:border-gray-300
      `,
      flat: `
        shadow-none border-0
        bg-gray-50/50
      `
    }

    const paddingStyles = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    }

    const hoverStyles = hover ? `
      hover:scale-[1.02] hover:shadow-lg cursor-pointer
      transform-gpu
    ` : ''

    const interactiveStyles = interactive ? `
      focus:outline-none focus:ring-2 focus:ring-[#1D6D73]/20 focus:ring-offset-2
      active:scale-[0.98] cursor-pointer
    ` : ''

    return (
      <div
        className={cn(
          baseStyles,
          variants[variant],
          paddingStyles[padding],
          hoverStyles,
          interactiveStyles,
          className
        )}
        ref={ref}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card Header Component
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// Card Title Component
export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-gray-900",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// Card Description Component
export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-600 leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// Card Content Component
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

// Card Footer Component
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4 border-t border-gray-100", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export default Card