import { createLocalStore } from './localStore';
import type { Produccion } from '$lib/models/produccion';

export const stockStore = createLocalStore<Produccion>('produccion', []);
