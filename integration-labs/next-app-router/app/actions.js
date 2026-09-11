"use server";
import { revalidatePath } from "next/cache";
import { addNote } from "./store";

export async function saveNote(_previousState, formData) {
  const text = String(formData.get("note") ?? "").trim();
  if (!text) return { ok: false, message: "Server Action rejected an empty note" };
  const note = addNote(text);
  revalidatePath("/");
  return { ok: true, message: `Server saved note #${note.id}` };
}
