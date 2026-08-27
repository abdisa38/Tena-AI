import { Fragment } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

const Modal = ({ isOpen, onClose, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className={clsx(
              'relative w-full bg-tena-white rounded-xl shadow-strong animate-slide-up',
              sizes[size]
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const ModalHeader = ({ children, onClose }) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-cloud-gray">
      <div>{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-cloud-gray transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

const ModalTitle = ({ children }) => {
  return (
    <h3 className="text-2xl font-semibold text-tena-black">
      {children}
    </h3>
  );
};

const ModalBody = ({ children, className }) => {
  return (
    <div className={clsx('p-6', className)}>
      {children}
    </div>
  );
};

const ModalFooter = ({ children, className }) => {
  return (
    <div className={clsx('flex items-center justify-end gap-3 p-6 border-t border-cloud-gray', className)}>
      {children}
    </div>
  );
};

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;
