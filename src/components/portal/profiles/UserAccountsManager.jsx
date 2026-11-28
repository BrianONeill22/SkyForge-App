import React, { useState, useMemo } from 'react';
import { Trash2 } from 'lucide-react';
import { ROLE_PRESETS, PERMISSION_LABELS } from '../../../data/roles';
import {
  useForgeAuth,
  useForgeCloud,
  useForgeLedgerContext
} from '../../../context/ForgeContext';
import SearchInput from '../../common/SearchInput';

export default function UserAccountsManager({ showSearch = false }) {
  const {
    managedUsers,
    createManagedUser,
    toggleManagedUserOnline,
    updateUserRole,
    toggleUserPermission,
    deleteManagedUser
  } = useForgeLedgerContext();
  const { effectiveAdminUnlocked } = useForgeAuth();
  const { presenceStats } = useForgeCloud();

  const [search, setSearch] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('smith');

  const onlineProfileSessions = presenceStats.onlineProfileSessions || [];

  const filteredUsers = useMemo(() => {
    if (!showSearch || !search.trim()) return managedUsers;
    const q = search.toLowerCase();
    return managedUsers.filter(
      (usr) =>
        (usr.displayName || '').toLowerCase().includes(q) ||
        (usr.username || '').toLowerCase().includes(q) ||
        (usr.role || '').toLowerCase().includes(q)
    );
  }, [managedUsers, search, showSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!effectiveAdminUnlocked) return;
    const ok = createManagedUser({ displayName, username, password, role });
    if (ok) {
      setDisplayName('');
      setUsername('');
      setPassword('');
      setRole('smith');
    }
  };

  return (
    <div className="space-y-4">
      {showSearch && managedUsers.length > 0 && (
        <div className="flex justify-end">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search users or roles..."
            className="w-full sm:w-64"
            clearable={false}
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-4 rounded-lg bg-zinc-950/85 border border-zinc-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
      >
        <div>
          <label className="block text-[11px] text-zinc-400 mb-1">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Eorlund Gray-Mane"
            className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] text-zinc-400 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. eorlund"
            className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] text-zinc-400 mb-1">Password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Set password..."
            className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] text-zinc-400 mb-1">Guild Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none"
          >
            <option value="guest">Guest (View Only)</option>
            <option value="smith">Smith</option>
            <option value="harbinger">Harbinger</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 rounded bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs cursor-pointer"
        >
          + Create User
        </button>
      </form>

      {filteredUsers.length === 0 ? (
        <p className="text-xs text-zinc-500 py-5 text-center">
          {managedUsers.length === 0
            ? 'No custom user accounts created yet. Add one above so members can sign in with their own profile!'
            : 'No user accounts match your search.'}
        </p>
      ) : (
        <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
          {filteredUsers.map((usr) => {
            const perms = usr.permissions || ROLE_PRESETS[usr.role]?.permissions || {};
            const isLiveSession = onlineProfileSessions.some((s) => s.userId === usr.id);
            const isShownOnline =
              usr.isOnline !== false && (isLiveSession || usr.isOnline === true);

            return (
              <div
                key={usr.id}
                className="p-4 rounded-lg bg-zinc-950/75 border border-zinc-800 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isShownOnline ? 'bg-emerald-400' : 'bg-zinc-600'
                      }`}
                    />
                    <span className="text-sm font-bold text-zinc-100">{usr.displayName}</span>
                    <span className="text-xs text-amber-300 font-mono">@{usr.username}</span>
                    <button
                      type="button"
                      onClick={() => effectiveAdminUnlocked && toggleManagedUserOnline(usr.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer border ${
                        isShownOnline
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {isShownOnline ? 'Online' : 'Offline'}
                    </button>
                    <span className="text-[11px] text-zinc-500">
                      • Pass: <code className="text-zinc-300">{usr.password}</code>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-zinc-400">Role:</label>
                    <select
                      value={usr.role}
                      onChange={(e) =>
                        effectiveAdminUnlocked && updateUserRole(usr.id, e.target.value)
                      }
                      className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-xs font-semibold text-amber-200 focus:outline-none"
                    >
                      <option value="guest">Guest</option>
                      <option value="smith">Smith</option>
                      <option value="harbinger">Harbinger</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => effectiveAdminUnlocked && deleteManagedUser(usr.id)}
                      title="Delete User Account"
                      className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/70 border border-zinc-800 text-zinc-400 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-zinc-800/80">
                  {PERMISSION_LABELS.map((perm) => (
                    <label
                      key={perm.key}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-[11px] cursor-pointer transition-colors ${
                        perms[perm.key]
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                          : 'bg-zinc-900/70 border-zinc-800 text-zinc-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(perms[perm.key])}
                        onChange={() =>
                          effectiveAdminUnlocked && toggleUserPermission(usr.id, perm.key)
                        }
                        className="accent-amber-500"
                      />
                      <span className="truncate">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
