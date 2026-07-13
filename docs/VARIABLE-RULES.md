# Variable System Rules

Three cases govern how variable values behave across the VariablesTable and code blocks.

---

## Case 1: Default (first open)

The user opens the docs for the first time. No values have been entered or cleared.

**VariablesTable:** Placeholder (e.g., `<VCENTER_IP>`) shown in **dark orange** (`var(--accent3)`). This means the variable is "active" — it will be used as-is.

**Code blocks:** Placeholder `<VCENTER_IP>` is **visible** with dark orange styling. The user sees exactly what will be exported.

**localStorage:** Empty — no key exists for this variable.

---

## Case 2: Cleared

The user deletes the value from the VariablesTable input. They do not need this variable.

**VariablesTable:** Placeholder (e.g., `<VCENTER_IP>`) shown in **light orange** (`color-mix(in srgb, var(--accent3) 40%, transparent)`). This means the variable is "inactive" — it will not be used.

**Code blocks:** Placeholder is **hidden** — the space shows nothing (empty string). For export commands, this means `export GATEWAY=""`.

**localStorage:** Key exists with empty string value: `{ "GATEWAY": "" }`.

---

## Case 3: Custom

The user types their own value into the VariablesTable input.

**VariablesTable:** Value shown in **dark orange** (`var(--accent3)`). The input displays the actual value, not the placeholder.

**Code blocks:** Value is **visible** — replaces the placeholder. For export commands, this means `export GATEWAY="10.10.10.1"`.

**localStorage:** Key exists with the user's value: `{ "GATEWAY": "10.10.10.1" }`.

---

## Summary Table

| Case | Table Color | Table Text | Code Block | localStorage |
|---|---|---|---|---|
| 1. Default | Dark orange | `<VAR>` placeholder | `<VAR>` visible | Empty (undefined) |
| 2. Cleared | Light orange | `<VAR>` placeholder | Empty string | `""` |
| 3. Custom | Dark orange | User's value | User's value | `"value"` |

---

## Components

| Component | Case 1 | Case 2 | Case 3 |
|---|---|---|---|
| `VariablesTable` input | Dark orange, placeholder | Light orange, placeholder | Dark orange, value |
| `VarReplace` (code blocks) | Keeps `<VAR>` text | Clears to `""` | Shows value |
| `Var` (prose text) | Amber `<VAR>` | Amber `<VAR>` | Green value |

---

## Implementation Notes

- **Distinguishing Case 1 from Case 2:** `undefined` (Case 1) vs `""` (Case 2) in localStorage. The VariablesTable uses `vars[varName] || val` to show placeholder for both, but colors differ.
- **VarReplace behavior:** Only clears when `value === ""`. When `value` is `undefined`, the initial `<VAR>` text from CodeBlock is preserved.
- **CodeBlock auto-detection:** The `<VAR_NAME>` pattern in code blocks is automatically converted to `<span data-var="VAR_NAME">` elements by CodeBlock. VarReplace then manages their text content.
