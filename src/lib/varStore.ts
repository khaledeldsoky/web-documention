export type VarMap = Record<string, string>;
type Listener = () => void;

const stores: Record<string, VarMap> = {};
const listeners: Record<string, Set<Listener>> = {};
const loaded = new Set<string>();

export function getStore(course: string): VarMap {
  return stores[course] ?? {};
}

export function setVar(course: string, name: string, value: string) {
  const s = stores[course] ?? {};
  stores[course] = { ...s, [name]: value };
  try {
    localStorage.setItem(`${course}-vars`, JSON.stringify(stores[course]));
  } catch {}
  (listeners[course] ?? new Set()).forEach((fn) => fn());
}

export function loadFromStorage(course: string) {
  if (loaded.has(course)) return;
  loaded.add(course);
  try {
    const raw = localStorage.getItem(`${course}-vars`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        stores[course] = { ...stores[course], ...parsed };
        (listeners[course] ?? new Set()).forEach((fn) => fn());
      }
    }
  } catch {}
}

export function subscribe(course: string, fn: Listener) {
  if (!listeners[course]) listeners[course] = new Set();
  listeners[course].add(fn);
  return () => { listeners[course]?.delete(fn); };
}
