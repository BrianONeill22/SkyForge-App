import { useState, useEffect, useRef, useMemo } from 'react';
import {
  connectCloudLedger,
  pushLedgerStateToCloud,
  startPresenceHeartbeat
} from '../services/cloudSync';

export function useCloudSync({
  ledgerSnapshot,
  applyRemoteSnapshot,
  workerProfile,
  profileOnlineStatus
}) {
  const [cloudUser, setCloudUser] = useState(null);
  const [cloudStatus, setCloudStatus] = useState('connecting');
  const [cloudErrorMsg, setCloudErrorMsg] = useState('');
  const [sessionId] = useState(
    () => `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );
  const [presenceList, setPresenceList] = useState([]);

  const sharedDocRef = useRef(null);
  const presenceColRef = useRef(null);
  const isApplyingRemoteRef = useRef(false);
  const hasHydratedFromCloudRef = useRef(false);
  const saveTimeoutRef = useRef(null);
  const applyRemoteRef = useRef(applyRemoteSnapshot);
  applyRemoteRef.current = applyRemoteSnapshot;

  useEffect(() => {
    let activeConnection = null;
    let cancelled = false;

    async function init() {
      try {
        const connection = await connectCloudLedger({
          onAuthUser: (user) => {
            if (!cancelled) setCloudUser(user);
          },
          onPresenceUpdate: (active) => {
            if (!cancelled) setPresenceList(active);
          },
          onRemoteState: (data) => {
            if (cancelled) return;
            isApplyingRemoteRef.current = true;
            applyRemoteRef.current(data);
            setTimeout(() => {
              isApplyingRemoteRef.current = false;
            }, 80);
            hasHydratedFromCloudRef.current = true;
          },
          onStatusChange: (status, errMsg) => {
            if (cancelled) return;
            if (status === 'synced') {
              hasHydratedFromCloudRef.current = true;
            }
            setCloudStatus(status);
            setCloudErrorMsg(errMsg || '');
          }
        });

        if (cancelled) {
          connection?.disconnect();
          return;
        }

        if (connection) {
          activeConnection = connection;
          sharedDocRef.current = connection.stateDocRef;
          presenceColRef.current = connection.presenceColRef;
        }
      } catch (err) {
        if (!cancelled) {
          setCloudStatus('offline');
          setCloudErrorMsg(err?.message || 'Cloud sync initialization failed.');
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      activeConnection?.disconnect();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!cloudUser || !presenceColRef.current) return undefined;
    return startPresenceHeartbeat({
      presenceColRef: presenceColRef.current,
      sessionId,
      workerProfile,
      profileOnlineStatus
    });
  }, [cloudUser, sessionId, workerProfile, profileOnlineStatus]);

  useEffect(() => {
    if (!cloudUser || !sharedDocRef.current || !hasHydratedFromCloudRef.current) return;
    if (isApplyingRemoteRef.current) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await pushLedgerStateToCloud(sharedDocRef.current, ledgerSnapshot);
        setCloudStatus('synced');
      } catch (err) {
        setCloudStatus('offline');
        setCloudErrorMsg(err?.message || 'Failed to sync changes to cloud.');
      }
    }, 250);
  }, [cloudUser, ledgerSnapshot]);

  const presenceStats = useMemo(() => {
    const activeSessions =
      presenceList.length > 0
        ? presenceList
        : [
            {
              id: sessionId,
              isViewing: true,
              isProfileOnline: Boolean(workerProfile) && profileOnlineStatus,
              userId: workerProfile?.userId || workerProfile?.id || null,
              profileName: workerProfile?.name || 'Visitor'
            }
          ];

    const viewersCount = activeSessions.length;
    const onlineProfileSessions = activeSessions.filter((s) => s.isProfileOnline);
    const uniqueProfileKeys = new Set(
      onlineProfileSessions.map((s) => s.userId || s.profileName || s.id)
    );

    return {
      viewersCount,
      activeProfilesCount: uniqueProfileKeys.size,
      onlineProfileSessions
    };
  }, [presenceList, sessionId, workerProfile, profileOnlineStatus]);

  return {
    cloudStatus,
    cloudErrorMsg,
    presenceStats
  };
}
