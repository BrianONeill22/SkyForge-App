import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function ConfirmDeleteButton({
  onConfirm,
  title = 'Delete',
  confirmLabel = 'Confirm?',
  className = '',
  iconClassName = 'w-3.5 h-3.5',
  tabIndex
}) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return undefined;
    const timer = setTimeout(() => setArmed(false), 3500);
    return () => clearTimeout(timer);
  }, [armed]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!armed) {
      setArmed(true);
      return;
    }
    setArmed(false);
    onConfirm?.();
  };

  if (armed) {
    return (
      <button
        type="button"
        tabIndex={tabIndex}
        onClick={handleClick}
        onBlur={() => setArmed(false)}
        title={`Click again to confirm: ${title}`}
        className="px-2 py-1 rounded-md bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold tracking-tight transition-colors cursor-pointer shrink-0 shadow-sm shadow-red-950/50"
      >
        {confirmLabel}
      </button>
    );
  }

  return (
    <button
      type="button"
      tabIndex={tabIndex}
      onClick={handleClick}
      title={title}
      aria-label={title}
      className={
        className ||
        'p-1.5 rounded-lg bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 transition-colors cursor-pointer'
      }
    >
      <Trash2 className={iconClassName} />
    </button>
  );
}
