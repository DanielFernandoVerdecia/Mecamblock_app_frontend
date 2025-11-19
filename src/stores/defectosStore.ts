import { createLocalStore } from './localStore';
import type { Defecto } from '$lib/models/defecto';

export const defectosStore = createLocalStore<Defecto>('defectos', []);
