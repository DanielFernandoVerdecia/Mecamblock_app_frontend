import { createLocalStore } from './localStore';
import type { HistoryEntry } from '$lib/models/historyEntry';
import { HistoryEntry as HistoryEntryClass } from '$lib/models/historyEntry';

// store simple append-only
export const historyStore = createLocalStore<HistoryEntry>('history', []);

// helper para añadir history (normalizamos payload)
export function addHistory(payload: { action: any; usuario: string; motivo: string; loteId?: number; producto?: string }) {
  const h = new HistoryEntryClass(payload.action, payload.usuario, payload.motivo, payload.loteId, payload.producto);
  historyStore.add(h);
  return h;
}