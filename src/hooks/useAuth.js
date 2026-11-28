import { useState, useEffect, useMemo, useCallback } from 'react';
import { ROLE_PRESETS, FORGE_PASSCODES } from '../data/roles';
import { readSessionJson, readSessionBool, writeSessionValue } from '../utils/storage';

export function useAuth({ managedUsers, setManagedUserOnline, showToast }) {
  const [workerProfile, setWorkerProfile] = useState(() =>
    readSessionJson('skyforge_active_profile', null)
  );
  const [viewMode, setViewMode] = useState(() => (workerProfile ? 'worker' : 'public'));
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() =>
    readSessionBool('skyforge_admin_unlocked', false)
  );
  const [profileOnlineStatus, setProfileOnlineStatus] = useState(true);

  useEffect(() => {
    writeSessionValue('skyforge_active_profile', workerProfile);
    writeSessionValue('skyforge_admin_unlocked', String(isAdminUnlocked));
  }, [workerProfile, isAdminUnlocked]);

  const activeUserRecord = useMemo(() => {
    if (!workerProfile?.userId) return null;
    return managedUsers.find((u) => u.id === workerProfile.userId) || null;
  }, [workerProfile, managedUsers]);

  const effectiveRole = activeUserRecord?.role || workerProfile?.roleType || 'guest';

  const effectivePermissions = useMemo(() => {
    if (activeUserRecord?.permissions) {
      return activeUserRecord.permissions;
    }
    return ROLE_PRESETS[effectiveRole]?.permissions || ROLE_PRESETS.guest.permissions;
  }, [activeUserRecord, effectiveRole]);

  const effectiveAdminUnlocked = isAdminUnlocked || Boolean(effectivePermissions.isAdmin);
  const canLogSalesPurchases = Boolean(effectivePermissions.logSalesPurchases);
  const canManageOrders = Boolean(effectivePermissions.manageOrders);
  const canEditStock = Boolean(effectivePermissions.editStock);
  const canEditRecipes = Boolean(effectivePermissions.editRecipes);

  const loginWithAccount = useCallback(
    (usernameRaw, passwordRaw) => {
      const uname = usernameRaw.trim().toLowerCase();
      const pwd = passwordRaw.trim();
      if (!uname || !pwd) {
        return { ok: false, error: 'Enter both your username and password.' };
      }

      if (uname === 'admin' && pwd === FORGE_PASSCODES.admin) {
        setWorkerProfile({
          id: 'admin_session',
          name: 'Master Forgemaster',
          username: 'admin',
          title: 'Keeper of the Skyforge',
          roleType: 'admin'
        });
        setIsAdminUnlocked(true);
        setViewMode('worker');
        setProfileOnlineStatus(true);
        return { ok: true };
      }

      const matchedUser = managedUsers.find(
        (u) => u.username.trim().toLowerCase() === uname && u.password === pwd
      );

      if (!matchedUser) {
        return { ok: false, error: 'Invalid username or password.' };
      }

      const roleMeta = ROLE_PRESETS[matchedUser.role] || ROLE_PRESETS.smith;
      setWorkerProfile({
        id: matchedUser.id,
        userId: matchedUser.id,
        name: matchedUser.displayName,
        username: matchedUser.username,
        title: matchedUser.title || roleMeta.title,
        roleType: matchedUser.role
      });
      setIsAdminUnlocked(Boolean(matchedUser.permissions?.isAdmin || matchedUser.role === 'admin'));
      setViewMode('worker');
      setProfileOnlineStatus(matchedUser.isOnline !== false);
      showToast(`Welcome back, ${matchedUser.displayName} (${roleMeta.label})!`);
      return { ok: true };
    },
    [managedUsers, showToast]
  );

  const loginWithPasscode = useCallback((passcodeRaw) => {
    const code = passcodeRaw.trim();
    if (code === FORGE_PASSCODES.smith) {
      setWorkerProfile({
        id: 'smith_session',
        name: 'Skyforge Smith',
        title: 'Journeyman Forgemaster',
        roleType: 'smith'
      });
      setIsAdminUnlocked(false);
      setProfileOnlineStatus(true);
      setViewMode('worker');
      return { ok: true };
    }
    if (code === FORGE_PASSCODES.admin) {
      setWorkerProfile({
        id: 'admin_session',
        name: 'Master Forgemaster',
        title: 'Keeper of the Skyforge',
        roleType: 'admin'
      });
      setIsAdminUnlocked(true);
      setProfileOnlineStatus(true);
      setViewMode('worker');
      return { ok: true };
    }
    if (code === FORGE_PASSCODES.guest) {
      setWorkerProfile({
        id: 'guest_session',
        name: 'Whiterun Guest',
        title: 'Ledger Observer (View Only)',
        roleType: 'guest'
      });
      setIsAdminUnlocked(false);
      setProfileOnlineStatus(true);
      setViewMode('worker');
      return { ok: true };
    }
    return {
      ok: false,
      error: 'Invalid Forge Passcode. Speak the true words of Whiterun.'
    };
  }, []);

  const unlockAdmin = useCallback(
    (passcodeRaw) => {
      if (passcodeRaw.trim() === FORGE_PASSCODES.admin) {
        setIsAdminUnlocked(true);
        showToast('Master Admin unlocked! Admin Sidebar & User Manager are now available.');
        return { ok: true };
      }
      return { ok: false, error: 'Incorrect Master Admin Passcode.' };
    },
    [showToast]
  );

  const signOut = useCallback(() => {
    setWorkerProfile(null);
    setIsAdminUnlocked(false);
    setViewMode('public');
  }, []);

  const toggleMyOnlineStatus = useCallback(() => {
    setProfileOnlineStatus((prev) => {
      const nextOnline = !prev;
      if (workerProfile?.userId) {
        setManagedUserOnline(workerProfile.userId, nextOnline);
      }
      showToast(
        nextOnline
          ? 'Your profile is now shown as Online.'
          : 'Your profile is now shown as Offline.'
      );
      return nextOnline;
    });
  }, [workerProfile, setManagedUserOnline, showToast]);

  return {
    workerProfile,
    viewMode,
    setViewMode,
    isAdminUnlocked,
    profileOnlineStatus,
    activeUserRecord,
    effectiveRole,
    effectivePermissions,
    effectiveAdminUnlocked,
    canLogSalesPurchases,
    canManageOrders,
    canEditStock,
    canEditRecipes,
    loginWithAccount,
    loginWithPasscode,
    unlockAdmin,
    signOut,
    toggleMyOnlineStatus
  };
}
