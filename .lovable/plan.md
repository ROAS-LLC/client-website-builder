## Goal

Turn this into a bare-bones demo/template project. A single homepage with the message:

> **Demo Site Reviewer**
> Contact your manager for your preview link.

## Changes

1. **`src/routes/index.tsx`** — replace the placeholder with a centered, clean hero:
   - H1: "Demo Site Reviewer"
   - Subtext: "Contact your manager for your preview link."
   - Uses semantic design tokens (`bg-background`, `text-foreground`, `text-muted-foreground`)
   - Update `head()` meta: title "Demo Site Reviewer", matching description + og tags

2. **`src/routes/__root.tsx`** — update default root meta title/description from "Lovable App" to "Demo Site Reviewer" so unmatched routes and SSR fallback show the right name.

No new routes, no nav, no extra pages. No backend.
