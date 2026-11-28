import React from 'react';
import { AlertCircle, Sparkles } from 'lucide-react';
import { useForgeToast } from '../../context/ForgeContext';

export default function Toast() {
  const { toastMsg } = useForgeToast();
  if (!toastMsg) return null;

  const isError = toastMsg.type === 'error';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-16 right-4 z-[60] max-w-sm px-4 py-3 rounded-xl border shadow-2xl text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md transition-all ${
        isError
          ? 'bg-red-950/95 border-red-500/60 text-red-100'
          : 'bg-zinc-900/95 border-amber-500/60 text-amber-100'
      }`}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
      ) : (
        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
      )}
      <span className="leading-snug">{toastMsg.text}</span>
    </div>
  );
}
