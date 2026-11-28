import React, { useState, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { useForgeAuth, useForgeLedgerContext } from '../../../context/ForgeContext';
import SearchInput from '../../common/SearchInput';

export default function SmithRosterPanel() {
  const { smithProfiles, addSmithProfile, toggleSmithOnline, deleteSmithProfile } =
    useForgeLedgerContext();
  const { canEditStock } = useForgeAuth();

  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Apprentice Smith');

  const filteredProfiles = useMemo(() => {
    if (!search.trim()) return smithProfiles;
    const q = search.toLowerCase();
    return smithProfiles.filter(
      (prof) =>
        prof.name.toLowerCase().includes(q) || (prof.title || '').toLowerCase().includes(q)
    );
  }, [smithProfiles, search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canEditStock) return;
    if (addSmithProfile({ name, title })) {
      setName('');
    }
  };

  return (
    <div className="bg-[#18181b] border border-zinc-800/90 rounded-xl p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-serif font-bold text-zinc-100">Skyforge Smith Roster</h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Track active smiths working the Whiterun forge.
          </p>
        </div>
        {smithProfiles.length > 0 && (
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search roster..."
            className="w-full sm:w-44"
            iconClassName="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2"
            inputClassName="w-full pl-8 pr-3 py-1 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
            clearable={false}
          />
        )}
      </div>

      {canEditStock && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Smith name"
            className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
          />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Rank / Title"
            className="px-3 py-2 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
          >
            Add Smith
          </button>
        </form>
      )}

      {smithProfiles.length === 0 ? (
        <p className="text-xs text-zinc-500 py-4 text-center">No smith profiles added yet.</p>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {filteredProfiles.map((prof) => {
            const isProfOnline = prof.isOnline !== false;
            return (
              <div
                key={prof.id}
                className="p-3 rounded-lg bg-zinc-950/75 border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isProfOnline ? 'bg-emerald-400' : 'bg-zinc-600'
                    }`}
                  />
                  <div>
                    <div className="font-bold text-zinc-100">{prof.name}</div>
                    <div className="text-[11px] text-zinc-500">{prof.title}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canEditStock ? (
                    <button
                      type="button"
                      onClick={() => toggleSmithOnline(prof.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer border ${
                        isProfOnline
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {isProfOnline ? 'Online' : 'Offline'}
                    </button>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isProfOnline ? 'text-emerald-400' : 'text-zinc-500'
                      }`}
                    >
                      {isProfOnline ? 'Online' : 'Offline'}
                    </span>
                  )}
                  {canEditStock && (
                    <button
                      type="button"
                      onClick={() => deleteSmithProfile(prof.id)}
                      className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/70 text-zinc-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
