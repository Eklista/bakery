import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  fullWidth = false,
  ...props
}) => {
  return (
    <button
      className={cn(
        'btn font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-primary text-white hover:bg-primary-dark focus-visible:ring-primary shadow-md hover:shadow-lg': variant === 'primary',
          'bg-secondary text-white hover:bg-secondary-dark focus-visible:ring-secondary shadow-md hover:shadow-lg': variant === 'secondary',
          'bg-accent text-text hover:bg-accent-dark focus-visible:ring-accent shadow-md hover:shadow-lg': variant === 'accent',
          'border border-border text-text hover:bg-surface focus-visible:ring-primary shadow-sm hover:shadow-md': variant === 'outline',
          'text-primary hover:bg-primary/10 focus-visible:ring-primary': variant === 'ghost',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 text-sm': size === 'md',
          'h-12 px-6 text-base': size === 'lg',
          'h-14 px-8 text-lg': size === 'xl',
        },
        {
          'w-full': fullWidth,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};