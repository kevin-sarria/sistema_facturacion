import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'success' | 'amber';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-stone-900 text-white hover:bg-stone-800 shadow-sm',
      destructive: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
      outline: 'border border-stone-300 bg-white hover:bg-stone-50 text-stone-700',
      secondary: 'bg-stone-100 text-stone-800 hover:bg-stone-200',
      ghost: 'hover:bg-stone-100 text-stone-700',
      success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20',
      amber: 'bg-amber-600 text-white hover:bg-amber-700 shadow-sm shadow-amber-600/20',
    };

    const sizes = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-12 px-6 text-base',
      icon: 'h-9 w-9 p-0 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-1',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
