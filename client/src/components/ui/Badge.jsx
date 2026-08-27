import { clsx } from 'clsx';

const Badge = ({ children, variant = 'info', className }) => {
  const variants = {
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
    info: 'badge-info',
  };

  return (
    <span className={clsx('badge', variants[variant], className)}>
      {children}
    </span>
  );
};

export default Badge;
