import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot
} from 'firebase/firestore';
import {
  resolveActiveFirebaseConfig,
  resolveCloudAppId,
  resolveInitialAuthToken
} from '../config/firebaseConfig';

export async function connectCloudLedger({
  onAuthUser,
  onPresenceUpdate,
  onRemoteState,
  onStatusChange
}) {
  const activeConfig = resolveActiveFirebaseConfig();
  if (!activeConfig) {
    onStatusChange('offline', 'Cloud keys not configured yet — running in single-session mode.');
    return null;
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(activeConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const resolvedAppId = resolveCloudAppId();

  const stateDocRef = doc(db, 'artifacts', resolvedAppId, 'public', 'data', 'forge_state', 'main');
  const presenceColRef = collection(db, 'artifacts', resolvedAppId, 'public', 'data', 'presence');

  const initialToken = resolveInitialAuthToken();
  if (initialToken) {
    await signInWithCustomToken(auth, initialToken);
  } else {
    await signInAnonymously(auth);
  }

  let unsubscribeSnapshot = null;
  let unsubscribePresence = null;

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    onAuthUser(user || null);
    if (!user) return;

    unsubscribePresence = onSnapshot(
      presenceColRef,
      (snap) => {
        const now = Date.now();
        const active = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data() || {};
          if (d.lastSeen && now - d.lastSeen < 45000) {
            active.push({ id: docSnap.id, ...d });
          }
        });
        onPresenceUpdate(active);
      },
      () => {}
    );

    unsubscribeSnapshot = onSnapshot(
      stateDocRef,
      (snap) => {
        if (snap.exists()) {
          onRemoteState(snap.data() || {});
        }
        onStatusChange('synced', '');
      },
      (err) => {
        onStatusChange('offline', err?.message || 'Unable to reach live cloud ledger.');
      }
    );
  });

  return {
    stateDocRef,
    presenceColRef,
    disconnect() {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      if (unsubscribePresence) unsubscribePresence();
      if (unsubscribeAuth) unsubscribeAuth();
    }
  };
}

export async function pushLedgerStateToCloud(stateDocRef, snapshot) {
  await setDoc(
    stateDocRef,
    {
      ...snapshot,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );
}

export function startPresenceHeartbeat({ presenceColRef, sessionId, workerProfile, profileOnlineStatus }) {
  const myPresenceDoc = doc(presenceColRef, sessionId);

  const writeHeartbeat = () => {
    const hasSignedInProfile = Boolean(workerProfile);
    const isProfileVisibleOnline = hasSignedInProfile && profileOnlineStatus;
    setDoc(
      myPresenceDoc,
      {
        lastSeen: Date.now(),
        isViewing: true,
        hasProfile: hasSignedInProfile,
        isProfileOnline: isProfileVisibleOnline,
        userId: workerProfile?.userId || workerProfile?.id || null,
        profileName: workerProfile?.name || 'Visitor',
        role: workerProfile?.roleType || 'visitor'
      },
      { merge: true }
    ).catch(() => {});
  };

  writeHeartbeat();
  const interval = setInterval(writeHeartbeat, 15000);

  const handleBeforeUnload = () => {
    deleteDoc(myPresenceDoc).catch(() => {});
  };
  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    clearInterval(interval);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}
