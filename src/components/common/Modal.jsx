import React from 'react';
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
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
                  className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
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
