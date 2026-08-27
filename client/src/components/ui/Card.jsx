import { clsx } from 'clsx';

const Card = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={clsx(
        'card',
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className }) => {
  return (
    <h3 className={clsx('text-xl font-semibold text-tena-black', className)}>
      {children}
    </h3>
  );
};

const CardDescription = ({ children, className }) => {
  return (
    <p className={clsx('text-gray-600 mt-1', className)}>
      {children}
    </p>
  );
};

const CardContent = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className }) => {
  return (
    <div className={clsx('mt-6 pt-4 border-t border-cloud-gray', className)}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
