import { useEffect, useState } from 'react';
import { getLiveTracking } from '../lib/mockData';

// Ticks every second and recomputes the journey state from the stored
// tracking snapshot (deterministic: startedAt + totalMinutes), so the ETA
// countdown stays live for both parties with no extra writes to the DB.
export default function useLiveTracking(tracking, intervalMs = 1000) {
  const [live, setLive] = useState(() => getLiveTracking(tracking));
  useEffect(() => {
    const compute = () => setLive(getLiveTracking(tracking));
    compute();
    const timer = setInterval(compute, intervalMs);
    return () => clearInterval(timer);
  }, [tracking, intervalMs]);
  return live;
}
