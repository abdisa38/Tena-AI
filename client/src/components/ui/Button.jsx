import { forwardRef } from 'react';
import { clsx } from 'clsx';

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      className,
      disabled,
      loading,
      icon: Icon,
      iconPosition = 'left',
      ...props
    },
    ref
  ) => {
    const baseStyles = 'btn';

    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      outline: 'btn-outline',
      ghost: 'btn-ghost',
    };

    const sizes = {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    };

    return (
      <button
        ref={ref}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 spinner" />
        )}
        
        {!loading && Icon && iconPosition === 'left' && (
          <Icon className="w-5 h-5" />
        )}
        
        {children}
        
        {!loading && Icon && iconPosition === 'right' && (
          <Icon className="w-5 h-5" />
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
