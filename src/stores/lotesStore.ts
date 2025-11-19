import { createLocalStore } from './localStore';
import type { Lote } from '$lib/models/lote';

export const lotesStore = createLocalStore<Lote>('lotes', []);
