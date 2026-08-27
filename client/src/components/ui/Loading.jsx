import { clsx } from 'clsx';

const Loading = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <div className={clsx('spinner', sizes[size], className)} />
  );
};

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-tena-white z-50">
      <Loading size="xl" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

Loading.Screen = LoadingScreen;

export default Loading;
