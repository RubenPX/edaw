import { type EventBus } from "edaw";

import type { Note } from "../domain/Note";

export class LocalStorageNotesRepository {
  constructor(public bus: EventBus) {}

  async get(): Promise<Note[] | null> {
    return (await this.bus.postReturn<Note[], null>("NotesRepo", "LoadNotes")).returnData ?? null;
  }

  async set(data: Note[]): Promise<undefined> {
    return (await this.bus.postReturn<undefined, Note[]>("NotesRepo", "SaveNotes", data)).returnData;
  }
}