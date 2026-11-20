import { useRef, useState, type ReactNode } from 'react';
import { actionFailure, actionReadiness, runConnectedAction } from './connections';

export const integrationPreview = process.env.NEXT_PUBLIC_CANDIDATE_INTEGRATION_PREVIEW === 'true';

export function ConnectionAction({ id, children, report, dispatch, primary = false }: {
  id: string; children: ReactNode; report: (message: string) => void;
  dispatch?: () => Promise<void>; primary?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const inFlight = useRef(false);
  const action = actionReadiness(id);
  const pending = action.connection_state !== 'verified';
  async function execute() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    try {
      await runConnectedAction(id, integrationPreview, async () => {
        if (!dispatch) throw new Error('The action handler is unavailable.');
        await dispatch();
      }, report);
    } catch (error) {
      report(actionFailure(error));
    } finally { inFlight.current = false; setBusy(false); }
  }
  return <button type="button" data-connection-action={id} className={`jp-button ${primary ? 'jp-primary' : ''}`} onClick={execute} disabled={busy} aria-busy={busy}>
    <span>{busy ? 'Working…' : children}</span>
    {pending && <small className="jp-pending">{integrationPreview ? action.connection_state === 'not_connected' ? 'Backend pending' : 'Verification pending' : 'Unavailable'}</small>}
  </button>;
}
