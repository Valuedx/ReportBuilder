import { motion } from 'framer-motion'
import { cn } from './utils'

export function LoadingSpinner({ 
  size = 'md',
  className,
  ...props 
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={cn(
        'rounded-full border-2 border-gray-200 border-t-primary-600',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
}

export function LoadingSkeleton({ 
  className,
  lines = 1,
  ...props 
}) {
  return (
    <div className={cn('animate-pulse', className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className={cn(
            'h-4 bg-gray-200 rounded',
            i > 0 && 'mt-2',
            i === lines - 1 && lines > 1 && 'w-3/4'
          )}
        />
      ))}
    </div>
  )
}
