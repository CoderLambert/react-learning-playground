# Next.js App Router Real Lab

Uses Next.js 16.3.3 App Router. `app/page.js` is a real Server Component; `NoteForm.js` is a real Client Component selected by `"use client"`; `actions.js` exports a real Server Action selected by `"use server"` and invoked through `<form action>`/`useActionState`.

```bash
npm install
npm run dev
npm run build
npm run start
```

The in-memory server store is intentionally non-production and resets with the server process. It exists only to make the mutation path observable without external infrastructure.

Important boundary: Client Components can participate in server prerendering in supporting frameworks; `"use client"` defines the client module boundary, not “browser-only HTML generation”. `"use server"` marks Server Functions, not Server Components. SSR and RSC are distinct layers that Next.js can combine.

Official references: Next.js App Router, Server/Client Components, and mutating data with Server Actions.
