import { EventRunner } from "edaw";
import type { NotesRepo } from "../infrastructure/NotesRepository";

export const RemoveNote = EventRunner.prepareEvent<undefined, { id: number }, NotesRepo>(async ({ repo, params }) => {
  if (!params || params.id == null) throw new Error("required number param id");
  if (typeof params.id != 'number') throw new Error("param id expect to be number");
  
  const notes = await repo.get();

  const newNotes = notes.filter((itm) => itm.id !== params.id);

  repo.set(newNotes);
});