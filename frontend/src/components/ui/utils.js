import { clsx } from 'clsx'

export function cn(...inputs) {
  return clsx(inputs)
}

export const buttonVariants = {
  variant: {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  }
}

export const inputVariants = {
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  },
  variant: {
    default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    error: 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
    success: 'border-success-500 focus:border-success-500 focus:ring-success-500',
  }
}
