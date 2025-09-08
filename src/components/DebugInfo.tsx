import { useAuth } from '@/hooks/useAuth';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useGatedAction } from '@/hooks/useGatedAction';
import { isFeatureEnabled } from '@/config/featureFlags';

export function DebugInfo() {
  const { user } = useAuth();
  const { isDemoMode } = useDemoMode();
  const { gatedAction, isBlocked } = useGatedAction();
  
  if (!import.meta.env.DEV) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg text-xs z-[10000] max-w-sm">
      <h3 className="font-bold mb-2">🐛 Debug Info</h3>
      <div className="space-y-1">
        <div>User: {user ? 'Logged in' : 'Not logged in'}</div>
        <div>Demo Mode: {isDemoMode ? 'ON' : 'OFF'}</div>
        <div>Gating: {isFeatureEnabled('ENABLE_GATING') ? 'ON' : 'OFF'}</div>
        <div>Tour: {isFeatureEnabled('ENABLE_TOUR') ? 'ON' : 'OFF'}</div>
        <div>Create Setal Blocked: {isBlocked('create_setal') ? 'YES' : 'NO'}</div>
        <div>Tour Completed: {localStorage.getItem('demo_tour_completed') || 'NO'}</div>
        <div>Z-Index: 10000</div>
      </div>
    </div>
  );
}
