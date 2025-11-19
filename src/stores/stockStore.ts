import { createLocalStore } from './localStore';
import type { StockItem } from '$lib/models/stock';

export const stockStore = createLocalStore<StockItem>('stock', []);