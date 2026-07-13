export type VarMap = Record<string, string>;
type Listener = () => void;

const stores: Record<string, VarMap> = {};
const listeners = new Set<Listener>();

export function getStore(course: string): VarMap {
  return stores[course] ?? {};
}

export function setVar(course: string, name: string, value: string) {
  const s = stores[course] ?? {};
  stores[course] = { ...s, [name]: value };
  try {
    localStorage.setItem(`${course}-vars`, JSON.stringify(stores[course]));
  } catch {}
  listeners.forEach((fn) => fn());
}

export function loadFromStorage(course: string) {
  try {
    const raw = localStorage.getItem(`${course}-vars`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        stores[course] = { ...stores[course], ...parsed };
        listeners.forEach((fn) => fn());
      }
    }
  } catch {}
}

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
