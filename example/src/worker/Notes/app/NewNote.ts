import { EventRunner } from "edaw";
import type { Note } from "../domain/Note";
import { NotesRepo } from "../infrastructure/NotesRepository";

export const NewNote = EventRunner.prepareEvent<Note, Omit<Note, 'id' | 'createdAt'>, NotesRepo>(async ({ repo, params }) => {
  if (!params) throw new Error("Params is required");

  const notes = await repo.get();

  const newNote = {
    id        : notes.length,
    title     : params.title,
    text      : params.text,
    color     : params.color,
    createdAt : new Date(),
  };

  notes.push(newNote);

  repo.set(notes);

  return newNote;
});