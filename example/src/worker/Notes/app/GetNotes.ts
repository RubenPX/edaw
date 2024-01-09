import { EventMessage } from "../../../../../src/Event/EventMessage";
import { EventRunner } from "edaw";
import type { Note } from "../domain/Note";
import type { NotesRepo } from "../infrastructure/NotesRepository";

export const GetNotes = EventRunner.prepareEvent<Note[], { searchText: string }, NotesRepo>(async ({ repo, params, bus, evMsg }) => {
  repo.onUpdate("GetNotes", () => bus.publish(EventMessage.regenerate(evMsg)));

  if (params && params.searchText) {
    const notes = await repo.get();
    return notes.filter(itm => itm.text == params.searchText || itm.title == params.searchText);
  }

  return await repo.get();
});