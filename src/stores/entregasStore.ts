import { createLocalStore } from './localStore';
import type { Entrega } from '$lib/models/entrega';
export const entregasStore = createLocalStore<Entrega>('entregas', []);