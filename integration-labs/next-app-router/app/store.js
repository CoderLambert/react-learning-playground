const key = Symbol.for("react-learning-next-notes");
const root = globalThis;
if (!root[key]) root[key] = [{ id: 1, text: "Rendered by a Server Component" }];
export function getNotes() { return root[key]; }
export function addNote(text) { const note = { id: Date.now(), text }; root[key] = [note, ...root[key]]; return note; }
