export type VarMap = Record<string, string>;
type Listener = () => void;

let store: VarMap = {};
const listeners = new Set<Listener>();

export function getStore(): VarMap {
  return store;
}

export function setVar(name: string, value: string) {
  store = { ...store, [name]: value };
  try {
    localStorage.setItem("openshift-vars", JSON.stringify(store));
  } catch {}
  listeners.forEach((fn) => fn());
}

export function loadFromStorage() {
  try {
    const raw = localStorage.getItem("openshift-vars");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        store = { ...store, ...parsed };
        listeners.forEach((fn) => fn());
      }
    }
  } catch {}
}

export function subscribe(fn: Listener) {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}
