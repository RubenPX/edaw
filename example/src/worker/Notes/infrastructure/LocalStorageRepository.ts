import { ContextRoute, type EventBus, EventRunner } from "edaw";

import type { Note } from "../domain/Note";
import type { NotesRepository } from "../domain/NotesRepository";

class ClientLocalStorage {
  public static GetNotesEvent = EventRunner.prepareEvent<Note[] | null, undefined, undefined>(async () => {
    const data = localStorage.getItem("AppNotes");
    if (data) return JSON.parse(data);
    return null;
  });

  public static SetNotesEvent = EventRunner.prepareEvent<undefined, Note[], undefined>(async ({ params }) => {
    if (params) localStorage.setItem("AppNotes", JSON.stringify(params));
  });
}


export class LocalStorageNotesRepository {
  constructor(public bus: EventBus) {}

  async get(): Promise<Note[] | null> {
    return (await this.bus.postReturn<Note[], null>("NotesRepo", "GetNotes")).returnData ?? null;
  }

  async set(data: Note[]): Promise<undefined> {
    return (await this.bus.postReturn<undefined, Note[]>("NotesRepo", "SetNotes", data)).returnData;
  }
}

export class LocalStorageNotesClientContext extends ContextRoute<NotesRepository>{

  public repos = undefined;

  public EventRoutes = { 
    GetNotes : ClientLocalStorage.GetNotesEvent(this.repos),
    SetNotes : ClientLocalStorage.SetNotesEvent(this.repos)
  };

  public contextName: string = "NotesRepo";
}
