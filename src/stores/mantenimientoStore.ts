import { createLocalStore } from './localStore';
import type { Mantenimiento } from '$lib/models/mantenimiento';

export const mantenimientoStore = createLocalStore<Mantenimiento>('mantenimientos', []);
