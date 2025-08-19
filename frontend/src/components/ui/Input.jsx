import { forwardRef } from 'react'
import { cn, inputVariants } from './utils'

const Input = forwardRef(({ 
  className,
  type = 'text',
  size = 'md',
  variant = 'default',
  error,
  ...props 
}, ref) => {
  const baseClasses = 'block w-full rounded-lg border shadow-sm transition-colors duration-200 focus:outline-none focus:ring-1 placeholder:text-gray-400'
  
  const finalVariant = error ? 'error' : variant
  
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        baseClasses,
        inputVariants.size[size],
        inputVariants.variant[finalVariant],
        className
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export { Input }
