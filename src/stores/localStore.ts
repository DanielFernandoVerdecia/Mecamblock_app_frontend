// createLocalStore: store que sincroniza con localStorage
import { writable } from 'svelte/store';


export function createLocalStore<T>(key: string, initial: T[]) {
    const isBrowser = typeof localStorage !== 'undefined';
    const stored = isBrowser ? localStorage.getItem(key) : null;
    const parsed = stored ? JSON.parse(stored) as T[] : initial;
    const { subscribe, set, update } = writable<T[]>(parsed);


    subscribe((value) => {
    if (isBrowser) localStorage.setItem(key, JSON.stringify(value));
    });


    return {
        subscribe,
        set,
        update,
        add: (item: T) => update(arr => [...arr, item]),
        remove: (predicate: (t: T) => boolean) => update(arr => arr.filter(x => !predicate(x))),
        replace: (predicate: (t: T) => boolean, replacer: (t: T) => T) => update(arr => arr.map(x => predicate(x) ? replacer(x) : x))
    };
}