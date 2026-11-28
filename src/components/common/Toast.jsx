import React from 'react';
import { Sparkles } from 'lucide-react';
import { useForgeToast } from '../../context/ForgeContext';

export default function Toast() {
  const { toastMsg } = useForgeToast();
  if (!toastMsg) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg border shadow-2xl text-xs font-semibold flex items-center gap-2 transition-all ${
        toastMsg.type === 'error'
          ? 'bg-red-950/95 border-red-500/60 text-red-200'
          : 'bg-zinc-900/95 border-amber-500/60 text-amber-200'
      }`}
    >
      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
      <span>{toastMsg.text}</span>
    </div>
  );
}
