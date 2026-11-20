import registry from '../../docs/candidate-ui/connection-actions.json' with { type: 'json' };

export type ConnectionState = 'not_connected' | 'unverified' | 'verified';
export interface ConnectionAction {
  id: string;
  screen?: string;
  gap_ids: string[];
  connection_state: ConnectionState;
  api_operation: string | null;
  verification_evidence: string[];
}

export function actionReadiness(id: string): ConnectionAction {
  const action = registry.actions.find(item => item.id === id);
  if (!action) throw new Error(`Unregistered candidate action: ${id}`);
  if (action.connection_state === 'verified' && (!action.api_operation || !action.verification_evidence.length)) {
    return { ...action, connection_state: 'unverified' } as ConnectionAction;
  }
  return action as ConnectionAction;
}

export function connectionFeedback(action: ConnectionAction, preview: boolean): string | null {
  if (action.connection_state === 'verified') return null;
  if (!preview) return 'This action is not available yet. Please try again when it becomes available.';
  if (action.connection_state === 'unverified') return `Backend connection not verified for this action. Tracking reference: ${action.gap_ids.join(', ')}.`;
  return `Backend not connected. This action cannot run yet. No changes were saved. Tracking reference: ${action.gap_ids.join(', ')}.`;
}

export function actionFailure(error: unknown): string {
  return error instanceof TypeError || (error instanceof Error && error.name === 'AbortError')
    ? 'The result could not be confirmed. Check the latest record before retrying.'
    : `Could not complete this action. ${error instanceof Error ? error.message : 'Please retry.'}`;
}

/** The dispatch boundary for data actions in the candidate implementation. */
export async function runConnectedAction<T>(id: string, preview: boolean, dispatch: () => Promise<T>, report: (message: string) => void): Promise<{ executed: false } | { executed: true; value: T }> {
  const feedback = connectionFeedback(actionReadiness(id), preview);
  if (feedback) { report(feedback); return { executed: false }; }
  return { executed: true, value: await dispatch() };
}
