import React from 'react'
import { cn } from '../../utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 
      font-medium transition-all duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
      relative overflow-hidden group
    `

    const variants = {
      primary: `
        bg-[#1D6D73] text-white border border-[#1D6D73]
        hover:bg-[#155e63] hover:border-[#155e63] hover:shadow-lg hover:shadow-[#1D6D73]/20
        focus:ring-[#1D6D73]/30 active:scale-[0.98]
        before:absolute before:inset-0 before:bg-white/10 before:translate-y-full 
        before:transition-transform before:duration-300 hover:before:translate-y-0
      `,
      secondary: `
        bg-white text-[#1D6D73] border border-gray-300
        hover:bg-gray-50 hover:border-gray-400 hover:shadow-md
        focus:ring-gray-500/30 active:scale-[0.98]
      `,
      outline: `
        bg-transparent text-[#1D6D73] border border-[#1D6D73]
        hover:bg-[#1D6D73] hover:text-white hover:shadow-lg hover:shadow-[#1D6D73]/20
        focus:ring-[#1D6D73]/30 active:scale-[0.98]
        transition-colors duration-200
      `,
      ghost: `
        bg-transparent text-gray-700 border border-transparent
        hover:bg-gray-100 hover:text-gray-900
        focus:ring-gray-500/30 active:scale-[0.98]
      `,
      link: `
        bg-transparent text-[#1D6D73] border border-transparent
        hover:text-[#155e63] hover:underline
        focus:ring-[#1D6D73]/30 p-0 h-auto
      `
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-md',
      md: 'h-10 px-4 py-2 text-sm rounded-lg',
      lg: 'h-12 px-6 py-3 text-base rounded-lg',
      xl: 'h-14 px-8 py-4 text-lg rounded-xl'
    }

    const buttonContent = (
      <>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-[inherit]">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
        
        <div className={cn("flex items-center gap-2", loading && "opacity-0")}>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </div>
      </>
    )

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {buttonContent}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button