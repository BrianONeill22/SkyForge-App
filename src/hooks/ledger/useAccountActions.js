import { useCallback } from 'react';
import { ROLE_PRESETS } from '../../data/roles';
import { getLocalDateString } from '../../utils/formatters';

export function useAccountActions({
  managedUsers,
  setManagedUsers,
  setSmithProfiles,
  showToast
}) {
  const addSmithProfile = useCallback(
    ({ name, title }) => {
      const trimmedName = name.trim();
      if (!trimmedName) return false;
      setSmithProfiles((prev) => [
        ...prev,
        {
          id: `prof_${Date.now()}`,
          name: trimmedName,
          title: (title || '').trim() || 'Skyforge Smith',
          roleType: 'smith'
        }
      ]);
      showToast('Added smith profile to roster.');
      return true;
    },
    [setSmithProfiles, showToast]
  );

  const toggleSmithOnline = useCallback(
    (profId) => {
      setSmithProfiles((prev) =>
        prev.map((p) =>
          p.id === profId ? { ...p, isOnline: p.isOnline === false ? true : false } : p
        )
      );
    },
    [setSmithProfiles]
  );

  const deleteSmithProfile = useCallback(
    (profId) => {
      setSmithProfiles((prev) => prev.filter((p) => p.id !== profId));
    },
    [setSmithProfiles]
  );

  const createManagedUser = useCallback(
    ({ displayName: rawDisplay, username: rawUsername, password: rawPassword, role }) => {
      const displayName = rawDisplay.trim();
      const username = rawUsername.trim();
      const password = rawPassword.trim();
      if (!displayName || !username || !password) {
        showToast('Please fill in Name, Username, and Password.', 'error');
        return false;
      }
      const exists = managedUsers.some(
        (u) => u.username.trim().toLowerCase() === username.toLowerCase()
      );
      if (exists) {
        showToast(`Username "${username}" is already taken.`, 'error');
        return false;
      }

      const preset = ROLE_PRESETS[role] || ROLE_PRESETS.smith;
      const createdUser = {
        id: `usr_${Date.now()}`,
        displayName,
        username,
        password,
        role,
        title: preset.title,
        isOnline: true,
        permissions: { ...preset.permissions },
        createdAt: getLocalDateString(0)
      };

      setManagedUsers((prev) => [...prev, createdUser]);
      showToast(`Created ${preset.label} account for ${displayName} (@${username})!`);
      return true;
    },
    [managedUsers, setManagedUsers, showToast]
  );

  const updateUserRole = useCallback(
    (userId, nextRole) => {
      const preset = ROLE_PRESETS[nextRole] || ROLE_PRESETS.smith;
      setManagedUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                role: nextRole,
                title: preset.title,
                permissions: { ...preset.permissions }
              }
            : u
        )
      );
      showToast(`Updated user role to ${preset.label}.`);
    },
    [setManagedUsers, showToast]
  );

  const toggleUserPermission = useCallback(
    (userId, permKey) => {
      setManagedUsers((prev) =>
        prev.map((u) => {
          if (u.id !== userId) return u;
          const currentPerms = u.permissions || ROLE_PRESETS[u.role]?.permissions || {};
          const nextVal = !currentPerms[permKey];
          const updatedPerms = { ...currentPerms, [permKey]: nextVal };
          return {
            ...u,
            role: permKey === 'isAdmin' && nextVal ? 'admin' : u.role,
            permissions: updatedPerms
          };
        })
      );
    },
    [setManagedUsers]
  );

  const toggleManagedUserOnline = useCallback(
    (userId) => {
      setManagedUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isOnline: u.isOnline === false ? true : false } : u
        )
      );
    },
    [setManagedUsers]
  );

  const setManagedUserOnline = useCallback(
    (userId, isOnline) => {
      setManagedUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isOnline } : u)));
    },
    [setManagedUsers]
  );

  const deleteManagedUser = useCallback(
    (userId) => {
      setManagedUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast('User account removed.');
    },
    [setManagedUsers, showToast]
  );

  return {
    addSmithProfile,
    toggleSmithOnline,
    deleteSmithProfile,
    createManagedUser,
    updateUserRole,
    toggleUserPermission,
    toggleManagedUserOnline,
    setManagedUserOnline,
    deleteManagedUser
  };
}
