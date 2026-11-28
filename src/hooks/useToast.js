import { useState, useRef, useCallback, useEffect } from 'react';

export function useToast() {
  const [toastMsg, setToastMsg] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((text, type = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToastMsg({ text, type });
    timerRef.current = setTimeout(() => setToastMsg(null), 3500);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { toastMsg, showToast };
}
