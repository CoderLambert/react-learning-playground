import NoteForm from "./NoteForm";
import { getNotes } from "./store";

export const dynamic = "force-dynamic";
export default async function Page() {
  const notes = getNotes();
  const serverRenderedAt = new Date().toISOString();
  return <main><h1>Next.js 16 App Router · real framework lab</h1><section><h2>Server Component</h2><p>This page executes on the server. It can read the server-side store without shipping this module as client JavaScript.</p><p>server render: <code>{serverRenderedAt}</code></p><ul>{notes.map((note) => <li key={note.id}>{note.text}</li>)}</ul></section><NoteForm/><section><h2>Boundary model</h2><p>Next.js provides the App Router, Server Component runtime, rendering/caching conventions and Server Action integration. React provides the component model and Server Function primitives; these framework conventions are not React Core routing APIs.</p></section></main>;
}
