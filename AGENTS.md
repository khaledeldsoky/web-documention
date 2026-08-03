<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:docs-skills -->
# Project Skills (load when relevant)

This project has conventions encoded in SKILL.md files. Load the relevant one based on the task:

| Task | Skill to load |
|---|---|
| Design system, colors, typography, dark/light mode | `/root/Docs/skills/docs-theme/SKILL.md` |
| Building or modifying doc components | `/root/Docs/skills/docs-components/SKILL.md` |
| i18n, translations, RTL layout, Arabic fonts | `/root/Docs/skills/docs-i18n/SKILL.md` |
| Next.js 16 conventions, file structure, config | `/root/Docs/skills/docs-nextjs/SKILL.md` |
| First-time setup or full build | `STARTER.md` |

## Air-Gap Rule

Every `dnf install` (or `yum install`) package used on an air-gapped VM **must** be included in the offline bundle's "Download RPMs" section. Before writing `dnf install X` inside an air-gapped CodeBlock, add `X` to the `dnf download` list in the course's offline bundle section. This applies to the k8s-airgap-ha course.

## Courses

| Course | Sections | Description |
|--------|----------|-------------|
| `openshift-upi-v414` | 12 | OpenShift 4.14 UPI on vSphere |
| `linux-admin` | 23 | Linux system administration |
| `k8s-airgap-ha` | 24 | Kubernetes HA air-gapped deployment |

<!-- END:docs-skills -->
