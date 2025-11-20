import { createLocalStore } from './localStore';
import type { ProductionRecord } from '$lib/models/production';

export const stockStore = createLocalStore<ProductionRecord>('produccion', []);
