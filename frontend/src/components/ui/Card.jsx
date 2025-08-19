import { motion } from 'framer-motion'
import { cn } from './utils'

export function Card({ 
  className, 
  children, 
  hover = true,
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      className={cn(
        'bg-white rounded-2xl border border-gray-200 shadow-soft transition-all duration-300',
        hover && 'hover:shadow-medium',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div 
      className={cn('px-6 py-4 border-b border-gray-100', className)} 
      {...props}
    >
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div 
      className={cn('px-6 py-4', className)} 
      {...props}
    >
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div 
      className={cn('px-6 py-4 border-t border-gray-100', className)} 
      {...props}
    >
      {children}
    </div>
  )
}
