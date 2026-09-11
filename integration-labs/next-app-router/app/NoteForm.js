"use client";
import { useActionState, useState } from "react";
import { saveNote } from "./actions";

export default function NoteForm() {
  const [clicks, setClicks] = useState(0);
  const [state, action, pending] = useActionState(saveNote, { ok: false, message: "No mutation yet" });
  return <section><h2>Client Component island</h2><p>This module ships client code because it uses state/events. Local clicks: {clicks}</p><button onClick={() => setClicks((n) => n + 1)}>Client interaction</button><form action={action}><input name="note" placeholder="note persisted in server memory"/><button disabled={pending}>{pending ? "Saving on server…" : "Run Server Action"}</button></form><p role="status">{state.message}</p></section>;
}
