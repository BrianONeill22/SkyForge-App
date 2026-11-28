import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  title,
  subtitle,
  titleClassName = 'text-amber-200',
  icon,
  headerRight,
  maxWidthClass = 'max-w-md',
  borderClass = 'border-zinc-800',
  onClose,
  children
}) {
  useEffect(() => {
    if (!onClose) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs"
      onClick={(e) => {
        if (onClose && e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-[#18181b] border ${borderClass} rounded-xl ${maxWidthClass} w-full max-h-[90vh] flex flex-col shadow-2xl`}
      >
        {(title || onClose) && (
          <div className="p-5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {icon}
              <div>
                {title && (
                  <h3 className={`text-base font-serif font-bold ${titleClassName}`}>{title}</h3>
                )}
                {subtitle && <p className="text-xs text-zinc-400">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {headerRight}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  title="Close (Esc)"
                  className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
